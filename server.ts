const PORT = process.env.PORT || 3000;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL?? "http://localhost:5678/webhook/candidaturas-rh";

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

        // SERVIR O CÓDIGO REACT (Frontend)
        if (url.pathname === "/index.js") {
            const distFile = Bun.file("./dist/index.js");
            if (await distFile.exists()) {
                return new Response(distFile, {
                    headers: { "Content-Type": "application/javascript; charset=utf-8" },
                });
            }
            return new Response("Erro: Arquivo ./dist/index.js não encontrado.", { status: 404 });
        }

        // SERVIR O HTML BASE
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