"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { motion } from "framer-motion";

import LibroCard from "@/components/libro-card";
import Buscador from "@/components/buscador";
import CategoryFilter from "@/components/category-filter";

import EstadisticasCard from "@/components/estadisticas-card";
import UsersList from "@/components/users-list";

export default function BibliotecaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [libros, setLibros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("libros");
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    // Función para cargar los datos desde la API
    const cargarDatos = async () => {
      try {
        // Cargar libros
        const resLibros = await fetch("/api/books");
        const librosData = await resLibros.json();
        setLibros(librosData);

        // Cargar categorías
        const resCategorias = await fetch("/api/categories");
        const categoriasData = await resCategorias.json();
        setCategorias(categoriasData);

        // Si es admin, cargar usuarios también
        if (session?.user?.role === "ADMIN") {
          const resUsuarios = await fetch("/api/students");
          const usuariosData = await resUsuarios.json();
          setUsuarios(usuariosData);
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setIsLoading(false);
        
        // Ocultar el mensaje de bienvenida después de 3 segundos
        setTimeout(() => {
          setShowWelcome(false);
        }, 2000);
      }
    };

    if (session) {
      cargarDatos();
    }
  }, [session]);

  // Filtrar libros por búsqueda y categoría
  const librosFiltrados = Array.isArray(libros) 
  ? libros.filter((libro) => {
      const matchBusqueda = libro.title.toLowerCase().includes(busqueda.toLowerCase()) ||
                            libro.author.toLowerCase().includes(busqueda.toLowerCase());
      const matchCategoria = categoriaSeleccionada === "todas" || 
      libro.categoryId === categoriaSeleccionada;
      return matchBusqueda && matchCategoria;
    })
  : [];

  // Manejadores de eventos
  const handleBusqueda = (valor) => {
    setBusqueda(valor);
  };

  const handleCategoriaChange = (categoriaId) => {
    setCategoriaSeleccionada(categoriaId);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black">
        <div className="text-center bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-md w-full">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-teal-400 mx-auto"></div>
          <h2 className="mt-8 text-2xl font-bold text-teal-400">Preparando tu experiencia...</h2>
          <p className="mt-2 text-lg text-gray-400">Cargando la biblioteca digital</p>
          <div className="mt-6 w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-teal-500 h-2.5 rounded-full animate-pulse" style={{width: '70%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Navbar />
      
      {showWelcome && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80"
        >
          <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-700">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 mb-4">
              ¡Bienvenido, {session?.user?.name}!
            </h1>
            <p className="text-lg text-gray-300 mb-2">
              {session?.user?.role === "ADMIN" 
                ? "Acceso completo al panel de administración"
                : "Disfruta de nuestra colección de libros digitales"}
            </p>
            <div className="mt-6 animate-pulse">
              <span className="text-sm text-gray-400">Preparando tu biblioteca...</span>
            </div>
          </div>
        </motion.div>
      )}
      
      <main className="container mx-auto px-4 py-16">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 mb-4">
            Biblioteca Virtual
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explora nuestra colección de conocimiento en formato digital
          </p>
        </motion.div>
        
        {session?.user?.role === "ADMIN" && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mb-12"
          >
            <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-2 bg-teal-400 rounded-full"></div>
                <h2 className="text-2xl font-bold text-white">Panel de Administración</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <EstadisticasCard 
                  titulo="Libros" 
                  cantidad={libros.length} 
                  icono="libro" 
                  color="teal"
                />
                <EstadisticasCard 
                  titulo="Usuarios" 
                  cantidad={usuarios.length} 
                  icono="usuario" 
                  color="blue"
                />
                <EstadisticasCard 
                  titulo="Categorías" 
                  cantidad={categorias.length} 
                  icono="categoria" 
                  color="purple"
                />
              </div>
              
              <div className="mb-8">
                <div className="flex border-b border-gray-700">
                  <button
                    className={`px-6 py-3 font-medium text-lg ${activeTab === 'libros' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-gray-400 hover:text-teal-400'}`}
                    onClick={() => setActiveTab('libros')}
                  >
                    Libros
                  </button>
                  <button
                    className={`px-6 py-3 font-medium text-lg ${activeTab === 'usuarios' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-gray-400 hover:text-teal-400'}`}
                    onClick={() => setActiveTab('usuarios')}
                  >
                    Usuarios
                  </button>
                  <button
                    className={`px-6 py-3 font-medium text-lg ${activeTab === 'categorias' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-gray-400 hover:text-teal-400'}`}
                    onClick={() => setActiveTab('categorias')}
                  >
                    Categorías
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Link 
                  href="/admin/books/upload"
                  className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-xl flex items-center gap-2 transform hover:-translate-y-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Subir nuevo libro
                </Link>
                <Link 
                  href="/admin/categories"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-xl flex items-center gap-2 transform hover:-translate-y-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Gestionar categorías
                </Link>
                <Link 
                  href="/admin/students"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-xl flex items-center gap-2 transform hover:-translate-y-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Gestionar usuarios
                </Link>
              </div>
              
              {activeTab === 'usuarios' && (
                <UsersList usuarios={usuarios} />
              )}
              
              {activeTab === 'categorias' && (
                <div className="bg-gray-800 rounded-xl p-6 shadow border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorias.map((categoria) => (
                      <div key={categoria.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-sm hover:shadow-md transition-all">
                        <h3 className="font-medium text-lg text-white">{categoria.name}</h3>
                        <div className="mt-3 flex justify-end">
                          <Link 
                            href={`/admin/categories/${categoria.id}`}
                            className="text-teal-400 hover:text-teal-300 text-sm font-medium"
                          >
                            Editar
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {(session?.user?.role !== "ADMIN" || activeTab === 'libros') && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="bg-gray-800 shadow-xl rounded-2xl p-8 mb-10 border border-gray-700">
              <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
                <Buscador value={busqueda} onChange={handleBusqueda} />
                <CategoryFilter 
                  categorias={categorias} 
                  categoriaSeleccionada={categoriaSeleccionada}
                  onChange={handleCategoriaChange}
                />
              </div>
            </div>
            
            {librosFiltrados.length > 0 ? (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-8 w-1 bg-teal-400 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-white">
                    {busqueda || categoriaSeleccionada !== "todas" 
                      ? "Resultados de búsqueda" 
                      : "Explora nuestra colección"}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {librosFiltrados.map((libro, index) => (
                    <motion.div
                      key={libro.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <LibroCard 
                        libro={libro}
                        isAdmin={session?.user?.role === "ADMIN"}
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="text-center p-16 bg-gray-800 rounded-2xl shadow-xl border border-gray-700"
              >
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No se encontraron libros</h3>
                <p className="text-gray-400 mb-6">Intenta con otros términos de búsqueda o categoría</p>
                {(busqueda || categoriaSeleccionada !== "todas") && (
                  <button 
                    onClick={() => {
                      setBusqueda("");
                      setCategoriaSeleccionada("todas");
                    }}
                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors shadow-md hover:shadow-lg"
                  >
                    Limpiar filtros
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
      
      <footer className="bg-gray-900 border-t border-gray-800 text-white py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Biblioteca Digital</h3>
              <p className="text-gray-400 mb-6">Tu puerta al conocimiento digital, diseñado para inspirar y educar a la próxima generación.</p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Inicio</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Acerca de</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Categorías</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Autores</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Preguntas frecuentes</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">direccion</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">correo</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-400">300 ### ####</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Biblioteca Digital. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}