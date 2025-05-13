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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-10 bg-black text-white">
      <div className="max-w-5xl w-full flex flex-col items-center text-center">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            File<span className="text-pink-500">Lancer</span>
          </h1>
          <h2 className="text-xl md:text-3xl mb-8 text-gray-300">
            Comparte tus archivos de forma segura
          </h2>
          <p className="text-lg mb-12 max-w-2xl text-gray-400">
            Sube tus archivos, genera enlaces y códigos QR, protégelos con contraseña 
            y compártelos fácilmente.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              href="/login" 
              className="px-8 py-3 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link 
              href="/register" 
              className="px-8 py-3 rounded-lg bg-gray-800 text-white font-medium border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              Registrarse
            </Link>
          </div>
        </div>
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent mb-16"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="p-8 rounded-lg border border-gray-800 bg-gray-900 hover:border-pink-500/30 transition-colors">
            <div className="text-pink-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Comparte fácilmente</h3>
            <p className="text-gray-400">Genera enlaces y códigos QR para compartir tus archivos con cualquier persona.</p>
          </div>
          
          <div className="p-8 rounded-lg border border-gray-800 bg-gray-900 hover:border-pink-500/30 transition-colors">
            <div className="text-pink-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Archivos seguros</h3>
            <p className="text-gray-400">Protege tus archivos con contraseñas y establece fechas de expiración.</p>
          </div>
          
          <div className="p-8 rounded-lg border border-gray-800 bg-gray-900 hover:border-pink-500/30 transition-colors">
            <div className="text-pink-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Control total</h3>
            <p className="text-gray-400">Monitorea las descargas y gestiona el acceso a tus archivos compartidos.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
