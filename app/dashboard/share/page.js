'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

export default function ShareFiles() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  
  useEffect(() => {
    fetchFiles();
  }, []);
  
  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/files');
      
      if (!response.ok) {
        throw new Error('Error al obtener archivos');
      }
      
      const data = await response.json();
      // Solo mostrar archivos activos
      const activeFiles = data.files.filter(file => file.isActive);
      setFiles(activeFiles);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectFile = (file) => {
    setSelectedFile(file);
    setShareUrl(`${window.location.origin}/share/${file._id}`);
    setShowQR(true);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Enlace copiado al portapapeles');
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };
  
  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      
      // Descargar imagen
      const downloadLink = document.createElement('a');
      downloadLink.download = `compartir-${selectedFile.name.substring(0, 20)}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };
  
  const getFileIcon = (fileType) => {
    const iconBase = "w-10 h-10 rounded-lg p-2 ";
    
    if (fileType.includes('image')) {
      return (
        <div className={iconBase + "bg-pink-900 text-pink-200"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      );
    } else if (fileType.includes('pdf')) {
      return (
        <div className={iconBase + "bg-pink-900 text-pink-200"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      );
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return (
        <div className={iconBase + "bg-pink-900 text-pink-200"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className={iconBase + "bg-gray-800 text-gray-400"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      );
    }
  };
  
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Compartir Archivos</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-lg border border-gray-800 shadow p-4">
            <h2 className="text-xl font-bold mb-4 text-white">Mis Archivos</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              </div>
            ) : files.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {files.map((file) => (
                  <div 
                    key={file._id} 
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedFile && selectedFile._id === file._id
                        ? 'bg-gray-800 border-pink-500'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => handleSelectFile(file)}
                  >
                    <div className="flex items-center">
                      {getFileIcon(file.type)}
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">
                          {file.name}
                        </p>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-400">
                            {formatFileSize(file.size)}
                          </p>
                          <p className="text-xs text-gray-400">
                            Descargas: {file.downloadCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400 mb-2">No tienes archivos para compartir</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-lg border border-gray-800 shadow p-6">
            {selectedFile ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white mb-1">{selectedFile.name}</h2>
                  <p className="text-gray-400 text-sm">
                    {formatFileSize(selectedFile.size)} · {selectedFile.type.split('/')[1]} · Subido el {new Date(selectedFile.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Enlace para compartir
                    </label>
                    <div className="flex rounded-md shadow-sm">
                      <input
                        type="text"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        value={shareUrl}
                        readOnly
                      />
                      <button
                        onClick={handleCopyLink}
                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-700 rounded-r-md bg-gray-700 text-gray-200 hover:bg-gray-600 relative"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                        {showTooltip && (
                          <span className="absolute -top-10 right-0 bg-gray-700 text-white text-xs px-2 py-1 rounded">
                            ¡Copiado!
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Código QR
                    </label>
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-3 rounded-lg">
                        <QRCodeSVG 
                          id="qr-code"
                          value={shareUrl} 
                          size={200} 
                          bgColor="#FFFFFF"
                          fgColor="#000000"
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <button
                          onClick={handleDownloadQR}
                          className="inline-flex items-center px-4 py-2 bg-pink-600 border border-transparent rounded-md font-medium text-white hover:bg-pink-700 text-sm"
                        >
                          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Descargar QR
                        </button>
                        <button
                          onClick={handleCopyLink}
                          className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md font-medium text-gray-200 bg-gray-800 hover:bg-gray-700 text-sm"
                        >
                          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          Copiar enlace
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 mt-6">
                    <h3 className="font-medium text-gray-200 mb-2">Información adicional</h3>
                    <ul className="space-y-1 text-sm text-gray-400">
                      <li>• Este enlace expira el {new Date(selectedFile.expiresAt).toLocaleDateString()}</li>
                      <li>• El archivo se ha descargado {selectedFile.downloadCount} veces</li>
                      {selectedFile.accessCode && (
                        <li>• El archivo está protegido con contraseña</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <svg className="w-16 h-16 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <p className="mt-4 text-center text-gray-400">
                  Selecciona un archivo para compartirlo<br />
                  Podrás generar enlaces y códigos QR
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 