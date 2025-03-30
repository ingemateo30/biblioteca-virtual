"use client";

import { useState } from "react";
import { FiHome, FiUsers, FiSettings, FiLogOut } from "react-icons/fi";
import Link from "next/link";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h2>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center w-full px-4 py-2 rounded-lg text-lg font-medium ${
              activeTab === "dashboard" ? "bg-teal-500 text-white" : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiHome className="mr-2" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`flex items-center w-full px-4 py-2 rounded-lg text-lg font-medium ${
              activeTab === "students" ? "bg-teal-500 text-white" : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiUsers className="mr-2" /> Estudiantes
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center w-full px-4 py-2 rounded-lg text-lg font-medium ${
              activeTab === "settings" ? "bg-teal-500 text-white" : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiSettings className="mr-2" /> Configuración
          </button>
          <button className="flex items-center w-full px-4 py-2 rounded-lg text-lg font-medium text-red-600 hover:bg-gray-200">
            <FiLogOut className="mr-2" /> Cerrar Sesión
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Bienvenido, Administrador</h1>
            <p className="text-gray-600 mt-2">Aquí puedes gestionar la plataforma.</p>
            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="bg-white shadow p-6 rounded-lg">
                <h3 className="text-xl font-bold">120</h3>
                <p className="text-gray-600">Estudiantes registrados</p>
              </div>
              <div className="bg-white shadow p-6 rounded-lg">
                <h3 className="text-xl font-bold">45</h3>
                <p className="text-gray-600">Cursos activos</p>
              </div>
              <div className="bg-white shadow p-6 rounded-lg">
                <h3 className="text-xl font-bold">15</h3>
                <p className="text-gray-600">Profesores disponibles</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Estudiantes</h1>
            <p className="text-gray-600 mt-2">Aquí puedes administrar los estudiantes registrados.</p>
            <Link
              href="/admin/students"
              className="mt-4 inline-block bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
            >
              Ver Estudiantes
            </Link>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>
            <p className="text-gray-600 mt-2">Ajusta las configuraciones de la plataforma.</p>
          </div>
        )}
      </div>
    </div>
  );
}
