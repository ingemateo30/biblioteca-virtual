"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";

// Componentes
import LibroCard from "@/components/libro-card";
import Buscador from "@/components/buscador";
import CategoryFilter from "@/components/category-filter";

export default function BibliotecaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    // Función para cargar los libros y categorías desde la API
    const cargarDatos = async () => {
      try {
        // Cargar libros
        const resLibros = await fetch("/api/libros");
        const librosData = await resLibros.json();
        setLibros(librosData);

        // Cargar categorías
        const resCategorias = await fetch("/api/categorias");
        const categoriasData = await resCategorias.json();
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      cargarDatos();
    }
  }, [session]);

  // Filtrar libros por búsqueda y categoría
  const librosFiltrados = libros.filter((libro) => {
    const matchBusqueda = libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                          libro.autor.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoriaSeleccionada === "todas" || 
                          libro.categoriaId === categoriaSeleccionada;
    
    return matchBusqueda && matchCategoria;
  });

  // Manejadores de eventos
  const handleBusqueda = (valor) => {
    setBusqueda(valor);
  };

  const handleCategoriaChange = (categoriaId) => {
    setCategoriaSeleccionada(categoriaId);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">Cargando tu biblioteca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Biblioteca Digital</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora nuestra colección de libros digitales y encuentra el conocimiento que buscas
          </p>
        </div>
        
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-10 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
            <Buscador value={busqueda} onChange={handleBusqueda} />
            <CategoryFilter 
              categorias={categorias} 
              categoriaSeleccionada={categoriaSeleccionada}
              onChange={handleCategoriaChange}
            />
          </div>

          {session?.user?.role === "admin" && (
            <div className="mt-2 mb-6 border-t-2 border-indigo-100 pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Panel de Administración</h2>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/admin/libros/crear"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Subir nuevo libro
                </Link>
                <Link 
                  href="/admin/categorias"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Gestionar categorías
                </Link>
                <Link 
                  href="/admin/usuarios"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Gestionar usuarios
                </Link>
              </div>
            </div>
          )}
        </div>

        {librosFiltrados.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {busqueda || categoriaSeleccionada !== "todas" 
                ? "Resultados de búsqueda" 
                : "Todos los libros disponibles"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {librosFiltrados.map((libro) => (
                <LibroCard 
                  key={libro.id} 
                  libro={libro}
                  isAdmin={session?.user?.role === "admin"}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center p-12 bg-white rounded-2xl shadow-lg border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-xl text-gray-600 mb-2">No se encontraron libros</p>
            <p className="text-gray-500">Intenta con otros términos de búsqueda o categoría</p>
            {busqueda || categoriaSeleccionada !== "todas" && (
              <button 
                onClick={() => {
                  setBusqueda("");
                  setCategoriaSeleccionada("todas");
                }}
                className="mt-6 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </main>
      
      <footer className="bg-gray-800 text-white py-10 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Biblioteca Digital</h3>
              <p className="text-gray-300">Tu puerta al conocimiento</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Ayuda</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contacto</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Términos</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacidad</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Biblioteca Digital. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}