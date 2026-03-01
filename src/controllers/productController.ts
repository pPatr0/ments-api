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
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send("Error creating product" + error);
    }
    finally {
        await disconnect();
    }

}

/**
 * retrieve all products from the database
 * @param req 
 * @param res 
 */
export async function getAllProducts(req: Request, res: Response){

    
    try {
        await connect();

        const result = await ProductModel.find({});

        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send("Error retrieving products: " + error);
    }
    finally {
        await disconnect();
    }
}


/**
 * retrieve specific product by id from the database
 * @param req 
 * @param res 
 */
export async function getProductById(req: Request, res: Response){

    
    try {
        await connect();

        const id = req.params.id;
        const result = await ProductModel.find({_id: id});

        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send("Error retrieving products by ID: " + error);
    }
    finally {
        await disconnect();
    }
}

/**
 * Updates the product by
 * @param req 
 * @param res 
 */
export async function updateProductById(req: Request, res: Response) {

  const id = req.params.id;

  try {
    await connect();

    const result = await ProductModel.findByIdAndUpdate(id, req.body);

    if (!result) {
      res.status(404).send('Cannot update product with id=' + id);
    }
    else {
      res.status(200).send('Product was succesfully updated.');
    }
  }
  catch (err) {
    res.status(500).send("Error updating product by id. Error: " + err);
  }
  finally {
    await disconnect();
  }
}

/**
 * Deletes the product by id
 * @param req 
 * @param res 
 */
export async function deleteProductById(req: Request, res: Response) {

  const id = req.params.id;

  try {
    await connect();

    const result = await ProductModel.findByIdAndDelete(id);

    if (!result) {
      res.status(404).send('Cannot delete product with id=' + id);
    }
    else {
      res.status(200).send('Product was succesfully deleted.');
    }
  }
  catch (err) {
    res.status(500).send("Error deleting product by id. Error: " + err);
  }
  finally {
    await disconnect();
  }
}