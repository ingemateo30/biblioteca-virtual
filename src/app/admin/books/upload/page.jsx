'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import BookForm from '@/components/BookForm';

export default function UploadBookPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificar campos requeridos
    const requiredFields = ['title', 'author', 'fileUrl', 'categoryId'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Faltan campos: ${missingFields.join(', ')}`);
      return;
    }
    
    // Verificar subidas completas
    if (uploading.cover || uploading.pdf) {
      setError('Espera a que terminen las subidas de archivos');
      return;
    }
  
    onSubmit(formData);
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/biblioteca');
    }
  }, [session, status, router]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError('Error cargando categorías');
      }
    };
    loadCategories();
  }, []);

  if (status === 'loading') {
    return <div className="text-center p-8">Cargando...</div>;
  }

  if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-teal-400">Subir Nuevo Libro</h1>
      
      <BookForm 
        categories={categories} 
        isLoading={isLoading}
        error={error}
        onSubmit={async (formData) => {
          setIsLoading(true);
          setError('');
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
              throw new Error(errorData.error);
            }

            router.push('/admin/books');
          } catch (err) {
            setError(err.message);
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </div>
  );
}