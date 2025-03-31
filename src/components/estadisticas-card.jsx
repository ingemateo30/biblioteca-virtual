"use client";

import React from 'react';

const EstadisticasCard = ({ titulo, cantidad, icono, color, darkMode = true }) => {
  // Función para determinar los colores de fondo y texto según el color proporcionado y el modo
  const getColors = () => {
    const colorMap = {
      indigo: {
        light: {
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          iconBg: 'bg-indigo-100',
          iconColor: 'text-indigo-600',
          border: 'border-indigo-200'
        },
        dark: {
          bg: 'bg-gray-800',
          text: 'text-indigo-400',
          iconBg: 'bg-gray-700',
          iconColor: 'text-indigo-400',
          border: 'border-gray-700'
        }
      },
      emerald: {
        light: {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          border: 'border-emerald-200'
        },
        dark: {
          bg: 'bg-gray-800',
          text: 'text-emerald-400',
          iconBg: 'bg-gray-700',
          iconColor: 'text-emerald-400',
          border: 'border-gray-700'
        }
      },
      purple: {
        light: {
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          border: 'border-purple-200'
        },
        dark: {
          bg: 'bg-gray-800',
          text: 'text-purple-400',
          iconBg: 'bg-gray-700',
          iconColor: 'text-purple-400',
          border: 'border-gray-700'
        }
      },
      blue: {
        light: {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          border: 'border-blue-200'
        },
        dark: {
          bg: 'bg-gray-800',
          text: 'text-blue-400',
          iconBg: 'bg-gray-700',
          iconColor: 'text-blue-400',
          border: 'border-gray-700'
        }
      },
      amber: {
        light: {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          border: 'border-amber-200'
        },
        dark: {
          bg: 'bg-gray-800',
          text: 'text-amber-400',
          iconBg: 'bg-gray-700',
          iconColor: 'text-amber-400',
          border: 'border-gray-700'
        }
      },
      teal: {
        light: {
          bg: 'bg-teal-50',
          text: 'text-teal-700',
          iconBg: 'bg-teal-100',
          iconColor: 'text-teal-600',
          border: 'border-teal-200'
        },
        dark: {
          bg: 'bg-gray-800',
          text: 'text-teal-400',
          iconBg: 'bg-gray-700',
          iconColor: 'text-teal-400',
          border: 'border-gray-700'
        }
      }
    };

    const selectedColor = colorMap[color] || colorMap.teal;
    return darkMode ? selectedColor.dark : selectedColor.light;
  };

  // Función para renderizar el icono según el tipo
  const renderIcon = () => {
    const colors = getColors();
    
    if (icono === 'libro') {
      return (
        <div className={`p-3 rounded-full ${colors.iconBg} ${colors.iconColor}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      );
    } else if (icono === 'usuario') {
      return (
        <div className={`p-3 rounded-full ${colors.iconBg} ${colors.iconColor}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
    } else if (icono === 'categoria') {
      return (
        <div className={`p-3 rounded-full ${colors.iconBg} ${colors.iconColor}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
      );
    }
    
    // Icono por defecto
    return (
      <div className={`p-3 rounded-full ${colors.iconBg} ${colors.iconColor}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  };

  const colors = getColors();

  return (
    <div className={`p-6 rounded-xl ${colors.bg} border ${colors.border} transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{titulo}</h3>
          <p className={`text-3xl font-bold mt-2 ${colors.text}`}>{cantidad}</p>
        </div>
        {renderIcon()}
      </div>
      
      <div className="mt-4">
        <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5`}>
          <div 
            className={`h-1.5 rounded-full ${colors.text.replace('text', 'bg')}`} 
            style={{ width: `${Math.min(100, cantidad)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasCard;