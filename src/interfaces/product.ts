import { User } from "./user";

export type ProductCategory = "Protein" | "Supplement" | "Equipment" | "Apparel";

export interface Product extends Document {
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    stock: number;
    category: ProductCategory;
    brand: string;
    weightKg: number;
    flavor?: string;       // optional - only relevant for powders/drinks
    servings?: number;     // optional - only relevant for supplements
    isOnDiscount: boolean;
    discountPercentage: number;
    isHidden: boolean;
    _createdBy: User['id'];
}