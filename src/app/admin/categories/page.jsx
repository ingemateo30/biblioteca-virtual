'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { FaFolder } from 'react-icons/fa';
import Navbar from "@/components/navbar";

export default function CategoriesAdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Verificar si el usuario es administrador
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/biblioteca');
    }
  }, [session, status, router]);
  
  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Error al cargar las categorías');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const clearMessage = () => {
    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 5000);
  };
  
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la categoría');
      }
      
      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setIsAddingCategory(false);
      setSuccess(`La categoría "${newCategory.name}" ha sido creada con éxito`);
      clearMessage();
    } catch (err) {
      setError(err.message);
      clearMessage();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory?.name.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingCategory.name.trim() }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar la categoría');
      }
      
      const updatedCategory = await response.json();
      setCategories(
        categories.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        )
      );
      setEditingCategory(null);
      setSuccess(`Categoría actualizada correctamente a "${updatedCategory.name}"`);
      clearMessage();
    } catch (err) {
      setError(err.message);
      clearMessage();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la categoría "${categoryName}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Error al eliminar la categoría'
        );
      }
      
      setCategories(categories.filter((cat) => cat.id !== categoryId));
      setSuccess(`La categoría "${categoryName}" ha sido eliminada correctamente`);
      clearMessage();
    } catch (err) {
      setError(err.message);
      clearMessage();
    }
  };
  
  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-teal-500 animate-spin"></div>
          <div className="mt-3 text-teal-400 font-medium">Cargando categorías...</div>
        </div>
      </div>
    );
  }
  
  if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
    return null; // No renderizar nada mientras redirige
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-700 p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Gestión de Categorías</h1>
              <p className="text-teal-100 mt-1">Administra las categorías disponibles para la biblioteca</p>
            </div>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="px-4 py-2 bg-white text-teal-600 rounded-xl hover:bg-gray-100 transition-colors duration-300 shadow-sm flex items-center font-medium"
            >
              <FiPlus className="mr-2" />
              Nueva Categoría
            </button>
          </div>
        </div>
        
        {/* Mensajes de notificación */}
        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 text-red-400 p-4 rounded-lg shadow-sm mb-6 relative">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
            <button 
              onClick={() => setError(null)} 
              className="absolute top-4 right-4 text-red-400 hover:text-red-300"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/30 border-l-4 border-green-500 text-green-400 p-4 rounded-lg shadow-sm mb-6 relative">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{success}</p>
              </div>
            </div>
            <button 
              onClick={() => setSuccess(null)} 
              className="absolute top-4 right-4 text-green-400 hover:text-green-300"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {/* Formulario para agregar categoría */}
        {isAddingCategory && (
          <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-6 border border-gray-700 transition-all duration-300 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Agregar Nueva Categoría</h2>
              <button
                onClick={() => setIsAddingCategory(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre de la categoría
                </label>
                <div className="relative">
                  <FaFolder className="absolute left-4 top-3.5 text-gray-500" size={18} />
                  <input
                    id="categoryName"
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ej: Literatura, Ciencia, Historia..."
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-200 shadow-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="px-4 py-3 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newCategoryName.trim()}
                  className={`px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-medium rounded-xl transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </div>
                  ) : (
                    'Guardar Categoría'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Barra de búsqueda y contador */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between">
          <div className="relative mb-4 md:mb-0 md:flex-grow md:mr-4">
            <FiSearch className="absolute left-4 top-3.5 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-200 shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiX className="h-5 w-5 text-gray-400 hover:text-gray-300" />
              </button>
            )}
          </div>
          <div className="text-gray-400 text-sm font-medium">
            {filteredCategories.length} {filteredCategories.length === 1 ? 'categoría' : 'categorías'} {searchTerm && 'encontradas'}
          </div>
        </div>
        
        {/* Lista de categorías */}
        {categories.length === 0 ? (
          <div className="bg-gray-800 shadow-sm rounded-xl p-8 text-center">
            <FaFolder className="mx-auto h-16 w-16 text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-white">No hay categorías disponibles</h3>
            <p className="mt-1 text-gray-400">Comienza creando una nueva categoría para organizar tu biblioteca.</p>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="mt-4 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-xl hover:from-teal-700 hover:to-cyan-800 transition-colors inline-flex items-center"
            >
              <FiPlus className="mr-2" />
              Crear primera categoría
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-gray-800 shadow-sm rounded-xl p-8 text-center">
            <FiSearch className="mx-auto h-16 w-16 text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-white">No se encontraron resultados</h3>
            <p className="mt-1 text-gray-400">No hay categorías que coincidan con "{searchTerm}"</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 shadow-sm rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Nombre de la categoría
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingCategory?.id === category.id ? (
                          <form onSubmit={handleUpdateCategory} className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <FaFolder className="absolute left-4 top-3.5 text-gray-500" size={18} />
                              <input
                                type="text"
                                value={editingCategory.name}
                                onChange={(e) =>
                                  setEditingCategory({
                                    ...editingCategory,
                                    name: e.target.value,
                                  })
                                }
                                required
                                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-200 shadow-sm"
                                autoFocus
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                type="submit"
                                disabled={isSubmitting || !editingCategory.name.trim()}
                                className={`px-3 py-2 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-medium rounded-xl ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                              >
                                {isSubmitting ? (
                                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  'Guardar'
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCategory(null)}
                                className="px-3 py-2 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700"
                              >
                                Cancelar
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex items-center">
                            <span className="font-medium text-white">{category.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">{category.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {editingCategory?.id !== category.id && (
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => setEditingCategory(category)}
                              className="text-teal-400 hover:text-teal-300 transition-colors inline-flex items-center"
                            >
                              <FiEdit2 className="h-4 w-4 mr-1" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id, category.name)}
                              className="text-red-400 hover:text-red-300 transition-colors inline-flex items-center"
                            >
                              <FiTrash2 className="h-4 w-4 mr-1" />
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <footer className="bg-gray-900 border-t border-gray-800 text-white py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Biblioteca Digital</h3>
              <p className="text-gray-400 mb-6">Tu puerta al conocimiento digital, diseñado para inspirar y educar a la próxima generación.</p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Inicio</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Acerca de</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Categorías</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Autores</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Preguntas frecuentes</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">direccion</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">correo</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-400">300 ### ####</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Biblioteca Digital. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
    
  );
}