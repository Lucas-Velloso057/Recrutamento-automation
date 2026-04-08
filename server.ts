import { Client } from 'pg';

const PORT = process.env.PORT || 3000;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL ?? "http://localhost:5678/webhook/candidaturas-rh";

// Inicializa conexão com o PostgreSQL
const dbClient = new Client({
    connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/candidates"
});
dbClient.connect().catch((err: any) => console.error("⚠️ Aviso: Banco de dados não conectado. Verifique DATABASE_URL.", err));

const server = Bun.serve({
    port: PORT,
    async fetch(req: any) {
        const url = new URL(req.url);

        //Recebe do React e envia para o n8n
        if (req.method === "POST" && url.pathname === "/api/candidaturas") {
            try {
                // Extrair dados do FormData vindo do Browser
                const formdata = await req.formData();

                const fullName = formdata.get("fullName");
                const email = formdata.get("email");
                const position = formdata.get("position");
                const resume = formdata.get("resume") as File | null;

                // Validação básica de segurança (Double Check)
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

        // ==========================================
        // ROTAS DO DASHBOARD ADMIN (DB POSTGRES)
        // ==========================================
        if (req.method === "GET" && url.pathname === "/api/admin/candidates") {
            try {
                const res = await dbClient.query("SELECT * FROM candidates ORDER BY applied_at DESC");
                return new Response(JSON.stringify(res.rows), { headers: { "Content-Type": "application/json" } });
            } catch (error) {
                console.error("Erro ao buscar candidatos:", error);
                return new Response(JSON.stringify([]), { status: 500, headers: { "Content-Type": "application/json" } });
            }
        }

        if (req.method === "POST" && url.pathname === "/api/admin/update-status") {
            try {
                const body = await req.json();
                await dbClient.query("UPDATE candidates SET status = $1 WHERE id = $2", [body.status, body.id]);
                return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
            } catch (error) {
                console.error("Erro ao atualizar status:", error);
                return new Response("Erro ao atualizar status", { status: 500 });
            }
        }

        // ==========================================
        // SERVIR O FRONTEND (React SPA)
        // ==========================================
        if (url.pathname === "/index.js") {
            const distFile = Bun.file("./dist/index.js");
            if (await distFile.exists()) {
                return new Response(distFile, {
                    headers: { "Content-Type": "application/javascript; charset=utf-8" },
                });
            }
            return new Response("Erro: Arquivo ./dist/index.js não encontrado.", { status: 404 });
        }

        // Fallback SPA: Qualquer outra rota (como / ou /admin) devolve o index.html gerido pelo React Router
        let filePath = `.${url.pathname}`;
        const file = Bun.file(filePath);
        if (url.pathname !== "/" && await file.exists()) {
            return new Response(file);
        }

        // SERVIR O HTML BASE PARA ROTAS DESCONHECIDAS
        return new Response(`
      <!DOCTYPE html>
      <html lang="pt">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Portal de Recrutamento - RH</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-slate-50">
          <div id="root"></div>
          <script type="module" src="/index.js"></script>
        </body>
      </html>
    `, {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    },
});

console.log(`Servidor executando em: http://${process.env.N8N_HOST || 'localhost'}:${server.port}`);