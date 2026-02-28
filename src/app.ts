import express, { Application, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';
import { connect } from './repository/database';

import routes from './routes';

dotenvFlow.config();

// create express application
const app: Application = express();

app.use('/api', routes)
/*

*/

export async function startServer() { // Přidat async
    try {
        await connect(); // Přidat await – tohle je zásadní!
        
        const PORT: number = parseInt(process.env.PORT as string) || 4000;
        app.listen(PORT, () => {
            console.log("Server is running on port: " + PORT);
        });
    } catch (err) {
        console.error("Nepodařilo se spustit server kvůli chybě DB:", err);
    }
}