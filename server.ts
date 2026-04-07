const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/candidaturas-rh";

const server = Bun.serve({
    port: 3000,
    async fetch(req: any) {
        const url = new URL(req.url);

        // 1. ENDPOINT DA API: Recebe do React e envia para o n8n
        if (req.method === "POST" && url.pathname === "/api/candidaturas") {
            try {
                // 1.1 Extrair dados do FormData vindo do Browser
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

                console.log(`📥 Candidatura recebida no Bun: ${fullName} (${position})`);

                // 1.2 ENVIAR PARA O n8n (ORQUESTRADOR)
                console.log(`🚀 A encaminhar para o n8n em: ${N8N_WEBHOOK_URL}...`);
                
                try {
                    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
                        method: "POST",
                        body: formdata, // Repassamos o FormData integralmente (incluindo o ficheiro)
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

        // 2. SERVIR O CÓDIGO REACT (Frontend)
        if (url.pathname === "/index.js") {
            const build = await Bun.build({
                entrypoints: ["./src/index.tsx"],
            });

            if (!build.success) {
                console.error("Erro no Build do React:", build.logs);
                return new Response("Erro ao compilar o React", { status: 500 });
            }

            return new Response(build.outputs[0], {
                headers: { "Content-Type": "application/javascript" },
            });
        }

        // 3. SERVIR O HTML BASE
        return new Response(`
      <!DOCTYPE html>
      <html lang="pt">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Portal de Recrutamento - RH</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { font-family: system-ui, sans-serif; background-color: #f3f4f6; color: #333; }
          </style>
        </head>
        <body>
          <div id="root" class="min-h-screen"></div>
          <script type="module" src="/index.js"></script>
        </body>
      </html>
    `, {
            headers: { "Content-Type": "text/html" }
        });
    },
});

console.log(`🚀 Servidor e Portal a correr em: http://localhost:${server.port}`);