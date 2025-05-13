import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import dbConnect from '@/app/lib/mongodb';
import File from '@/app/models/File';

export async function POST(request) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Procesar archivo
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Generar nombre único para el archivo
    const fileName = file.name;
    const fileType = file.type;
    const fileSize = file.size;

    // Definir tiempo de expiración (7 días por defecto)
    const expiresAt = formData.get('expiresAt') || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    try {
      // Subir archivo a Vercel Blob
      const blob = await put(fileName, file, {
        access: 'public',
      });
      
      // Guardar información en la base de datos
      await dbConnect();
      
      const newFile = new File({
        name: fileName,
        type: fileType,
        size: fileSize,
        url: blob.url,
        ownerId: session.user.id,
        expiresAt: expiresAt,
        accessCode: formData.get('accessCode') || null
      });

      await newFile.save();

      return NextResponse.json({
        success: true,
        fileId: newFile._id,
        url: blob.url
      });
    } catch (blobError) {
      console.error('Error al subir archivo a Vercel Blob:', blobError);
      return NextResponse.json(
        { error: `Error en Vercel Blob: ${blobError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json(
      { error: 'Error al procesar el archivo: ' + error.message },
      { status: 500 }
    );
  }
} 