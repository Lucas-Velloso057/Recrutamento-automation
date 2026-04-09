import { candidateController } from '../controllers/candidateController';

export const router = async (req: Request) => {
    const url = new URL(req.url);

    // API Routes
    if (req.method === "POST" && url.pathname === "/api/candidaturas") {
        return candidateController.submit(req);
    }

    if (req.method === "GET" && url.pathname === "/api/admin/candidates") {
        return candidateController.list();
    }

    if (req.method === "POST" && url.pathname === "/api/admin/update-status") {
        return candidateController.updateStatus(req);
    }

    // Static Assets & SPA Fallback
    if (url.pathname === "/index.js") {
        const distFile = Bun.file("./dist/index.js");
        if (await distFile.exists()) {
            return new Response(distFile, {
                headers: { "Content-Type": "application/javascript; charset=utf-8" },
            });
        }
    }

    let filePath = `.${url.pathname}`;
    const file = Bun.file(filePath);
    if (url.pathname !== "/" && await file.exists()) {
        return new Response(file);
    }

    // Default HTML (SPA)
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
};
