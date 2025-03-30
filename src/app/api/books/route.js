import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

export async function GET() {
  try {
    const libros = await prisma.libro.findMany();
    return NextResponse.json(libros);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener libros" }, { status: 500 });
  }
}
