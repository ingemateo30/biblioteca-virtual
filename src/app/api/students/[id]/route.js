import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";



// GET - Obtener estudiante por ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const student = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        borrowHistory: {
          select: {
            id: true,
            borrowDate: true,
            returnDate: true,
            book: { select: { title: true, author: true } }
          }
        }
      }
    });

    if (!student) {
      return NextResponse.json(
        { error: "Estudiante no encontrado" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(student);
    
  } catch (error) {
    console.error("Error GET:", error);
    return NextResponse.json(
      { error: error.code === "P2025" ? "Estudiante no existe" : "Error de base de datos" }, 
      { status: 500 }
    );
  }
}

// PUT - Actualizar estudiante
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    if (!isValidCuid(id)) {
      return NextResponse.json(
        { error: "ID inválido" }, 
        { status: 400 }
      );
    }

    if (!data.name?.trim() || !data.email?.trim()) {
      return NextResponse.json(
        { error: "Nombre y email son requeridos" }, 
        { status: 400 }
      );
    }

    // Verificar email único
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: data.email.trim(),
        id: { not: id }
      }
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "El email ya está registrado" }, 
        { status: 400 }
      );
    }

    const updatedStudent = await prisma.user.update({
      where: { id },
      data: {
        name: data.name.trim(),
        email: data.email.trim()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    return NextResponse.json({
      message: "Estudiante actualizado",
      data: updatedStudent
    });

  } catch (error) {
    console.error("Error PUT:", error);
    return NextResponse.json(
      { error: error.code === "P2025" ? "Estudiante no existe" : "Error al actualizar" }, 
      { status: 500 }
    );
  }
}

// DELETE - Eliminar estudiante
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!isValidCuid(id)) {
      return NextResponse.json(
        { error: "ID inválido" }, 
        { status: 400 }
      );
    }

    // Verificar préstamos activos
    const activeBorrows = await prisma.borrow.count({
      where: { 
        userId: id,
        returnDate: null 
      }
    });

    if (activeBorrows > 0) {
      return NextResponse.json(
        { error: "El estudiante tiene préstamos activos" }, 
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: "Estudiante eliminado" 
    });

  } catch (error) {
    console.error("Error DELETE:", error);
    return NextResponse.json(
      { error: error.code === "P2025" ? "Estudiante no existe" : "Error al eliminar" }, 
      { status: 500 }
    );
  }
}