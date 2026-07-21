import { NavBar } from "@/components";
import { CartProvider } from "@/context/CartContext";

export default function TiendaLayout({children}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <NavBar />
      <div>
        <CartProvider>
          {children}
        </CartProvider>
      </div>
    </main>
  );
}
