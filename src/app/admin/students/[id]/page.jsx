"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function StudentDetailsPage({ params }) {
  const { id } = params;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${id}`);
        
        if (!response.ok) {
          throw new Error("No se pudo cargar el estudiante");
        }
        
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching student:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) return <div className="p-4">Cargando información del estudiante...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!student) return <div className="p-4">Estudiante no encontrado</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/students" className="text-blue-500 hover:underline">
          ← Volver a la lista de estudiantes
        </Link>
        <h1 className="text-2xl font-bold mt-2">Detalles del Estudiante</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold">Información Personal</h2>
            <div className="mt-4 space-y-2">
              <p><span className="font-medium">Nombre:</span> {student.name}</p>
              <p><span className="font-medium">Email:</span> {student.email}</p>
              <p><span className="font-medium">Rol:</span> {student.role}</p>
              <p>
                <span className="font-medium">Fecha de registro:</span>{" "}
                {new Date(student.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Link
              href={`/admin/students/edit/${student.id}`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Editar Estudiante
            </Link>
          </div>
        </div>
      </div>

      {/* Historial de préstamos */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Historial de Préstamos</h2>
        
        {student.borrowHistory.length === 0 ? (
          <p>El estudiante no tiene préstamos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Libro</th>
                  <th className="py-2 px-4 border-b">Autor</th>
                  <th className="py-2 px-4 border-b">Fecha de Préstamo</th>
                  <th className="py-2 px-4 border-b">Fecha de Devolución</th>
                  <th className="py-2 px-4 border-b">Estado</th>
                </tr>
              </thead>
              <tbody>
                {student.borrowHistory.map((borrow) => (
                  <tr key={borrow.id}>
                    <td className="py-2 px-4 border-b">{borrow.book.title}</td>
                    <td className="py-2 px-4 border-b">{borrow.book.author}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(borrow.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {borrow.returnDate 
                        ? new Date(borrow.returnDate).toLocaleDateString() 
                        : "Pendiente"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {borrow.returnDate 
                        ? <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Devuelto</span>
                        : <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Prestado</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}