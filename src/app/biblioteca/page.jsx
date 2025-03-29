"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiBookOpen, FiUploadCloud, FiUser, FiLogOut, FiHome } from "react-icons/fi";
import Link from "next/link";

export default function BibliotecaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    setTimeout(() => {
      setBooks([
        { id: 1, title: "El Principito", author: "Antoine de Saint-Exupéry", cover: "/covers/principito.jpg" },
        { id: 2, title: "1984", author: "George Orwell", cover: "/covers/1984.jpg" },
        { id: 3, title: "Cien Años de Soledad", author: "Gabriel García Márquez", cover: "/covers/cien.jpg" },
      ]);
    }, 1000);
  }, []);

  if (status === "loading") return <div className="flex h-screen justify-center items-center text-lg">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">📚 Biblioteca Virtual</h1>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-2 hover:underline">
              <FiHome /> Administrador
            </Link>
          )}
          <p className="flex items-center gap-2"><FiUser /> {session?.user?.email}</p>
          <button className="flex items-center gap-2 hover:underline">
            <FiLogOut /> Cerrar Sesión
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        {/* Botón para subir libros solo para admin */}
        {isAdmin && (
          <div className="mb-6 text-right">
            <Link href="/books/upload">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <FiUploadCloud /> Subir Libro
              </button>
            </Link>
          </div>
        )}

        {/* Lista de Libros */}
        {books.length === 0 ? (
          <p className="text-center text-gray-500">No hay libros disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book.id} className="bg-white shadow-lg rounded-xl p-4">
                <img src={book.cover} alt={book.title} className="w-full h-48 object-cover rounded-md" />
                <h2 className="mt-3 text-xl font-semibold text-gray-800">{book.title}</h2>
                <p className="text-gray-600 text-sm">Autor: {book.author}</p>
                <Link href={`/biblioteca/libro/${book.id}`}>
                  <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                    <FiBookOpen /> Leer
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

