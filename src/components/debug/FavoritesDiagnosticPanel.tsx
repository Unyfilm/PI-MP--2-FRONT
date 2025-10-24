/**
 * Panel de Diagnóstico de Favoritos
 * 
 * Componente para diagnosticar problemas con favoritos en producción
 */

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Bug } from 'lucide-react';
import { favoritesDiagnostic, type DiagnosticResult } from '../../utils/favoritesDiagnostic';
import './FavoritesDiagnosticPanel.css';

interface FavoritesDiagnosticPanelProps {
  movieId?: string;
  onClose?: () => void;
}

const FavoritesDiagnosticPanel: React.FC<FavoritesDiagnosticPanelProps> = ({ 
  movieId = '68fb2c610f34b66d0eb4d9c2', 
  onClose 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult | null>(null);
  const [simulationResult, setSimulationResult] = useState<DiagnosticResult | null>(null);

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults(null);
    setSimulationResult(null);

    try {
      const diagnosticResult = await favoritesDiagnostic.diagnoseAddToFavorites(movieId);
      setResults(diagnosticResult);

      if (diagnosticResult.success) {
        const simResult = await favoritesDiagnostic.simulateAddToFavorites(movieId);
        setSimulationResult(simResult);
      }
    } catch (error) {
      console.error('Error en diagnóstico:', error);
      setResults({
        success: false,
        message: `Error ejecutando diagnóstico: ${error}`,
        recommendations: ['Verificar conectividad', 'Verificar configuración']
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle size={16} className="status-icon success" />
    ) : (
      <XCircle size={16} className="status-icon error" />
    );
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'success' : 'error';
  };

  return (
    <div className="favorites-diagnostic-panel">
      <div className="diagnostic-header">
        <div className="diagnostic-title">
          <Bug size={20} />
          <h3>Diagnóstico de Favoritos</h3>
        </div>
        {onClose && (
          <button className="close-button" onClick={onClose}>
            <XCircle size={16} />
          </button>
        )}
      </div>

      <div className="diagnostic-content">
        <div className="diagnostic-info">
          <p><strong>MovieId:</strong> {movieId}</p>
          <p><strong>Endpoint:</strong> {window.location.origin}</p>
          <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
        </div>

        <div className="diagnostic-actions">
          <button 
            className="diagnostic-button"
            onClick={runDiagnostic}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <RefreshCw size={16} className="spinning" />
                Ejecutando diagnóstico...
              </>
            ) : (
              <>
                <AlertTriangle size={16} />
                Ejecutar Diagnóstico
              </>
            )}
          </button>
        </div>

        {results && (
          <div className="diagnostic-results">
            <div className={`result-summary ${getStatusColor(results.success)}`}>
              {getStatusIcon(results.success)}
              <span className="result-message">{results.message}</span>
            </div>

            {results.details && Array.isArray(results.details) && (
              <div className="result-details">
                <h4>Detalles del Diagnóstico:</h4>
                {results.details.map((detail: DiagnosticResult, index: number) => (
                  <div key={index} className={`detail-item ${getStatusColor(detail.success)}`}>
                    {getStatusIcon(detail.success)}
                    <span>{detail.message}</span>
                    {detail.recommendations && detail.recommendations.length > 0 && (
                      <div className="recommendations">
                        <strong>Recomendaciones:</strong>
                        <ul>
                          {detail.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {results.recommendations && results.recommendations.length > 0 && (
              <div className="general-recommendations">
                <h4>Recomendaciones Generales:</h4>
                <ul>
                  {results.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {simulationResult && (
          <div className="simulation-results">
            <h4>Resultado de Simulación:</h4>
            <div className={`simulation-summary ${getStatusColor(simulationResult.success)}`}>
              {getStatusIcon(simulationResult.success)}
              <span>{simulationResult.message}</span>
            </div>
            
            {simulationResult.details && (
              <div className="simulation-details">
                <pre>{JSON.stringify(simulationResult.details, null, 2)}</pre>
              </div>
            )}

            {simulationResult.recommendations && simulationResult.recommendations.length > 0 && (
              <div className="simulation-recommendations">
                <strong>Recomendaciones:</strong>
                <ul>
                  {simulationResult.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesDiagnosticPanel;
