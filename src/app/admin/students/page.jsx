"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiUser, FiMail, FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import Navbar from "@/components/navbar";

export default function StudentsAdminPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/students");
      if (!response.ok) {
        throw new Error("Error al cargar estudiantes");
      }
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este estudiante?")) {
      return;
    }
    try {
      const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Error al eliminar estudiante");
      }
      fetchStudents();
    } catch (err) {
      alert("Error al eliminar estudiante");
    }
  };

  if (loading) return <div className="p-6 text-gray-700">Cargando estudiantes...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-6">
        <div className="w-full max-w-5xl bg-gray-800 p-6 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Administrar Estudiantes</h1>
            <Link
              href="/admin/students/create"
              className="bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-300 hover:to-teal-500 text-white px-6 py-2 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Crear Estudiante
            </Link>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-8 text-gray-300">No hay estudiantes registrados</div>
          ) : (
            <div className="overflow-auto rounded-lg shadow-lg">
              <table className="w-full bg-gray-800 text-white rounded-lg border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-teal-600 text-white text-left">
                    <th className="py-3 px-4">Nombre</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4 text-center">Fecha de Registro</th>
                    <th className="py-3 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="bg-gray-700 hover:bg-gray-600 rounded-lg">
                      <td className="py-4 px-4 rounded-l-lg">
                        <div className="flex items-center space-x-2">
                          <FiUser className="text-gray-400" />
                          <span className="text-gray-200">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <FiMail className="text-gray-400" />
                          <span className="text-gray-200">{student.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-gray-200">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 flex justify-center space-x-3 rounded-r-lg">
                        <Link
                          href={`/admin/students/${student.id}`}
                          className="bg-blue-500/30 border border-blue-400 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-110 hover:bg-blue-400/50 flex items-center"
                        >
                          <FiEye className="mr-1" /> Ver
                        </Link>
                        <Link
                          href={`/admin/students/edit/${student.id}`}
                          className="bg-yellow-500/30 border border-yellow-400 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-110 hover:bg-yellow-400/50 flex items-center"
                        >
                          <FiEdit className="mr-1" /> Editar
                        </Link>
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="bg-red-500/30 border border-red-400 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-110 hover:bg-red-400/50 flex items-center"
                        >
                          <FiTrash2 className="mr-1" /> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

