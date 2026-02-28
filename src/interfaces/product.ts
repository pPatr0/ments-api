import { User } from "./user";

export interface Product extends Document {
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    stock: number;
    isOnDiscount: boolean;
    discountPercentage: number;
    isHidden: boolean;
    _createdBy: User['id'];
}