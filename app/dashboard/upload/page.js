'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

export default function Upload() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [accessCode, setAccessCode] = useState('');
  const [expiresAt, setExpiresAt] = useState(7); // Días
  const [showQR, setShowQR] = useState(false);
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Por favor selecciona un archivo');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Crear objeto FormData
      const formData = new FormData();
      formData.append('file', file);
      
      // Añadir código de acceso si existe
      if (accessCode) {
        formData.append('accessCode', accessCode);
      }
      
      // Calcular fecha de expiración
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + Number(expiresAt));
      formData.append('expiresAt', expDate.toISOString());
      
      // Subir archivo
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Error al subir el archivo');
      }
      
      // Mostrar información del archivo subido
      setUploadedFile({
        id: result.fileId,
        url: result.url,
        name: file.name,
        shareUrl: `${window.location.origin}/share/${result.fileId}`,
      });
      
      toast.success('¡Archivo subido correctamente!');
      
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error desconocido al subir el archivo');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(uploadedFile.shareUrl);
    toast.success('Enlace copiado al portapapeles');
  };
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Subir archivo</h1>
      
      {!uploadedFile ? (
        <div className="bg-gray-900 rounded-lg border border-gray-800 shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Seleccionar archivo
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md bg-gray-800">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-pink-500 hover:text-pink-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500"
                    >
                      <span>Seleccionar un archivo</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="pl-1">o arrastra y suelta</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF, DOC hasta 10MB
                  </p>
                </div>
              </div>
              {file && (
                <div className="mt-2 text-sm text-gray-400">
                  Archivo seleccionado: <span className="font-semibold text-gray-300">{file.name}</span> ({formatFileSize(file.size)})
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium text-gray-300 mb-2">
                  Código de acceso (opcional)
                </label>
                <input
                  type="text"
                  id="accessCode"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="mt-1 block w-full border border-gray-700 rounded-md shadow-sm py-2 px-3 bg-gray-800 text-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Dejar en blanco para acceso público"
                  disabled={isUploading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Establece un código para que solo personas con el código puedan acceder
                </p>
              </div>
              
              <div>
                <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-300 mb-2">
                  Expiración
                </label>
                <select
                  id="expiresAt"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="mt-1 block w-full border border-gray-700 rounded-md shadow-sm py-2 px-3 bg-gray-800 text-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  disabled={isUploading}
                >
                  <option value="1">1 día</option>
                  <option value="3">3 días</option>
                  <option value="7">7 días</option>
                  <option value="14">14 días</option>
                  <option value="30">30 días</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  El archivo dejará de estar disponible después de este período
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUploading || !file}
              >
                {isUploading ? 'Subiendo...' : 'Subir archivo'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg border border-gray-800 shadow p-6">
          <div className="text-center mb-6">
            <div className="mx-auto h-12 w-12 text-pink-500">
              <svg
                className="h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-2 text-lg font-medium text-white">¡Archivo subido exitosamente!</h2>
            <p className="mt-1 text-sm text-gray-400">
              Tu archivo ha sido subido y está listo para compartirse.
            </p>
          </div>
          
          <div className="border-t border-b border-gray-800 py-4 my-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Nombre del archivo</h3>
                <p className="mt-1 text-lg font-semibold truncate text-white">{uploadedFile.name}</p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="inline-flex items-center px-4 py-2 border border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  {showQR ? 'Ocultar QR' : 'Mostrar QR'}
                </button>
              </div>
            </div>
          </div>
          
          {showQR && (
            <div className="flex justify-center my-6">
              <div className="p-4 bg-gray-800 border border-gray-700 rounded-md">
                <QRCodeSVG value={uploadedFile.shareUrl} size={200} />
                <p className="mt-2 text-center text-sm text-gray-400">
                  Escanea este código para acceder al archivo
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <label htmlFor="shareLink" className="block text-sm font-medium text-gray-300 mb-2">
              Enlace para compartir
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="shareLink"
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-700 bg-gray-800 text-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                value={uploadedFile.shareUrl}
                readOnly
              />
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-700 rounded-r-md bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => {
                setFile(null);
                setUploadedFile(null);
                setAccessCode('');
                setExpiresAt(7);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Subir otro archivo
            </button>
            
            <button
              onClick={() => router.push('/dashboard/files')}
              className="inline-flex items-center px-4 py-2 bg-pink-600 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Ver mis archivos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
} 