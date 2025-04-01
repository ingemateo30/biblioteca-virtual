import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';



export async function GET() {
  try {
    const libros = await prisma.book.findMany();
    return NextResponse.json(libros);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener libros" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Validación mejorada
    const requiredFields = ['title', 'author', 'fileUrl', 'categoryId'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Faltan campos: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Crear libro
    const newBook = await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        description: data.description || null,
        coverImage: data.coverImage || null,
        fileUrl: data.fileUrl,
        isbn: data.isbn || null,
        publisher: data.publisher || null,
        year: data.year ? parseInt(data.year) : null,
        pages: data.pages ? parseInt(data.pages) : null,
        categoryId: data.categoryId
      }
    });

    return NextResponse.json(newBook, { status: 201 });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error en el servidor' },
      { status: 500 }
    );
  }
}