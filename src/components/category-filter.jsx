"use client";

import React from 'react';

export default function CategoryFilter({ categorias, categoriaSeleccionada, onChange, darkMode = true }) {
  return (
    <div className="w-full md:w-1/3">
      <div className="relative">
        <select
          value={categoriaSeleccionada}
          onChange={(e) => onChange(e.target.value)}
          className={`
    w-full px-5 py-3.5 appearance-none border
    ${darkMode
              ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
              : 'bg-white border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'}
    rounded-xl focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md
  `}
        >
          <option value="todas" className={darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}>
            Todas las categorías
          </option>
          {categorias.map((categoria) => (
            <option
              key={categoria.id}
              value={categoria.id}
              className={darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}
            >
              {categoria.nombre}
            </option>
          ))}
        </select>

        <div className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ${darkMode ? 'text-white-500' : 'text-white-500'
          }`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 ml-1`}>
        Filtra por categoría
      </p>
    </div>
  );
}