import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Proteger rutas admin
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req: request });
    
    // Redireccionar al login si no hay usuario
    if (!token) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }
    
    // Verificar si es administrador
    if (token.role !== "ADMIN") {
      // Si no es admin, redirigir a la página principal con mensaje
      const url = new URL("/", request.url);
      url.searchParams.set("message", "No tienes permiso para acceder a esta sección");
      return NextResponse.redirect(url);
    }
  }
  
  // Proteger rutas de API de estudiantes
  if (pathname.startsWith("/api/students")) {
    const token = await getToken({ req: request });
    
    // Verificar si está autenticado
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "No autorizado" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Verificar si es administrador
    if (token.role !== "ADMIN") {
      return new NextResponse(
        JSON.stringify({ error: "Acceso denegado" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  
  return NextResponse.next();
}

// Configurar rutas que activan el middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/students/:path*',
  ],
};
