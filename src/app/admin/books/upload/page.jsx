'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiArrowLeft, FiUploadCloud, FiBook, FiUser, FiFileText, FiHash, FiCalendar, FiType } from 'react-icons/fi';

export default function UploadBookPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    fileUrl: '',
    isbn: '',
    publisher: '',
    year: '',
    pages: '',
    categoryId: '',
  });

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/biblioteca');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        setErrorMessage('Error al cargar categorías');
      }
    };
    
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el libro');
      }
      
      router.push('/admin/books');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white text-lg flex items-center space-x-2">
          <svg className="animate-spin h-6 w-6 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Cargando...</span>
        </div>
      </div>
    );
  }
  
  if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
    return null;
  }
  
  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/books')}
            className="flex items-center text-teal-400 hover:text-teal-300 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Volver a Libros
          </button>
          <h1 className="text-3xl font-bold mt-4 text-white flex items-center">
            <FiUploadCloud className="mr-2 text-teal-400" /> Subir Nuevo Libro
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-6 bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-red-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-400">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { field: 'title', icon: FiBook },
              { field: 'author', icon: FiUser },
              { field: 'coverImage', icon: FiFileText, label: 'Portada URL' },
              { field: 'fileUrl', icon: FiFileText, label: 'Archivo URL' },
              { field: 'isbn', icon: FiHash },
              { field: 'publisher', icon: FiType },
              { field: 'year', icon: FiCalendar },
              { field: 'pages', icon: FiFileText }
            ].map(({ field, icon: Icon, label }) => (
              <div key={field} className="relative">
                <label className="block text-gray-300 font-medium mb-2">
                  <Icon className="inline-block mr-2 text-teal-400" />
                  {label || field.replace(/([A-Z])/g, ' $1')} *
                </label>
                <input
                  type={['year', 'pages'].includes(field) ? 'number' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-300 placeholder-gray-500"
                />
              </div>
            ))}
          </div>

          <div className="relative">
            <label className="block text-gray-300 font-medium mb-2">
              <FiFileText className="inline-block mr-2 text-teal-400" />
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-300 placeholder-gray-500"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-300 font-medium mb-2">
              <FiBook className="inline-block mr-2 text-teal-400" />
              Categoría *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-300"
            >
              <option value="" className="text-gray-500">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id} className="bg-gray-800">
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-8">
            <button
              type="button"
              onClick={() => router.push('/admin/books')}
              className="px-6 py-2.5 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-lg hover:from-teal-700 hover:to-cyan-800 transition-all ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subiendo...
                </>
              ) : (
                'Publicar Libro'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}