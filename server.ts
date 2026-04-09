import { router } from './server/routes/router';

const PORT = process.env.PORT || 3000;

const server = Bun.serve({
    port: PORT,
    async fetch(req: Request) {
        return router(req);
    },
});

console.log(`🚀 Servidor executando em: http://localhost:${server.port}`);
