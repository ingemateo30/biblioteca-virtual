// components/PDFViewer.js
"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

// Configuración para pdfjs-dist@5.1.91
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Document
      file={fileUrl}
      onLoadSuccess={onDocumentLoadSuccess}
      loading={<div className="text-gray-500">Cargando documento...</div>}
    >
      <Page 
        pageNumber={pageNumber}
        loading={<div className="text-gray-500">Cargando página...</div>}
        width={800}
      />
    </Document>
  );
}

