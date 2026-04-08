const PORT = process.env.PORT || 3000;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL ?? "http://localhost:5678/webhook/candidaturas-rh";

const server = Bun.serve({
    port: PORT,
    async fetch(req: any) {
        const url = new URL(req.url);
        const path = url.pathname;

        // 1. Recebe do React e envia para o n8n
        if (req.method === "POST" && path === "/api/candidaturas") {
            try {
                const formdata = await req.formData();
                const fullName = formdata.get("fullName");
                const email = formdata.get("email");
                const position = formdata.get("position");
                const resume = formdata.get("resume") as File | null;

                if (!fullName || !email || !resume) {
                    console.error("❌ Tentativa de envio com dados incompletos.");
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
                    } else {
                        const errorText = await n8nResponse.text();
                        console.error(`❌ n8n respondeu com erro: ${n8nResponse.status} - ${errorText}`);
                        return new Response("Erro no orquestrador.", { status: 502 });
                    }
                } catch (fetchError) {
                    console.error("❌ FALHA DE CONEXÃO: O n8n está rodando no Docker?");
                    return new Response("Serviço de automação offline.", { status: 503 });
                }
            } catch (error) {
                console.error("❌ Erro crítico no servidor:", error);
                return new Response("Erro interno do servidor.", { status: 500 });
            }
        }

        // 2. Servir arquivos estáticos e compilar TSX on-the-fly (Super Poder do Bun)
        let filePath = path === "/" ? "./index.html" : `.${path}`;
        const file = Bun.file(filePath);

        if (await file.exists()) {
            return new Response(file);
        }

        return new Response("Página não encontrada", { status: 404 });
    },
});

console.log(`🚀 Servidor executando em: http://localhost:${server.port}`);