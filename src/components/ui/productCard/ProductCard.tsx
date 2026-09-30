import { Product } from "@/interfaces"
import Link from "next/link";
import Image from "next/image";

interface Props {
    product: Product
}


export const ProductCard = ({ product }: Props) => {
    return (
            <Link
                key={product.id}
                href={`/producto/${product.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-blue-800/80 bg-indigo-300/30 backdrop-blur-md transition hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-800/20"
                >
                {/* Imagen del Producto */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <Image
                    src={
                        product.image_url ||
                        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'
                    }
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="eager"
                    />
                    <span className="absolute top-3 left-3 rounded-lg bg-indigo-100/80 border border-indigo-500/70 px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase text-indigo-600 backdrop-blur-xs">
                    {product.category}
                    </span>
                </div>

                {/* Información */}
                <div className="flex flex-1 flex-col p-5">
                    <h4 className="text-lg font-bold text-[#333435] group-hover:text-indigo-500 transition">
                    {product.name}
                    </h4>
                    <p className="mt-1 flex-1 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {product.description || 'Sin descripción disponible.'}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                    <span className="text-xl font-black text-indigo-800">
                        ${product.price.toLocaleString('es-AR')}
                    </span>


                    </div>
                </div>
                </Link>

    )
}