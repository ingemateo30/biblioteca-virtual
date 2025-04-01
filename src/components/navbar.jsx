"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FaStethoscope } from 'react-icons/fa';
import { FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Efecto para detectar scroll y cambiar la apariencia
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${scrolled
        ? 'bg-gray-900 shadow-lg shadow-teal-900/30'
        : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm'
      } transition-all duration-500 ease-in-out sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="group flex items-center">
                <div className="relative">
                  <FaStethoscope className="h-8 w-8 text-teal-400 mr-2 transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110" />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-teal-400 rounded-full hidden group-hover:block animate-pulse"></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-200">
                    Biblioteca Virtual
                  </span>
                  <span className="text-xs text-teal-400 tracking-wider font-light -mt-1">Biossanar</span>
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-1">
              <Link href="/biblioteca" className="text-white relative overflow-hidden group px-4 py-2 rounded-xl text-sm font-medium ml-2">
                <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-300">Catálogo</span>
                <span className="absolute bottom-0 left-0 w-full h-0 bg-teal-400 rounded-xl transform transition-all duration-300 group-hover:h-full"></span>
              </Link>
              {session?.user?.role === 'ADMIN' && (
                <Link href="/admin/students" className="text-white relative overflow-hidden group px-4 py-2 rounded-xl text-sm font-medium">
                  <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-300">Usuarios</span>
                  <span className="absolute bottom-0 left-0 w-full h-0 bg-teal-400 rounded-xl transform transition-all duration-300 group-hover:h-full"></span>
                </Link>
                
              )}
              {session?.user?.role === 'ADMIN' && (
                <Link href="/admin/categories" className="text-white relative overflow-hidden group px-4 py-2 rounded-xl text-sm font-medium">
                  <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-300">Categorias</span>
                  <span className="absolute bottom-0 left-0 w-full h-0 bg-teal-400 rounded-xl transform transition-all duration-300 group-hover:h-full"></span>
                </Link>
                
              )}
                {session?.user?.role === 'ADMIN' && (
                <Link href="/admin/books/upload" className="text-white relative overflow-hidden group px-4 py-2 rounded-xl text-sm font-medium">
                  <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-300">Subir libro</span>
                  <span className="absolute bottom-0 left-0 w-full h-0 bg-teal-400 rounded-xl transform transition-all duration-300 group-hover:h-full"></span>
                </Link>
                
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800/80 backdrop-blur-sm text-white border border-teal-500/30">
                    <FiUser className="h-4 w-4 mr-1 text-teal-400" />
                    {session.user.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="relative overflow-hidden px-4 py-2 bg-gray-800 text-teal-400 border border-teal-500/30 rounded-xl text-sm font-medium transform transition hover:scale-105 hover:shadow-lg hover:shadow-teal-500/20 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-teal-500/10 before:translate-x-full hover:before:translate-x-0 before:transition before:duration-300 group"
                >
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
                    <FiLogOut className="mr-1 group-hover:translate-x-1 transition-transform duration-300" />
                    Cerrar sesión
                  </span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="relative overflow-hidden inline-flex items-center px-4 py-2 border border-teal-500/30 bg-gray-800/60 text-teal-400 rounded-xl text-sm font-medium group"
              >
                <span className="relative z-10 transition-all duration-300 group-hover:text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline-block transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Iniciar sesión
                </span>
                <span className="absolute top-0 left-0 w-full h-0 bg-teal-500 rounded-xl transform transition-all duration-300 group-hover:h-full opacity-20"></span>
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-teal-400 hover:text-white hover:bg-gray-800 focus:outline-none transition-colors"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6 transition-all duration-300 rotate-90 scale-110" />
              ) : (
                <FiMenu className="h-6 w-6 transition-all duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil con animación */}
      <div
        className={`sm:hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100 backdrop-blur-sm bg-gray-900/90' : 'max-h-0 opacity-0'
          } overflow-hidden`}
      >
        <div className="pt-2 pb-3 space-y-1 px-4">
          <Link
            href="/biblioteca"
            className="block relative overflow-hidden group px-3 py-2 rounded-xl text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="relative z-10 text-white group-hover:text-gray-900 transition-colors duration-300">Biblioteca</span>
            <span className="absolute bottom-0 left-0 w-full h-0 bg-teal-400 rounded-xl transform transition-all duration-300 group-hover:h-full"></span>
          </Link>
          {session?.user?.role === 'ADMIN' && (
            <Link
              href="/admin/students"
              className="block relative overflow-hidden group px-3 py-2 rounded-xl text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="relative z-10 text-white group-hover:text-gray-900 transition-colors duration-300">Usuarios</span>
              <span className="absolute bottom-0 left-0 w-full h-0 bg-teal-400 rounded-xl transform transition-all duration-300 group-hover:h-full"></span>
            </Link>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700/50 backdrop-blur-sm">
          {session ? (
            <div className="space-y-3 px-4">
              <div className="px-4 py-3 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-teal-500/30">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="h-10 w-10 flex items-center justify-center text-teal-400 bg-gray-800 p-2 rounded-full border border-teal-500/30">
                        <FiUser className="h-5 w-5" />
                      </div>
                      <span className="absolute top-0 right-0 h-2 w-2 bg-teal-400 rounded-full"></span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">{session.user.name}</p>
                    <p className="text-teal-400 text-xs truncate max-w-[200px]">{session.user.email}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-center relative overflow-hidden group px-4 py-2 rounded-xl text-base font-medium bg-gray-800 border border-teal-500/30"
              >
                <span className="relative z-10 text-teal-400 group-hover:text-white transition-colors duration-300 flex items-center justify-center">
                  <FiLogOut className="mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Cerrar sesión
                </span>
                <span className="absolute inset-0 h-full w-0 bg-teal-500/20 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>
          ) : (
            <div className="px-4 py-2">
              <Link
                href="/auth/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex justify-center items-center w-full relative overflow-hidden group px-4 py-2 rounded-xl text-base font-medium bg-gray-800 border border-teal-500/30"
              >
                <span className="relative z-10 text-teal-400 group-hover:text-white transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Iniciar sesión
                </span>
                <span className="absolute inset-0 h-full w-0 bg-teal-500/20 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}