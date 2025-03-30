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
    <nav className={`${
      scrolled 
        ? 'bg-gradient-to-r from-indigo-900 to-purple-900 shadow-xl' 
        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 backdrop-blur-sm'
      } transition-all duration-500 ease-in-out sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="group flex items-center">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" 
                       className="h-9 w-9 text-white mr-2 transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110" 
                       fill="none" 
                       viewBox="0 0 24 24" 
                       stroke="currentColor">
                    <path strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full hidden group-hover:block animate-pulse"></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                    Biblioteca Virtual
                  </span>
                  <span className="text-xs text-indigo-200 tracking-wider font-light -mt-1">Biossanar</span>
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-1">
              <Link href="/biblioteca" className="text-white relative overflow-hidden group px-4 py-2 rounded-md text-sm font-medium ml-2">
                <span className="relative z-10 group-hover:text-indigo-900 transition-colors duration-300">Catálogo</span>
                <span className="absolute bottom-0 left-0 w-full h-0 bg-white rounded-md transform transition-all duration-300 group-hover:h-full opacity-80"></span>
              </Link>
              {session?.user?.role === 'ADMIN' && (
                <Link href="/admin" className="text-white relative overflow-hidden group px-4 py-2 rounded-md text-sm font-medium">
                  <span className="relative z-10 group-hover:text-indigo-900 transition-colors duration-300">Panel Admin</span>
                  <span className="absolute bottom-0 left-0 w-full h-0 bg-white rounded-md transform transition-all duration-300 group-hover:h-full opacity-80"></span>
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-800/60 backdrop-blur-sm text-white border border-indigo-400/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {session.user.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="relative overflow-hidden px-4 py-2 bg-white/90 text-indigo-600 rounded-md text-sm font-medium transform transition hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-white/20 before:translate-x-full hover:before:translate-x-0 before:transition before:duration-300"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/login" 
                className="relative overflow-hidden inline-flex items-center px-4 py-2 border border-white/50 bg-transparent text-white rounded-md text-sm font-medium group"
              >
                <span className="relative z-10 transition-all duration-300 group-hover:text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline-block transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Iniciar sesión
                </span>
                <span className="absolute top-0 left-0 w-full h-0 bg-white rounded-md transform transition-all duration-300 group-hover:h-full"></span>
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:text-white hover:bg-indigo-700/50 focus:outline-none transition-colors"
              aria-expanded={isMenuOpen}
            >
              <svg className={`h-6 w-6 transition-all duration-300 ${isMenuOpen ? 'rotate-90 scale-110' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        className={`sm:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100 backdrop-blur-sm' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-2 pb-3 space-y-1 px-4">
          <Link 
            href="/biblioteca" 
            className="block relative overflow-hidden group px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="relative z-10 text-white group-hover:text-indigo-600 transition-colors duration-300">Catálogo</span>
            <span className="absolute bottom-0 left-0 w-full h-0 bg-white rounded-md transform transition-all duration-300 group-hover:h-full"></span>
          </Link>
          {session?.user?.role === 'ADMIN' && (
            <Link 
              href="/admin" 
              className="block relative overflow-hidden group px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="relative z-10 text-white group-hover:text-indigo-600 transition-colors duration-300">Panel Admin</span>
              <span className="absolute bottom-0 left-0 w-full h-0 bg-white rounded-md transform transition-all duration-300 group-hover:h-full"></span>
            </Link>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-indigo-700/50 backdrop-blur-sm">
          {session ? (
            <div className="space-y-3 px-4">
              <div className="px-4 py-3 bg-indigo-800/60 backdrop-blur-sm rounded-lg border border-indigo-600/30">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-300 bg-indigo-700/70 p-2 rounded-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="absolute top-0 right-0 h-2 w-2 bg-green-400 rounded-full"></span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">{session.user.name}</p>
                    <p className="text-indigo-200 text-xs truncate max-w-[200px]">{session.user.email}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-center relative overflow-hidden group px-4 py-2 rounded-md text-base font-medium bg-white/90"
              >
                <span className="relative z-10 text-indigo-600 group-hover:text-indigo-800 transition-colors duration-300">Cerrar sesión</span>
                <span className="absolute inset-0 h-full w-0 bg-indigo-100 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>
          ) : (
            <div className="px-4 py-2">
              <Link 
                href="/auth/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex justify-center items-center w-full relative overflow-hidden group px-4 py-2 rounded-md text-base font-medium bg-white/90"
              >
                <span className="relative z-10 text-indigo-600 group-hover:text-indigo-800 transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Iniciar sesión
                </span>
                <span className="absolute inset-0 h-full w-0 bg-indigo-100 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}