// components/PDFEmbedViewer.jsx
import React from 'react';

const PDFEmbedViewer = ({ fileUrl }) => {
  return (
    <div className="relative w-full h-96 md:h-[500px] bg-gray-800 rounded-lg overflow-hidden">
      {fileUrl ? (
        <iframe
          src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className="w-full h-full border-0"
          title="PDF Viewer"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          No se ha encontrado archivo PDF
        </div>
      )}
    </div>
  );
};

export default PDFEmbedViewer;