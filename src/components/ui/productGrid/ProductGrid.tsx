import { Product } from "@/interfaces";
import { ProductCard } from "../productCard/ProductCard";

interface Props {
    products: Product[];
}


export const ProductGrid = ({ products }: Props) => {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {
                products.map(product => (
                    <ProductCard key={ product.id } product={ product }/>
                ))
            }
        </div>
    )

}