// src/app/api/books/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Obtener un libro por ID
export async function GET(request, { params }) {
  try {
    const id = params.id;
    
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    
    if (!book) {
      return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener el libro' }, { status: 500 });
  }
}

// Actualizar un libro (solo administradores)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const id = params.id;
    const data = await request.json();
    
    // Verificar si el libro existe
    const existingBook = await prisma.book.findUnique({
      where: { id },
    });
    
    if (!existingBook) {
      return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 });
    }
    
    // Actualizar el libro
    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title: data.title,
        author: data.author,
        description: data.description,
        coverImage: data.coverImage,
        fileUrl: data.fileUrl,
        isbn: data.isbn,
        publisher: data.publisher,
        year: data.year ? parseInt(data.year) : null,
        pages: data.pages ? parseInt(data.pages) : null,
        categoryId: data.categoryId,
      },
    });
    
    return NextResponse.json(updatedBook);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar el libro' },
      { status: 500 }
    );
  }
}

// Eliminar un libro (solo administradores)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const id = params.id;
    
    // Verificar si el libro existe
    const existingBook = await prisma.book.findUnique({
      where: { id },
    });
    
    if (!existingBook) {
      return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 });
    }
    
    // Eliminar el libro
    await prisma.book.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Libro eliminado con éxito' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar el libro' },
      { status: 500 }
    );
  }
}