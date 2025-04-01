import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LibroCard({ libro, isAdmin }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);


  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = libro.fileUrl;
    link.download = `${libro.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`bg-gray-800 rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-700/50 hover:border-teal-400/30 relative group ${isHovered ? 'transform -translate-y-2' : ''
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-56 bg-gray-900/50">
        {libro.coverImage ? (
          <Image
            src={libro.coverImage}
            alt={`Portada de ${libro.title}`}
            fill
            className="object-contain"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-400/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
      </div>


      <div className="p-5 bg-gradient-to-b from-gray-800/70 to-gray-900/50">
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 mb-1 line-clamp-1">
          {libro.title}
        </h3>
        <p className="text-sm text-gray-400 mb-3">
          <span className="text-teal-400">Por:</span> {libro.author}
        </p>

        {libro.description && (
          <p className="text-sm text-gray-300 mb-4 line-clamp-2">
            {libro.description}
          </p>
        )}

        <div className="flex justify-between gap-3 mt-5">
          <Link
            href={`/biblioteca/libro/${libro.id}`}
            className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-teal-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Leer
          </Link>

          <button
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-teal-400 font-medium py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-teal-400/20 hover:border-teal-400/40 shadow-md hover:shadow-teal-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Descargar
          </button>
        </div>

        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <div className="flex justify-between gap-2">
              <Link
                href={`/admin/libros/editar/${libro.id}`}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-center py-2 rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Editar
              </Link>
              <Link
                href={`/admin/libros/eliminar/${libro.id}`}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-center py-2 rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Eliminar
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Efecto de brillo al hacer hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -inset-[2px] bg-gradient-to-r from-teal-400/10 to-cyan-500/10 rounded-xl blur-sm" />
      </div>
    </div>
  );
}