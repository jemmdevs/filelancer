import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import File from '@/app/models/File';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const fileId = params.id;
    
    // Verificar si el archivo existe
    const file = await File.findById(fileId);
    
    if (!file) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar si el archivo está activo
    if (!file.isActive) {
      return NextResponse.json(
        { error: 'Este archivo ha sido desactivado' },
        { status: 403 }
      );
    }
    
    // Verificar si el archivo ha expirado
    if (file.expiresAt && new Date() > new Date(file.expiresAt)) {
      return NextResponse.json(
        { error: 'Este enlace ha expirado' },
        { status: 410 }
      );
    }
    
    // Verificar código de acceso si es necesario
    const { searchParams } = new URL(request.url);
    const accessCode = searchParams.get('code');
    
    if (file.accessCode && file.accessCode !== accessCode) {
      return NextResponse.json(
        { error: 'Código de acceso inválido' },
        { status: 401 }
      );
    }
    
    // Incrementar contador de descargas
    file.downloadCount += 1;
    await file.save();
    
    // Devolver URL del archivo
    return NextResponse.json({ 
      url: file.url,
      name: file.name,
      type: file.type,
      size: file.size
    });
    
  } catch (error) {
    console.error('Error al obtener archivo:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 