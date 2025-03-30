'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
    return <div className="text-center p-8">Cargando...</div>;
  }
  
  if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
    return null;
  }
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Subir Nuevo Libro</h1>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['title', 'author', 'coverImage', 'fileUrl', 'isbn', 'publisher', 'year', 'pages'].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-medium mb-2 capitalize">
                {field.replace(/([A-Z])/g, ' $1')} *
                <input
                  type={field === 'year' || field === 'pages' ? 'number' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 p-2"
                />
              </label>
            </div>
          ))}
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 p-2"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Categoría *</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 p-2"
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/books')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Subiendo...' : 'Subir Libro'}
          </button>
        </div>
      </form>
    </div>
  );
}
