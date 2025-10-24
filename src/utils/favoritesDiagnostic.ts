/**
 * Diagnóstico de Favoritos en Producción
 * 
 * Herramientas para diagnosticar problemas con favoritos en producción
 */

import { API_CONFIG } from '../config/environment';
import { FAVORITES_ENDPOINTS, PRODUCTION_ERROR_MESSAGES } from '../config/production';

export interface DiagnosticResult {
  success: boolean;
  message: string;
  details?: any;
  recommendations?: string[];
}

export class FavoritesDiagnostic {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Diagnosticar problema de agregar a favoritos
   */
  async diagnoseAddToFavorites(movieId: string): Promise<DiagnosticResult> {
    const results: DiagnosticResult[] = [];
    
    // 1. Verificar conectividad
    const connectivityResult = await this.checkConnectivity();
    results.push(connectivityResult);
    
    // 2. Verificar autenticación
    const authResult = await this.checkAuthentication();
    results.push(authResult);
    
    // 3. Verificar formato de datos
    const dataResult = this.checkDataFormat(movieId);
    results.push(dataResult);
    
    // 4. Verificar endpoint
    const endpointResult = await this.checkEndpoint();
    results.push(endpointResult);

    const hasErrors = results.some(r => !r.success);
    
    return {
      success: !hasErrors,
      message: hasErrors ? 'Se encontraron problemas en el diagnóstico' : 'Diagnóstico completado sin errores',
      details: results,
      recommendations: this.generateRecommendations(results)
    };
  }

  /**
   * Verificar conectividad con el backend
   */
  private async checkConnectivity(): Promise<DiagnosticResult> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        timeout: 10000
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Conectividad con backend: OK'
        };
      } else {
        return {
          success: false,
          message: `Backend respondió con status: ${response.status}`,
          recommendations: ['Verificar que el backend esté funcionando', 'Verificar la URL del backend']
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error de conectividad: ${error}`,
        recommendations: ['Verificar conexión a internet', 'Verificar URL del backend', 'Verificar CORS']
      };
    }
  }

  /**
   * Verificar autenticación
   */
  private async checkAuthentication(): Promise<DiagnosticResult> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token) {
      return {
        success: false,
        message: 'No hay token de autenticación',
        recommendations: ['Iniciar sesión nuevamente', 'Verificar que el login funcione correctamente']
      };
    }

    if (!user) {
      return {
        success: false,
        message: 'No hay datos de usuario',
        recommendations: ['Iniciar sesión nuevamente', 'Verificar que el login funcione correctamente']
      };
    }

    try {
      const userData = JSON.parse(user);
      if (!userData.id) {
        return {
          success: false,
          message: 'Datos de usuario incompletos',
          recommendations: ['Iniciar sesión nuevamente', 'Verificar formato de datos de usuario']
        };
      }

      return {
        success: true,
        message: 'Autenticación: OK'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error parseando datos de usuario',
        recommendations: ['Iniciar sesión nuevamente', 'Limpiar localStorage']
      };
    }
  }

  /**
   * Verificar formato de datos
   */
  private checkDataFormat(movieId: string): DiagnosticResult {
    if (!movieId) {
      return {
        success: false,
        message: 'MovieId no proporcionado',
        recommendations: ['Verificar que se pase el movieId correctamente']
      };
    }

    if (typeof movieId !== 'string') {
      return {
        success: false,
        message: 'MovieId no es string',
        recommendations: ['Convertir movieId a string']
      };
    }

    if (!/^[0-9a-fA-F]{24}$/.test(movieId)) {
      return {
        success: false,
        message: 'MovieId no es un ObjectId válido',
        recommendations: ['Verificar que el movieId sea un ObjectId de MongoDB válido']
      };
    }

    return {
      success: true,
      message: 'Formato de datos: OK'
    };
  }

  /**
   * Verificar endpoint de favoritos
   */
  private async checkEndpoint(): Promise<DiagnosticResult> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          success: false,
          message: 'No hay token para verificar endpoint'
        };
      }

      const response = await fetch(`${this.baseUrl}${FAVORITES_ENDPOINTS.GET_MY_FAVORITES}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        return {
          success: false,
          message: 'Token inválido o expirado',
          recommendations: ['Iniciar sesión nuevamente', 'Verificar que el token no haya expirado']
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          message: 'Endpoint de favoritos no encontrado',
          recommendations: ['Verificar que el backend tenga el endpoint /favorites/me', 'Verificar la URL del backend']
        };
      }

      if (response.ok) {
        return {
          success: true,
          message: 'Endpoint de favoritos: OK'
        };
      }

      return {
        success: false,
        message: `Endpoint respondió con status: ${response.status}`,
        recommendations: ['Verificar logs del backend', 'Verificar configuración del endpoint']
      };
    } catch (error) {
      return {
        success: false,
        message: `Error verificando endpoint: ${error}`,
        recommendations: ['Verificar conectividad', 'Verificar URL del endpoint']
      };
    }
  }

  /**
   * Generar recomendaciones basadas en los resultados
   */
  private generateRecommendations(results: DiagnosticResult[]): string[] {
    const recommendations: string[] = [];
    
    results.forEach(result => {
      if (!result.success && result.recommendations) {
        recommendations.push(...result.recommendations);
      }
    });

    // Recomendaciones generales
    if (recommendations.length > 0) {
      recommendations.push('Verificar logs del navegador para más detalles');
      recommendations.push('Verificar logs del backend');
      recommendations.push('Probar en modo incógnito para descartar problemas de cache');
    }

    return [...new Set(recommendations)]; // Eliminar duplicados
  }

  /**
   * Simular agregar a favoritos para diagnóstico
   */
  async simulateAddToFavorites(movieId: string): Promise<DiagnosticResult> {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        return {
          success: false,
          message: 'No hay datos de autenticación',
          recommendations: ['Iniciar sesión nuevamente']
        };
      }

      const userData = JSON.parse(user);
      const requestBody = {
        userId: userData.id,
        movieId: movieId
      };

      console.log('🔍 Simulando agregar a favoritos:', requestBody);

      const response = await fetch(`${this.baseUrl}${FAVORITES_ENDPOINTS.ADD_FAVORITE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'Simulación exitosa',
          details: responseData
        };
      } else {
        return {
          success: false,
          message: `Error en simulación: ${response.status}`,
          details: {
            status: response.status,
            response: responseData
          },
          recommendations: this.getErrorRecommendations(response.status, responseData)
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error en simulación: ${error}`,
        recommendations: ['Verificar conectividad', 'Verificar configuración del backend']
      };
    }
  }

  /**
   * Obtener recomendaciones específicas para cada tipo de error
   */
  private getErrorRecommendations(status: number, responseData: any): string[] {
    switch (status) {
      case 400:
        return [
          'Verificar formato de datos enviados',
          'Verificar que movieId sea válido',
          'Verificar que userId sea válido',
          'Revisar logs del backend para detalles específicos'
        ];
      case 401:
        return [
          'Token expirado o inválido',
          'Iniciar sesión nuevamente',
          'Verificar que el usuario esté autenticado'
        ];
      case 403:
        return [
          'Usuario no tiene permisos',
          'Verificar que el usuario esté autenticado correctamente',
          'Verificar que el userId coincida con el del token'
        ];
      case 404:
        return [
          'Endpoint no encontrado',
          'Verificar que el backend tenga el endpoint /favorites',
          'Verificar la URL del backend'
        ];
      case 409:
        return [
          'La película ya está en favoritos',
          'Verificar estado actual de favoritos',
          'Intentar eliminar primero si ya existe'
        ];
      case 500:
        return [
          'Error interno del servidor',
          'Verificar logs del backend',
          'Contactar al administrador del sistema'
        ];
      default:
        return [
          'Error desconocido',
          'Verificar logs del backend',
          'Verificar conectividad'
        ];
    }
  }
}

export const favoritesDiagnostic = new FavoritesDiagnostic();
