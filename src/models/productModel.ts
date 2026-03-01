import {Schema, model} from "mongoose";
import { Product } from "../interfaces/product";

const productSchema = new Schema<Product>({
    name: { type: String, required: true, minlength: 3, maxlength: 255 },
    description: { type: String, required: true, minlength: 5, maxlength: 1024 },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    isOnDiscount: { type: Boolean, required: true, default: false },
    discountPercentage: { type: Number, required: true, min: 0, max: 100, default: 0 },
    isHidden: { type: Boolean, required: false },
    _createdBy: { type: String, ref: 'User', required: true }
});

export const ProductModel = model<Product>('Product', productSchema);