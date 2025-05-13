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
    
    // Obtener estadísticas del usuario
    const totalFiles = await File.countDocuments({ ownerId: session.user.id });
    const activeFiles = await File.countDocuments({ ownerId: session.user.id, isActive: true });
    const totalDownloads = await File.aggregate([
      { $match: { ownerId: session.user.id } },
      { $group: { _id: null, total: { $sum: "$downloadCount" } } }
    ]);
    
    const downloadCount = totalDownloads.length > 0 ? totalDownloads[0].total : 0;
    
    // Obtener archivos recientes
    const recentFiles = await File.find({ ownerId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(5);
    
    return NextResponse.json({
      totalFiles,
      activeFiles,
      downloadCount,
      recentFiles
    });
    
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 