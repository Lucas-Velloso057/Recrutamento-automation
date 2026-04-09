import { Client } from 'pg';

const dbClient = new Client({
    connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/candidates"
});

dbClient.connect().catch((err: any) => console.error("⚠️ Aviso: Banco de dados não conectado. Verifique DATABASE_URL.", err));

export default dbClient;
