'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} FileLancer. Todos los derechos reservados.
            </p>
          </div>
          <div className="flex space-x-6">
            <a 
              href="https://jemmdevs.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-500 transition-colors"
            >
              <span className="sr-only">Blog</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.37 5.379l-5.64 5.64c-.655.655-1.08 1.56-1.08 2.558v5.143c0 2 1.613 3.616 3.613 3.616h5.144c.998 0 1.903-.425 2.557-1.08l5.641-5.64c.655-.655 1.08-1.56 1.08-2.558v-5.143c0-2-1.613-3.616-3.613-3.616h-5.144c-.998 0-1.903.425-2.557 1.08z" />
                <path d="M14.5 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </a>
            <a 
              href="https://github.com/jemmdevs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-500 transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="https://portfolio-jemmdevs.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-500 transition-colors"
            >
              <span className="sr-only">Portfolio</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.738.395.671.143 1.262.67 1.262 1.397v1.053c0 1.057-.754 1.9-1.73 1.9-.976 0-1.731-.843-1.731-1.9v-.285c-.336-.06-.688-.105-1.033-.143a.964.964 0 01-.324.245A11.956 11.956 0 0112 10a11.955 11.955 0 01-3.682-2.131.964.964 0 01-.324-.245c-.345.038-.697.084-1.033.143v.285c0 1.057-.755 1.9-1.73 1.9-.976 0-1.731-.843-1.731-1.9V7.248c0-.726.59-1.254 1.262-1.397.881-.198 1.805-.31 2.738-.395V5.25zm9.75 6.068v-2.02a13.445 13.445 0 00-3.75-.507 13.446 13.446 0 00-3.75.507v2.02a14.88 14.88 0 003.75.432 14.88 14.88 0 003.75-.432z" clipRule="evenodd" />
                <path d="M16.5 14.25c0 1.38-1.175 2.25-2.583 2.25-1.395 0-2.582-.87-2.582-2.25 0 1.38-1.175 2.25-2.583 2.25-1.395 0-2.582-.87-2.582-2.25" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 