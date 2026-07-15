import { NavBar } from "@/components";

export default function TiendaLayout({children}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <NavBar />
      <div>
        {children}
      </div>
    </main>
  );
}
