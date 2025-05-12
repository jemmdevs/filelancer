import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // Si el usuario ya está autenticado, redirigir al dashboard
  if (session) {
    redirect('/dashboard');
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="max-w-5xl w-full flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          FileLancer
        </h1>
        <h2 className="text-2xl md:text-3xl mb-8">
          Comparte tus archivos de forma segura
        </h2>
        <p className="text-lg mb-10 max-w-2xl">
          Sube tus archivos, genera enlaces y códigos QR, protégelos con contraseña y compártelos fácilmente.
        </p>
        
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-3 rounded-lg bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition-colors"
          >
            Registrarse
          </Link>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold mb-3">Comparte fácilmente</h3>
            <p>Genera enlaces y códigos QR para compartir tus archivos con cualquier persona.</p>
          </div>
          
          <div className="p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold mb-3">Archivos seguros</h3>
            <p>Protege tus archivos con contraseñas y establece fechas de expiración.</p>
          </div>
          
          <div className="p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold mb-3">Control total</h3>
            <p>Monitorea las descargas y gestiona el acceso a tus archivos compartidos.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
