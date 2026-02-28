import express, { Application, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';
import { testConnection } from './repository/database';

import routes from './routes';

dotenvFlow.config();

// create express application
const app: Application = express();

/*

*/

export async function startServer() { // Přidat async
    

    app.use(express.json()); // Middleware pro parsování JSON těla požadavků

    // bind routes to the application
    app.use('/api', routes);

    try {
        testConnection(); // Otestovat připojení k databázi před spuštěním serveru

        const PORT: number = parseInt(process.env.PORT as string) || 4000;
        app.listen(PORT, () => {
            console.log("Server is running on port: " + PORT);
        });
    } catch (err) {
        console.error("Nepodařilo se spustit server kvůli chybě DB:", err);
    }
}