/**
 * Cloudinary Test Component
 * @fileoverview Component to test Cloudinary configuration
 */

import React, { useState } from 'react';
import { cloudinaryService } from '../../services/cloudinaryService';

const CloudinaryTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const testConfiguration = () => {
    setIsLoading(true);
    
    try {
      const configStatus = cloudinaryService.getConfigStatus();
      
      if (configStatus.configured) {
        setTestResult('✅ Cloudinary configurado correctamente!');
      } else {
        const missing = [];
        if (!configStatus.cloudName) missing.push('Cloud Name');
        if (!configStatus.uploadPreset) missing.push('Upload Preset');
        if (!configStatus.apiKey) missing.push('API Key');
        
        setTestResult(`❌ Configuración incompleta. Faltan: ${missing.join(', ')}`);
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '20px' }}>
      <h3>🧪 Test de Configuración Cloudinary</h3>
      
      <button 
        onClick={testConfiguration}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Probando...' : 'Probar Configuración'}
      </button>
      
      {testResult && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
          {testResult}
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Variables de entorno necesarias:</strong></p>
        <ul>
          <li>VITE_CLOUDINARY_CLOUD_NAME</li>
          <li>VITE_CLOUDINARY_API_KEY</li>
          <li>VITE_CLOUDINARY_API_SECRET</li>
          <li>VITE_CLOUDINARY_UPLOAD_PRESET</li>
        </ul>
      </div>
    </div>
  );
};

export default CloudinaryTest;
