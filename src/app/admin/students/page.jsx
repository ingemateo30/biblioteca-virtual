"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import Navbar from "@/components/navbar";

export default function StudentsAdminPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

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
      console.error("Error fetching students:", err);
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
      console.error("Error deleting student:", err);
      alert("Error al eliminar estudiante");
    }
  };

  if (loading) return <div className="p-6 text-gray-700">Cargando estudiantes...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <>
    <Navbar />
    
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      
      <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Administrar Estudiantes</h1>
          <Link 
            href="/admin/students/create" 
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg"
          >
            Crear Estudiante
          </Link>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No hay estudiantes registrados</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-teal-500 text-white">
                  <th className="py-3 px-4 border-b">Nombre</th>
                  <th className="py-3 px-4 border-b">Email</th>
                  <th className="py-3 px-4 border-b">Fecha de Registro</th>
                  <th className="py-3 px-4 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-100">
                    <td className="py-3 px-4 border-b flex items-center text-black">
                      <FiUser className="text-black mr-2" /> {student.name}
                    </td>
                    <td className="py-3 px-4 border-b flex items-center text-black">
                      <FiMail className="text-black mr-2" /> {student.email}
                    </td>
                    <td className="py-3 px-4 border-b text-black">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 border-b flex space-x-2">
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center"
                      >
                        <FiEye className="mr-1" /> Ver
                      </Link>
                      <Link
                        href={`/admin/students/edit/${student.id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg flex items-center"
                      >
                        <FiEdit className="mr-1" /> Editar
                      </Link>
                      <button
                        onClick={() => deleteStudent(student.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center"
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

