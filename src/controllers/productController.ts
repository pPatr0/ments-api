import { Request, Response } from "express";
import { ProductModel } from "../models/productModel";
import { connect, disconnect } from "../repository/database";

// CRUD create, read/get, update, delete

export async function createProduct(req: Request, res: Response): Promise<void>{

    const data = req.body;
    try {
        await connect();
        const product = new ProductModel(data);
        const result = await product.save();
        res.status(201).send(result);
    }
    catch (error) {
        res.status(500).send("Error creating product" + error);
    }
    finally {
        await disconnect();
    }

}