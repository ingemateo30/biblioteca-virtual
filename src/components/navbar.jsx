"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-indigo-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-white text-xl font-bold">
                Biblioteca Virtual
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/biblioteca" className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium">
                Catálogo
              </Link>
              {session && (
                <Link href="/biblioteca/mis-prestamos" className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium">
                  Mis Préstamos
                </Link>
              )}
              {session?.user?.role === 'ADMIN' && (
                <Link href="/admin" className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium">
                  Panel Admin
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">{session.user.name}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-indigo-700 hover:bg-indigo-800 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="bg-indigo-700 hover:bg-indigo-800 text-white px-3 py-2 rounded-md text-sm font-medium">
                Iniciar sesión
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:text-white hover:bg-indigo-700 focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/biblioteca" className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium">
              Catálogo
            </Link>
            {session && (
              <Link href="/biblioteca/mis-prestamos" className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium">
                Mis Préstamos
              </Link>
            )}
            {session?.user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium">
                Panel Admin
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-indigo-700">
            {session ? (
              <div className="space-y-1">
                <div className="px-4 py-2">
                  <p className="text-white text-sm">{session.user.name}</p>
                  <p className="text-indigo-200 text-xs">{session.user.email}</p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-indigo-700 text-base font-medium"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="block px-4 py-2 text-white hover:bg-indigo-700 text-base font-medium">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}