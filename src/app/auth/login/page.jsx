"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { FaStethoscope, FaBookMedical } from "react-icons/fa";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("📩 Enviando datos:", { email, password });

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      console.log("🔍 Respuesta del backend:", res);

      if (res?.error) {
        setError("Correo o contraseña incorrectos");
      } else {
        router.push("/biblioteca");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo - Imagen/Gráficos */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 to-cyan-600 flex-col justify-center items-center p-12 relative">
        <div className="absolute top-8 left-8 flex items-center">
          <FaStethoscope className="text-white text-3xl mr-2" />
          <h1 className="text-2xl font-bold text-white">MediCampus</h1>
        </div>
        
        <div className="text-center max-w-md">
          <FaBookMedical className="text-white text-7xl mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold text-white mb-4">Biblioteca Virtual de Ciencias Médicas</h2>
          <p className="text-white/90 text-lg">
            Accede a nuestra completa colección de recursos académicos en salud, 
            investigaciones y material didáctico para tu formación profesional.
          </p>
          
          <div className="mt-10 grid grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-white font-bold">+10,000</h3>
              <p className="text-white/80 text-sm">Recursos disponibles</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-white font-bold">24/7</h3>
              <p className="text-white/80 text-sm">Acceso ilimitado</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-white font-bold">+50</h3>
              <p className="text-white/80 text-sm">Especialidades</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-0 right-0 text-center text-white/70 text-sm">
          © 2025 MediCampus · Institución Educativa de Ciencias de la Salud
        </div>
      </div>
      
      {/* Panel derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center lg:hidden mb-4">
              <FaStethoscope className="text-teal-600 text-2xl mr-2" />
              <h1 className="text-xl font-bold text-gray-800">MediCampus</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Bienvenido de nuevo</h2>
            <p className="text-gray-600 mt-2">Accede a la plataforma de recursos educativos</p>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0 text-red-500">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Correo Electrónico</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nombre@medicampus.edu"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-700 shadow-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-700 font-medium">Contraseña</label>
                <a href="#" className="text-sm text-teal-600 hover:text-teal-800">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-gray-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-700 shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Mantener sesión iniciada
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-medium py-3.5 rounded-xl text-lg shadow-md transition duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">O continúa con</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" className="w-full py-2.5 px-4 flex justify-center items-center bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.372 0 0 5.373 0 12C0 18.627 5.372 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM19.173 13.644H12.517V19.783H10.465V13.644H4.827V11.913H10.465V5.217H12.517V11.913H19.173V13.644Z" fill="#DB4437"/>
                </svg>
                Google
              </button>
              <button type="button" className="w-full py-2.5 px-4 flex justify-center items-center bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.675 0H1.325C0.593 0 0 0.593 0 1.325V22.676C0 23.407 0.593 24 1.325 24H12.82V14.706H9.692V11.084H12.82V8.413C12.82 5.313 14.713 3.625 17.479 3.625C18.804 3.625 19.942 3.724 20.274 3.768V7.008L18.356 7.009C16.852 7.009 16.561 7.724 16.561 8.772V11.085H20.148L19.681 14.707H16.561V24H22.677C23.407 24 24 23.407 24 22.675V1.325C24 0.593 23.407 0 22.675 0Z" fill="#3B5998"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link href="/auth/register" className="font-medium text-teal-600 hover:text-teal-800">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
