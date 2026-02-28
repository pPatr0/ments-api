import mongoose from "mongoose";

export async function testConnection() {
    try {
        await connect();
        await disconnect();
        console.log("Test connection successful");
    }
    catch (error) {
        console.log("Test connection failed. Error: " + error);
    }
}


export async function connect() {
    try
    {
        if(!process.env.DBHOST){
            throw new Error("DBHOST enviroment variable is not defined");
        }
        await mongoose.connect(process.env.DBHOST);

        if (mongoose.connection.db){
            await mongoose.connection.db.admin().command({ ping: 1});
            console.log("Connection is established");
        }
        else{
            throw new Error("Database connection is not established");
        }
    }
    catch (error) {
        console.log("Error connecting to the database. Erorr: " + error);
    }
}


export async function disconnect() {
    try {
        await mongoose.disconnect();
        console.log("Database connection is closed");
    } catch (error) {
        console.log("Error disconnecting from the database. Error: " + error);
    }
}