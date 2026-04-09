import dbClient from '../db/client';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL ?? "http://localhost:5678/webhook/candidaturas-rh";

export const candidateController = {
    async submit(req: Request) {
        try {
            const formdata = await req.formData();
            const fullName = formdata.get("fullName");
            const email = formdata.get("email");
            const position = formdata.get("position");
            const resume = formdata.get("resume");

            if (!fullName || !email || !resume) {
                return new Response("Dados incompletos.", { status: 400 });
            }

            try {
                const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
                    method: "POST",
                    body: formdata,
                });

                if (n8nResponse.ok) {
                    return new Response(JSON.stringify({ message: "Candidatura enviada!" }), {
                        status: 200,
                        headers: { "Content-Type": "application/json" }
                    });
                }
                return new Response("Erro no orquestrador.", { status: 502 });
            } catch (error) {
                return new Response("Serviço de automação offline.", { status: 503 });
            }
        } catch (error) {
            return new Response("Erro interno.", { status: 500 });
        }
    },

    async list() {
        try {
            const res = await dbClient.query("SELECT * FROM candidates ORDER BY applied_at DESC");
            return new Response(JSON.stringify(res.rows), { headers: { "Content-Type": "application/json" } });
        } catch (error) {
            return new Response(JSON.stringify([]), { status: 500, headers: { "Content-Type": "application/json" } });
        }
    },

    async updateStatus(req: Request) {
        try {
            const { id, status } = await req.json();
            await dbClient.query("UPDATE candidates SET status = $1 WHERE id = $2", [status, id]);
            return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
        } catch (error) {
            return new Response("Erro ao atualizar status", { status: 500 });
        }
    }
};
