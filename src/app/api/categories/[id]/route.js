// src/app/api/categories/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Obtener una categoría por ID
export async function GET(request, { params }) {
  try {
    const id = params.id;
    
    const category = await prisma.category.findUnique({
      where: { id },
    });
    
    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener la categoría' }, { status: 500 });
  }
}

// Actualizar una categoría (solo administradores)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const id = params.id;
    const data = await request.json();
    
    if (!data.name || !data.name.trim()) {
      return NextResponse.json(
        { error: 'El nombre de la categoría es requerido' },
        { status: 400 }
      );
    }
    
    // Verificar si la categoría existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });
    
    if (!existingCategory) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }
    
    // Verificar si ya existe otra categoría con ese nombre
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name: data.name.trim(),
        id: { not: id },
      },
    });
    
    if (duplicateCategory) {
      return NextResponse.json(
        { error: 'Ya existe otra categoría con ese nombre' },
        { status: 400 }
      );
    }
    
    // Actualizar la categoría
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: data.name.trim(),
      },
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar la categoría' },
      { status: 500 }
    );
  }
}

// Eliminar una categoría (solo administradores)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const id = params.id;
    
    // Verificar si la categoría existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });
    
    if (!existingCategory) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }
    
    // Verificar si hay libros asociados a esta categoría
    const booksCount = await prisma.book.count({
      where: { categoryId: id },
    });
    
    if (booksCount > 0) {
      return NextResponse.json(
        { 
          error: `No se puede eliminar la categoría porque tiene ${booksCount} libros asociados. Cambia la categoría de estos libros primero.` 
        },
        { status: 400 }
      );
    }
    
    // Eliminar la categoría
    await prisma.category.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Categoría eliminada con éxito' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar la categoría' },
      { status: 500 }
    );
  }
}