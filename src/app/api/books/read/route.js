// src/app/api/books/read/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Registrar la lectura de un libro
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const data = await request.json();
    
    if (!data.bookId) {
      return NextResponse.json(
        { error: 'ID del libro requerido' },
        { status: 400 }
      );
    }
    
    // Verificar si el libro existe
    const book = await prisma.book.findUnique({
      where: { id: data.bookId },
    });
    
    if (!book) {
      return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 });
    }
    
    // Registrar la lectura
    const read = await prisma.read.create({
      data: {
        bookId: data.bookId,
        userId: session.user.id,
      },
    });
    
    return NextResponse.json(read, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al registrar la lectura' },
      { status: 500 }
    );
  }
}

// Obtener historial de lecturas del usuario actual
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const reads = await prisma.read.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        book: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        readDate: 'desc',
      },
    });
    
    return NextResponse.json(reads);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el historial de lecturas' },
      { status: 500 }
    );
  }
}