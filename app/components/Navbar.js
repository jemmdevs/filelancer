'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-white">
                File<span className="text-pink-500">Lancer</span>
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span className="sr-only">Abrir menú de usuario</span>
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-100 font-semibold">
                    {user?.name?.charAt(0)}
                  </div>
                  <span className="ml-3 font-medium text-gray-300">{user?.name}</span>
                </button>
              </div>
              
              {isMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin-panel"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Panel de Administración
                    </Link>
                  )}
                  
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Abrir menú principal</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="sm:hidden bg-gray-900 border-t border-gray-800">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              href="/dashboard" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-gray-700 hover:border-pink-500 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            
            <Link 
              href="/dashboard/upload" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-gray-700 hover:border-pink-500 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Subir Archivos
            </Link>
            
            <Link 
              href="/dashboard/files" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-gray-700 hover:border-pink-500 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Mis Archivos
            </Link>
            
            <Link 
              href="/dashboard/share" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-gray-700 hover:border-pink-500 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Compartir Archivos
            </Link>
            
            {user?.role === 'admin' && (
              <Link 
                href="/admin-panel" 
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-gray-700 hover:border-pink-500 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Panel de Administración
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-800">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-100 font-semibold">
                  {user?.name?.charAt(0)}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{user?.name}</div>
                <div className="text-sm font-medium text-gray-400">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 