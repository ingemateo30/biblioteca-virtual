"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiUser, FiEdit, FiTrash, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const UsersList = ({ usuarios }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredUsers = usuarios.filter(usuario => 
    usuario.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    usuario.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-900/30 text-purple-400 border-purple-700';
      case 'bibliotecario':
        return 'bg-indigo-900/30 text-indigo-400 border-indigo-700';
      case 'profesor':
        return 'bg-blue-900/30 text-blue-400 border-blue-700';
      case 'estudiante':
        return 'bg-emerald-900/30 text-emerald-400 border-emerald-700';
      default:
        return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-2xl font-bold text-white">Gestión de Usuarios</h3>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar usuario..."
              className="pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full text-gray-300 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {currentUsers.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-400 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-400 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-400 uppercase tracking-wider">
                  Registro
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-teal-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {currentUsers.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                        {usuario.image ? (
                          <img src={usuario.image} alt={usuario.name} className="h-full w-full object-cover" />
                        ) : (
                          <FiUser className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{usuario.name}</div>
                        <div className="text-sm text-gray-400">{usuario.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getRoleBadgeColor(usuario.role)}`}>
                      {usuario.role || 'usuario'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDate(usuario.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-4">
                      <Link 
                        href={`/admin/usuarios/editar/${usuario.id}`}
                        className="text-teal-400 hover:text-teal-300 flex items-center"
                      >
                        <FiEdit className="mr-1" /> Editar
                      </Link>
                      <button 
                        className="text-red-400 hover:text-red-300 flex items-center"
                        onClick={() => confirm('¿Estás seguro de que deseas eliminar este usuario?')}
                      >
                        <FiTrash className="mr-1" /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mx-auto h-24 w-24 text-gray-600 mb-4">
            <FiUser className="w-full h-full" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-300">No se encontraron usuarios</h3>
          <p className="mt-1 text-gray-500">Intenta con otro término de búsqueda</p>
        </div>
      )}

      {filteredUsers.length > itemsPerPage && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex-1 flex items-center justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm ${
                  currentPage === 1 ? 'text-gray-600' : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    currentPage === number
                      ? 'z-10 bg-teal-900/30 border-teal-600 text-teal-400'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-800'
                  } text-sm font-medium`}
                >
                  {number}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm ${
                  currentPage === totalPages ? 'text-gray-600' : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;