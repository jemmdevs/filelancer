import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Navbar user={session.user} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 