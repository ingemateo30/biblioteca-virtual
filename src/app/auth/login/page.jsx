"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock } from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("📩 Enviando datos:", { email, password });

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log(res); 
    console.log("🔍 Respuesta del backend:", res);

    if (res?.error) {
      setError("Correo o contraseña incorrectos");
    } else {
      router.push("/biblioteca");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Iniciar Sesión</h2>
        <p className="text-gray-500 text-center mt-1">Accede a tu cuenta</p>

        {error && (
          <div className="mt-4 text-red-600 bg-red-100 p-3 text-center rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Input de Correo */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Correo Electrónico</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ejemplo@correo.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
              />
            </div>
          </div>

          {/* Input de Contraseña */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Contraseña</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
              />
            </div>
          </div>

          {/* Botón de Ingreso */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold py-3 rounded-lg text-lg shadow-md"
          >
            Ingresar
          </button>
        </form>

        {/* Enlace de Registro */}
        <p className="text-sm text-gray-600 mt-4 text-center">
          ¿No tienes cuenta?{" "}
          <a href="#" className="text-blue-600 hover:underline font-medium">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}
