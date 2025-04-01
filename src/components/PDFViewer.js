// components/PDFViewer.js
"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

export default function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Verificamos que estamos en el navegador
    if (typeof window !== 'undefined') {
      // Especificar una versión exacta de pdfjs que funcione
      const PDFJS_VERSION = '5.1.91'; // Ajusta esta versión según la que tengas instalada
      
      // Usar un CDN específico y seguro
      pdfjs.GlobalWorkerOptions.workerSrc = 
        `https://app.unpkg.com/pdfjs-dist@5.1.91/files/build/pdf.worker.min.mjs`;
      
      setIsReady(true);
    }
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (!isReady && typeof window !== 'undefined') {
    return <div className="text-gray-500">Inicializando visor de PDF...</div>;
  }

  return (
    <div>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div className="text-gray-500">Cargando documento...</div>}
        error={<div className="text-red-500">Error al cargar el PDF. Por favor, intenta de nuevo.</div>}
      >
        <Page 
          pageNumber={pageNumber}
          loading={<div className="text-gray-500">Cargando página...</div>}
          width={800}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
      
      {numPages && (
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Anterior
          </button>
          <p>
            Página {pageNumber} de {numPages}
          </p>
          <button 
            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
