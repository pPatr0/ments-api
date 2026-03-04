import { Request, Response } from "express";
import Joi, { ValidationResult } from "joi";
import { ProductModel } from "../models/productModel";
import { Product } from "../interfaces/product";
import { connect, disconnect } from "../repository/database";

/**
 * Validate product data using Joi
 * @param data - product body from request
 */
function validateProduct(data: Partial<Product>): ValidationResult {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        description: Joi.string().min(10).max(1024).required(),
        imageUrl: Joi.string().uri().required(),
        price: Joi.number().min(0).required(),
        stock: Joi.number().integer().min(0).required(),
        category: Joi.string().valid("Protein", "Supplement", "Equipment", "Apparel").required(),
        brand: Joi.string().min(2).max(100).required(),
        weightKg: Joi.number().min(0).required(),
        flavor: Joi.string().max(100).optional(),
        servings: Joi.number().integer().min(1).optional(),
        isOnDiscount: Joi.boolean().required(),
        discountPercentage: Joi.number().min(0).max(100).required(),
        isHidden: Joi.boolean().optional(),
        _createdBy: Joi.string().required(),
    });

    return schema.validate(data, { abortEarly: false });
}

/**
 * Create a new gym product
 * @param req
 * @param res
 */
export async function createProduct(req: Request, res: Response): Promise<void> {

    // Validate the request body before saving
    const { error } = validateProduct(req.body);
    if (error) {
        res.status(400).json({ error: error.details.map(d => d.message) });
        return;
    }

    try {
        await connect();
        const product = new ProductModel(req.body);
        const result = await product.save();
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send("Error creating product: " + error);
    } finally {
        await disconnect();
    }
}

/**
 * Retrieve all products from the database.
 * Supports optional ?category= query filter
 * @param req
 * @param res
 */
export async function getAllProducts(req: Request, res: Response) {

    try {
        await connect();

        // Build filter — if ?category=Protein is passed, filter by it
        const filter: Record<string, unknown> = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }

        const result = await ProductModel.find(filter);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("Error retrieving products: " + error);
    } finally {
        await disconnect();
    }
}

/**
 * Retrieve a specific product by its MongoDB ID
 * @param req
 * @param res
 */
export async function getProductById(req: Request, res: Response) {

    try {
        await connect();

        const id = req.params.id;
        const result = await ProductModel.findById(id);

        if (!result) {
            res.status(404).send("Product with id=" + id + " not found.");
            return;
        }

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("Error retrieving product by ID: " + error);
    } finally {
        await disconnect();
    }
}

/**
 * Update a specific product by its MongoDB ID
 * @param req
 * @param res
 */
export async function updateProductById(req: Request, res: Response) {

    // Validate the update body
    const { error } = validateProduct(req.body);
    if (error) {
        res.status(400).json({ error: error.details.map(d => d.message) });
        return;
    }

    const id = req.params.id;

    try {
        await connect();

        const result = await ProductModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!result) {
            res.status(404).send("Cannot update product with id=" + id + ". Not found.");
        } else {
            res.status(200).send(result);
        }
    } catch (error) {
        res.status(500).send("Error updating product: " + error);
    } finally {
        await disconnect();
    }
}

/**
 * Delete a specific product by its MongoDB ID
 * @param req
 * @param res
 */
export async function deleteProductById(req: Request, res: Response) {

    const id = req.params.id;

    try {
        await connect();

        const result = await ProductModel.findByIdAndDelete(id);

        if (!result) {
            res.status(404).send("Cannot delete product with id=" + id + ". Not found.");
        } else {
            res.status(200).send("Product was successfully deleted.");
        }
    } catch (error) {
        res.status(500).send("Error deleting product: " + error);
    } finally {
        await disconnect();
    }
}