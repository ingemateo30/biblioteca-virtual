import { useState } from 'react';
import { FiAlertCircle, FiUploadCloud, FiCheckCircle } from 'react-icons/fi';

export default function BookForm({ categories, isLoading, error, onSubmit }) {
    const [uploading, setUploading] = useState({
        cover: false,
        pdf: false
      });
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

  const handleFileUpload = async (file, fieldName) => {
    try {
      setUploading(prev => ({ ...prev, [fieldName]: true }));
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error en la subida del archivo');
      }
      
      const data = await response.json();
      setFormData(prev => ({ ...prev, [fieldName]: data.url }));
      
    } catch (err) {
      console.error('Error subiendo archivo:', err);
      setError(`Error al subir ${fieldName === 'coverImage' ? 'la imagen' : 'el PDF'}`);
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-900/30 border-l-4 border-red-500 flex items-center">
          <FiAlertCircle className="text-red-400 mr-3" />
          <span className="text-red-400">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campos de texto */}
        {['titulo', 'autor', 'Codigo', 'publicacion'].map((field) => (
          <div key={field} className="space-y-2">
            <label className="block text-gray-300">
              {field.charAt(0).toUpperCase() + field.slice(1)} *
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </label>
          </div>
        ))}

        {/* Subida de portada */}
        <div className="space-y-2">
          <label className="block text-gray-300">
            Portada (Imagen) *
            <div className="mt-1 flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files[0], 'coverImage')}
                required
                className="hidden"
                id="coverInput"
              />
              <label
                htmlFor="coverInput"
                className="cursor-pointer bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
              >
                <FiUploadCloud className="mr-2" />
                {formData.coverImage ? 'Cambiar imagen' : 'Seleccionar imagen'}
              </label>
              {formData.coverImage && (
                <div className="relative">
                  <img
                    src={formData.coverImage}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                  <FiCheckCircle className="absolute -top-1 -right-1 text-green-400 bg-gray-800 rounded-full" />
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Subida de PDF */}
        <div className="space-y-2">
          <label className="block text-gray-300">
            Archivo (PDF) *
            <div className="mt-1 flex items-center gap-4">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileUpload(e.target.files[0], 'fileUrl')}
                required
                className="hidden"
                id="pdfInput"
              />
              <label
                htmlFor="pdfInput"
                className="cursor-pointer bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
              >
                <FiUploadCloud className="mr-2" />
                {formData.fileUrl ? 'Cambiar PDF' : 'Seleccionar PDF'}
              </label>
              {formData.fileUrl && <FiCheckCircle className="text-green-400" />}
            </div>
          </label>
        </div>

        {/* Año y páginas */}
        <div className="space-y-2">
          <label className="block text-gray-300">
            Año de publicación
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-gray-300">
            Número de páginas
            <input
              type="number"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </label>
        </div>
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <label className="block text-gray-300">
          Descripción *
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </label>
      </div>

      {/* Selector de categoría */}
      <div className="space-y-2">
        <label className="block text-gray-300">
          Categoría *
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Botón de submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Subiendo...
          </>
        ) : (
          'Publicar Libro'
        )}
      </button>
    </form>
  );
}