import Image from 'next/image';
import Link from 'next/link';

export default function LibroCard({ libro }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48 w-full">
        <Image
          src={libro.portada || '/images/book-placeholder.jpg'}
          alt={libro.titulo}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold line-clamp-2">{libro.titulo}</h3>
          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
            {libro.categoria.nombre}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{libro.autor}</p>
        <p className="text-xs text-gray-500 mt-2 mb-3">
          {libro.disponible ? 
            <span className="text-green-600 font-medium">Disponible</span> : 
            <span className="text-red-600 font-medium">No disponible</span>
          }
        </p>
        <Link href={`/biblioteca/libros/${libro.id}`} className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded text-sm">
          Ver detalles
        </Link>
      </div>
    </div>
  );
}