import { Schema, model } from "mongoose";
import { Product } from "../interfaces/product";

const productSchema = new Schema<Product>({
    name: { type: String, required: true, minlength: 3, maxlength: 255 },
    description: { type: String, required: true, minlength: 10, maxlength: 1024 },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: {
        type: String,
        required: true,
        enum: ["Protein", "Supplement", "Equipment", "Apparel"]
    },
    brand: { type: String, required: true, minlength: 2, maxlength: 100 },
    weightKg: { type: Number, required: true, min: 0 },
    flavor: { type: String, required: false, maxlength: 100 },
    servings: { type: Number, required: false, min: 1 },
    isOnDiscount: { type: Boolean, required: true, default: false },
    discountPercentage: { type: Number, required: true, min: 0, max: 100, default: 0 },
    isHidden: { type: Boolean, required: false, default: false },
    _createdBy: { type: String, ref: 'User', required: true }
});

export const ProductModel = model<Product>('Product', productSchema);