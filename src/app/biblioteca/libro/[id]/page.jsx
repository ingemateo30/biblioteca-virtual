// src/app/biblioteca/libro/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function LibroDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReading, setIsReading] = useState(false);
  
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${id}`);
        if (!response.ok) {
          throw new Error('No se pudo cargar el libro');
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchBook();
    }
  }, [id]);
  
  const handleReadBook = async () => {
    if (status !== 'authenticated') {
      router.push('/auth/signin?redirect=/biblioteca/libro/' + id);
      return;
    }
    
    try {
      // Registrar la lectura en la base de datos
      await fetch('/api/books/read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId: id }),
      });
      
      // Mostrar el visor de lectura
      setIsReading(true);
    } catch (error) {
      console.error('Error al registrar la lectura:', error);
    }
  };
  
  if (loading) {
    return <div className="text-center p-8">Cargando libro...</div>;
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.push('/biblioteca')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver a la biblioteca
          </button>
        </div>
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Libro no encontrado
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.push('/biblioteca')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver a la biblioteca
          </button>
        </div>
      </div>
    );
  }
  
  if (isReading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold truncate">{book.title}</h1>
          <button
            onClick={() => setIsReading(false)}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Cerrar
          </button>
        </div>
        <div className="flex-grow overflow-hidden">
          <iframe 
            src={book.fileUrl} 
            className="w-full h-full border-0" 
            title={book.title}
            allowFullScreen
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Portada del libro */}
        <div className="md:w-1/3">
          <div className="border rounded-lg overflow-hidden shadow-md bg-gray-100 aspect-w-2 aspect-h-3">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={book.title}
                width={400}
                height={600}
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <span className="text-gray-400">Sin portada</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Detalles del libro */}
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">{book.author}</p>
          
          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {book.category?.name || 'Sin categoría'}
            </span>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-2">Detalles</h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              {book.publisher && (
                <>
                  <dt className="text-gray-600">Editorial:</dt>
                  <dd>{book.publisher}</dd>
                </>
              )}
              {book.year && (
                <>
                  <dt className="text-gray-600">Año:</dt>
                  <dd>{book.year}</dd>
                </>
              )}
              {book.pages && (
                <>
                  <dt className="text-gray-600">Páginas:</dt>
                  <dd>{book.pages}</dd>
                </>
              )}
              {book.isbn && (
                <>
                  <dt className="text-gray-600">ISBN:</dt>
                  <dd>{book.isbn}</dd>
                </>
              )}
            </dl>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Descripción</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {book.description || 'No hay descripción disponible.'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleReadBook}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Leer ahora
            </button>
            
            <button
              onClick={() => router.push('/biblioteca')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Volver a la biblioteca
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}