'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Error al registrar usuario');
      }
      
      toast.success('¡Registro exitoso! Redirigiendo al login...');
      
      // Redireccionar a la página de login
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-800 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Crear cuenta</h1>
          <p className="text-gray-400">Regístrate para compartir archivos</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'El nombre es obligatorio' })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-pink-500">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'El correo es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Dirección de correo inválida',
                },
              })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-pink-500">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                },
              })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-pink-500">{errors.password.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', {
                required: 'Debes confirmar la contraseña',
                validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
              })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-pink-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="font-medium text-pink-500 hover:text-pink-400">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 