import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { name, email, password } = await request.json();
    
    // Validaciones básicas
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }
    
    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este correo ya está registrado' },
        { status: 409 }
      );
    }
    
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user',  // Por defecto es usuario normal
    });
    
    await user.save();
    
    // Respuesta exitosa
    return NextResponse.json({
      message: 'Usuario registrado correctamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
    
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 