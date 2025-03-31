"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiUser, FiMail, FiClock, FiBook, FiArrowLeft } from "react-icons/fi";
import Navbar from "@/components/navbar";

export default function StudentDetailsPage() {
  const { id } = useParams();
  const [student, setStudent] = useState({
    name: "",
    email: "",
    role: "",
    createdAt: "",
    borrowHistory: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
    
        const response = await fetch(`/api/students/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Error ${response.status}`);
        }

        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id]);

  if (loading) return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="text-white text-lg flex items-center space-x-2">
        <svg className="animate-spin h-6 w-6 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Cargando información...</span>
      </div>
    </div>
  );

  if (error) return (
    
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="text-red-400 p-4 max-w-md">
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-red-400">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/admin/students" 
            className="inline-flex items-center text-teal-400 hover:text-teal-300 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Volver a estudiantes
          </Link>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{student.name}</h1>
              <p className="text-gray-400 flex items-center">
                <FiMail className="mr-2" /> {student.email}
              </p>
            </div>
            <Link
              href={`/admin/students/edit/${student.id}`}
              className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white px-6 py-3 rounded-lg font-medium transition-all"
            >
              Editar Estudiante
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-gray-300">
            <div className="space-y-4">
              <div className="flex items-center">
                <FiUser className="mr-2 text-teal-400" />
                <span className="font-medium">Rol:</span>
                <span className="ml-2 text-white">{student.role}</span>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-2 text-teal-400" />
                <span className="font-medium">Registro:</span>
                <span className="ml-2 text-white">
                  {new Date(student.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FiBook className="mr-2 text-teal-400" />
            Historial de Préstamos
          </h2>

          {student.borrowHistory.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No hay préstamos registrados
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-teal-400 font-medium">Libro</th>
                    <th className="px-6 py-4 text-left text-teal-400 font-medium">Autor</th>
                    <th className="px-6 py-4 text-left text-teal-400 font-medium">Préstamo</th>
                    <th className="px-6 py-4 text-left text-teal-400 font-medium">Devolución</th>
                    <th className="px-6 py-4 text-left text-teal-400 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {student.borrowHistory.map((borrow) => (
                    <tr key={borrow.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 text-white">{borrow.book.title}</td>
                      <td className="px-6 py-4 text-gray-300">{borrow.book.author}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(borrow.borrowDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {borrow.returnDate 
                          ? new Date(borrow.returnDate).toLocaleDateString()
                          : "Pendiente"}
                      </td>
                      <td className="px-6 py-4">
                        {borrow.returnDate 
                          ? <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">Devuelto</span>
                          : <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-sm">Prestado</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
