import { Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/app/providers/AuthProvider';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata = {
  title: 'FileLancer - Comparte archivos de forma segura',
  description: 'Una plataforma para compartir archivos mediante enlaces QR',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <body className={`${outfit.className} bg-black text-gray-200`}>
        <AuthProvider>
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #333',
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
