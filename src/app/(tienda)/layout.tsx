import { NavBar } from "@/components";
import { CartProvider } from "@/context/CartContext";

export default function TiendaLayout({children}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
        <CartProvider>
          <NavBar />
          <main>
            {children}
          </main>
        </CartProvider>
    </div>
  );
}
