import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import dbConnect from '@/app/lib/mongodb';
import File from '@/app/models/File';

// Middleware para verificar si es admin
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin';
}

export async function GET() {
  try {
    // Verificar si es admin
    if (!await isAdmin()) {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    // Obtener todos los archivos
    const files = await File.find({}).populate({
      path: 'ownerId',
      select: 'name email' // Solo traer el nombre y email del propietario
    });
    
    return NextResponse.json({ files });
    
  } catch (error) {
    console.error('Error al obtener archivos:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Verificar si es admin
    if (!await isAdmin()) {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    const { fileId, isActive } = await request.json();
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'ID de archivo no proporcionado' },
        { status: 400 }
      );
    }
    
    // Actualizar archivo
    const file = await File.findById(fileId);
    
    if (!file) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }
    
    // Actualizar estado
    if (isActive !== undefined) {
      file.isActive = isActive;
    }
    
    await file.save();
    
    return NextResponse.json({
      message: 'Archivo actualizado correctamente',
      file: {
        id: file._id,
        name: file.name,
        isActive: file.isActive
      }
    });
    
  } catch (error) {
    console.error('Error al actualizar archivo:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 