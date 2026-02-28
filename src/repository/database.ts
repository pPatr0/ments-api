import mongoose from "mongoose";



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