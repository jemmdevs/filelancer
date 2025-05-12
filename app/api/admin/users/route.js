import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/User';

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
    
    // Obtener todos los usuarios (excepto contraseñas)
    const users = await User.find({}).select('-password');
    
    return NextResponse.json({ users });
    
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
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
    
    const { userId, isActive } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario no proporcionado' },
        { status: 400 }
      );
    }
    
    // Actualizar usuario
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    // Actualizar estado
    if (isActive !== undefined) {
      user.isActive = isActive;
    }
    
    await user.save();
    
    return NextResponse.json({
      message: 'Usuario actualizado correctamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 