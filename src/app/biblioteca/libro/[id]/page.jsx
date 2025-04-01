"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import Navbar from "@/components/navbar";
import dynamic from "next/dynamic"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function LibroPage() {
  const router = useRouter();
  const params = useParams(); // Obtener parámetros de la ruta
  const [libro, setLibro] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibro = async () => {
      try {
        const res = await fetch(`/api/books/${params.id}`); // Usar params.id
        if (!res.ok) throw new Error("Libro no encontrado");
        
        const data = await res.json();
        setLibro(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) fetchLibro();
  }, [params.id]); // Usar params.id como dependencia

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const PDFViewer = dynamic(
    () => import("@/components/PDFViewer"),
    { 
      ssr: false,
      loading: () => (
        <div className="h-96 flex items-center justify-center text-gray-400">
          Cargando visor PDF...
        </div>
      )
    }
  );

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = libro.fileUrl;
    link.download = `${libro.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg">
          <h1 className="text-2xl text-red-400 mb-4">Error: {error}</h1>
          <button 
            onClick={() => router.back()}
            className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center text-teal-400 hover:text-teal-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la biblioteca
        </button>

        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="relative h-96 bg-gray-700 rounded-xl overflow-hidden">
                {libro.coverImage ? (
                  <img 
                    src={libro.coverImage} 
                    alt={libro.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="mt-6 space-y-4">
                <button
                  onClick={handleDownload}
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Descargar libro
                </button>
                
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-sm font-semibold text-teal-400 mb-2">Detalles del libro</h3>
                  <ul className="space-y-2 text-sm">
                    <li><span className="font-medium">Categoría:</span> {libro.category?.name || "Sin categoría"}</li>
                    <li><span className="font-medium">ISBN:</span> {libro.isbn || "N/A"}</li>
                    <li><span className="font-medium">Editorial:</span> {libro.publisher || "Desconocida"}</li>
                    <li><span className="font-medium">Año:</span> {libro.year || "N/A"}</li>
                    <li><span className="font-medium">Páginas:</span> {libro.pages || "N/A"}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <h1 className="text-4xl font-bold mb-4">{libro.title}</h1>
              <p className="text-xl text-gray-300 mb-6">por {libro.author}</p>
              
              {libro.description && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-3">Descripción</h2>
                  <p className="text-gray-300 leading-relaxed">{libro.description}</p>
                </div>
              )}

              <div className="bg-gray-700 rounded-xl p-4">
                <h2 className="text-2xl font-semibold mb-4">Vista previa</h2>
                
                <div className="border border-gray-600 rounded-lg overflow-hidden">
                <PDFViewer fileUrl={libro.fileUrl} />
                </div>

                <div className="mt-4 flex items-center justify-between text-gray-300">
                  <button
                    onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                    disabled={pageNumber <= 1}
                    className="px-4 py-2 bg-gray-600 rounded-lg disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  
                  <span>
                    Página {pageNumber} de {numPages || "--"}
                  </span>

                  <button
                    onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                    disabled={pageNumber >= numPages}
                    className="px-4 py-2 bg-gray-600 rounded-lg disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}