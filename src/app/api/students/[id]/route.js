import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// POST - Crear un nuevo estudiante
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validación básica
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json(
        { error: "Se requieren nombre, email y contraseña" },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      );
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear el estudiante
    const student = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "STUDENT", // Rol por defecto
      },
    });

    // Quitar la contraseña del resultado
    const { password, ...studentWithoutPassword } = student;

    return NextResponse.json(
      { message: "Estudiante creado exitosamente", student: studentWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear estudiante:", error);
    return NextResponse.json(
      { error: "Error al crear el estudiante" },
      { status: 500 }
    );
  }
}

// GET - Obtener lista de estudiantes
export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    return NextResponse.json(
      { error: "Error al obtener los estudiantes" },
      { status: 500 }
    );
  }
}