"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

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
    <nav className={`${scrolled ? 'bg-indigo-800' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} 
                     transition-all duration-300 ease-in-out shadow-lg sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="group flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mr-2 transform transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-white text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                  Biblioteca Virtual Biossanar
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-1">
              <Link href="/biblioteca" className="text-white relative overflow-hidden group px-4 py-2 rounded-md text-sm font-medium">
                <span className="relative z-10 group-hover:text-indigo-900 transition-colors duration-300">Catálogo</span>
                <span className="absolute bottom-0 left-0 w-full h-0 bg-white rounded-md transform transition-all duration-300 group-hover:h-full"></span>
              </Link>
              {session && (
                <Link href="/biblioteca/mis-prestamos" className="text-white relative overflow-hidden group px-4 py-2 rounded-md text-sm font-medium">
                  <span className="relative z-10 group-hover:text-indigo-900 transition-colors duration-300">Mis Préstamos</span>
                  <span className="absolute bottom-0 left-0 w-full h-0 bg-white rounded-md transform transition-all duration-300 group-hover:h-full"></span>
                </Link>
              )}
              {session?.user?.role === 'ADMIN' && (
                <Link href="/admin" className="text-white relative overflow-hidden group px-4 py-2 rounded-md text-sm font-medium">
                  <span className="relative z-10 group-hover:text-indigo-900 transition-colors duration-300">Panel Admin</span>
                  <span className="absolute bottom-0 left-0 w-full h-0 bg-white rounded-md transform transition-all duration-300 group-hover:h-full"></span>
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-800 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {session.user.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="relative overflow-hidden px-4 py-2 bg-white text-indigo-600 rounded-md text-sm font-medium transform transition hover:scale-105 hover:shadow-md"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/login" 
                className="relative overflow-hidden inline-flex items-center px-4 py-2 border border-white bg-transparent text-white rounded-md text-sm font-medium transition-all duration-300 hover:bg-white hover:text-indigo-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Iniciar sesión
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:text-white hover:bg-indigo-700 focus:outline-none transition-colors"
            >
              <svg className={`h-6 w-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil con animación */}
      <div 
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-2 pb-3 space-y-1 px-4">
          <Link href="/biblioteca" className="text-white hover:bg-white hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300">
            Catálogo
          </Link>
          {session && (
            <Link href="/biblioteca/mis-prestamos" className="text-white hover:bg-white hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300">
              Mis Préstamos
            </Link>
          )}
          {session?.user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-white hover:bg-white hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300">
              Panel Admin
            </Link>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-indigo-700">
          {session ? (
            <div className="space-y-1 px-4">
              <div className="px-4 py-2 bg-indigo-800 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-300 bg-indigo-700 p-2 rounded-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">{session.user.name}</p>
                    <p className="text-indigo-200 text-xs">{session.user.email}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="block w-full text-center px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-100 rounded-md text-base font-medium transition-colors duration-300"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="px-4 py-2">
              <Link 
                href="/auth/login" 
                className="flex justify-center items-center w-full px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-100 rounded-md text-base font-medium transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}