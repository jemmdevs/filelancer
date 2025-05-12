import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import dbConnect from '@/app/lib/mongodb';
import File from '@/app/models/File';

export async function GET() {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Obtener los archivos del usuario
    const files = await File.find({ ownerId: session.user.id });
    
    return NextResponse.json({ files });
    
  } catch (error) {
    console.error('Error al obtener archivos:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { fileId } = await request.json();
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'ID de archivo no proporcionado' },
        { status: 400 }
      );
    }
    
    // Buscar el archivo
    const file = await File.findById(fileId);
    
    if (!file) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar que el usuario sea el propietario
    if (file.ownerId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este archivo' },
        { status: 403 }
      );
    }
    
    // Desactivar el archivo (no eliminarlo físicamente)
    file.isActive = false;
    await file.save();
    
    return NextResponse.json({
      message: 'Archivo desactivado correctamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 