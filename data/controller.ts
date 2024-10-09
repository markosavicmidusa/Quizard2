import { ICategory, categories } from "./categories/categories";
import { commercials, Commercial } from "./commercials/commercials";


export function getCommercials():Commercial[]{
    return commercials
}


export function getCategories():ICategory[]{
    return categories
}