"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { FiUser, FiMail, FiLock, FiCheckSquare } from "react-icons/fi";

export default function CreateStudentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error al crear estudiante");
      }
      
      // Redireccionar a la lista de estudiantes después de crear exitosamente
      router.push("/admin/students");
      
    } catch (error) {
      console.error("Error creating student:", error);
      setErrors((prev) => ({
        ...prev,
        form: error.message,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="p-6 max-w-md mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Crear Nuevo Estudiante</h2>
          <p className="text-gray-400 mt-2">Registra un nuevo estudiante en la plataforma</p>
          <Link href="/admin/students" className="mt-4 inline-block text-teal-400 hover:text-teal-300 transition duration-300">
            Volver a la lista de estudiantes
          </Link>
        </div>

        {errors.form && (
          <div className="mb-6 bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-red-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-400">{errors.form}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 font-medium mb-2">Nombre</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre completo"
                className={`w-full pl-12 pr-4 py-3.5 bg-gray-800 border ${
                  errors.name ? "border-red-500" : "border-gray-700"
                } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-200 shadow-sm`}
              />
            </div>
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Correo Electrónico</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nombre@correo.com"
                className={`w-full pl-12 pr-4 py-3.5 bg-gray-800 border ${
                  errors.email ? "border-red-500" : "border-gray-700"
                } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-200 shadow-sm`}
              />
            </div>
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Contraseña</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-12 pr-4 py-3.5 bg-gray-800 border ${
                  errors.password ? "border-red-500" : "border-gray-700"
                } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-200 shadow-sm`}
              />
            </div>
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Confirmar Contraseña</label>
            <div className="relative">
              <FiCheckSquare className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-12 pr-4 py-3.5 bg-gray-800 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-700"
                } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-200 shadow-sm`}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-medium py-3.5 rounded-xl text-lg shadow-md transition duration-300 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </>
            ) : (
              "Crear Estudiante"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}