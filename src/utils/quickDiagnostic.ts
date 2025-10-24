/**
 * Diagnóstico Rápido de Favoritos
 * 
 * Script que se puede ejecutar desde la consola del navegador
 * para diagnosticar problemas con favoritos en producción
 */

export const quickDiagnostic = {
  /**
   * Ejecutar diagnóstico completo
   */
  async run(movieId: string = '68fb2c610f34b66d0eb4d9c2') {
    console.log('🔍 Iniciando diagnóstico rápido de favoritos...');
    console.log('📋 MovieId:', movieId);
    console.log('🌐 URL:', window.location.origin);
    console.log('⏰ Timestamp:', new Date().toLocaleString());
    console.log('');

    const results = {
      connectivity: await this.checkConnectivity(),
      authentication: this.checkAuthentication(),
      dataFormat: this.checkDataFormat(movieId),
      localStorage: this.checkLocalStorage(),
      network: await this.checkNetwork(movieId)
    };

    console.log('📊 Resultados del diagnóstico:');
    console.table(results);

    const hasErrors = Object.values(results).some(r => !r.success);
    
    if (hasErrors) {
      console.log('❌ Se encontraron problemas. Revisar recomendaciones arriba.');
    } else {
      console.log('✅ Diagnóstico completado sin errores.');
    }

    return results;
  },

  /**
   * Verificar conectividad
   */
  async checkConnectivity() {
    try {
      const response = await fetch('https://pi-mp-2-back-prod.onrender.com/api/health');
      if (response.ok) {
        console.log('✅ Conectividad: OK');
        return { success: true, message: 'Backend accesible' };
      } else {
        console.log(`❌ Conectividad: Error ${response.status}`);
        return { success: false, message: `Backend respondió con ${response.status}` };
      }
    } catch (error) {
      console.log('❌ Conectividad: Error de red');
      return { success: false, message: `Error de red: ${error}` };
    }
  },

  /**
   * Verificar autenticación
   */
  checkAuthentication() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token) {
      console.log('❌ Autenticación: No hay token');
      return { success: false, message: 'No hay token de autenticación' };
    }

    if (!user) {
      console.log('❌ Autenticación: No hay datos de usuario');
      return { success: false, message: 'No hay datos de usuario' };
    }

    try {
      const userData = JSON.parse(user);
      if (!userData.id) {
        console.log('❌ Autenticación: Datos de usuario incompletos');
        return { success: false, message: 'Datos de usuario incompletos' };
      }

      console.log('✅ Autenticación: OK');
      return { success: true, message: 'Usuario autenticado correctamente' };
    } catch (error) {
      console.log('❌ Autenticación: Error parseando datos');
      return { success: false, message: 'Error parseando datos de usuario' };
    }
  },

  /**
   * Verificar formato de datos
   */
  checkDataFormat(movieId: string) {
    if (!movieId) {
      console.log('❌ Formato: MovieId no proporcionado');
      return { success: false, message: 'MovieId no proporcionado' };
    }

    if (typeof movieId !== 'string') {
      console.log('❌ Formato: MovieId no es string');
      return { success: false, message: 'MovieId no es string' };
    }

    if (!/^[0-9a-fA-F]{24}$/.test(movieId)) {
      console.log('❌ Formato: MovieId no es ObjectId válido');
      return { success: false, message: 'MovieId no es ObjectId válido' };
    }

    console.log('✅ Formato: OK');
    return { success: true, message: 'Formato de datos correcto' };
  },

  /**
   * Verificar localStorage
   */
  checkLocalStorage() {
    const keys = ['token', 'user'];
    const results = {};

    keys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        console.log(`✅ localStorage.${key}: OK`);
        results[key] = { success: true, message: 'Valor presente' };
      } else {
        console.log(`❌ localStorage.${key}: Faltante`);
        results[key] = { success: false, message: 'Valor faltante' };
      }
    });

    return results;
  },

  /**
   * Verificar red (simular request)
   */
  async checkNetwork(movieId: string) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('❌ Red: No hay token para verificar');
        return { success: false, message: 'No hay token para verificar' };
      }

      const response = await fetch('https://pi-mp-2-back-prod.onrender.com/api/favorites/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        console.log('❌ Red: Token inválido o expirado');
        return { success: false, message: 'Token inválido o expirado' };
      }

      if (response.status === 404) {
        console.log('❌ Red: Endpoint no encontrado');
        return { success: false, message: 'Endpoint no encontrado' };
      }

      if (response.ok) {
        console.log('✅ Red: Endpoint accesible');
        return { success: true, message: 'Endpoint accesible' };
      }

      console.log(`⚠️ Red: Status ${response.status}`);
      return { success: false, message: `Status ${response.status}` };
    } catch (error) {
      console.log('❌ Red: Error de conexión');
      return { success: false, message: `Error de conexión: ${error}` };
    }
  },

  /**
   * Simular agregar a favoritos
   */
  async simulateAddToFavorites(movieId: string) {
    console.log('🧪 Simulando agregar a favoritos...');
    
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        console.log('❌ Simulación: No hay datos de autenticación');
        return { success: false, message: 'No hay datos de autenticación' };
      }

      const userData = JSON.parse(user);
      const requestBody = {
        userId: userData.id,
        movieId: movieId
      };

      console.log('📤 Datos a enviar:', requestBody);

      const response = await fetch('https://pi-mp-2-back-prod.onrender.com/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();

      console.log('📥 Respuesta del servidor:', {
        status: response.status,
        data: responseData
      });

      if (response.ok) {
        console.log('✅ Simulación: Exitosa');
        return { success: true, message: 'Simulación exitosa', data: responseData };
      } else {
        console.log(`❌ Simulación: Error ${response.status}`);
        return { 
          success: false, 
          message: `Error ${response.status}`, 
          data: responseData,
          recommendations: this.getErrorRecommendations(response.status)
        };
      }
    } catch (error) {
      console.log('❌ Simulación: Error de conexión');
      return { success: false, message: `Error de conexión: ${error}` };
    }
  },

  /**
   * Obtener recomendaciones para errores
   */
  getErrorRecommendations(status: number): string[] {
    switch (status) {
      case 400:
        return [
          'Verificar formato de datos',
          'Verificar que movieId sea válido',
          'Verificar que userId sea válido'
        ];
      case 401:
        return [
          'Token expirado o inválido',
          'Iniciar sesión nuevamente'
        ];
      case 403:
        return [
          'Usuario no tiene permisos',
          'Verificar autenticación'
        ];
      case 404:
        return [
          'Endpoint no encontrado',
          'Verificar URL del backend'
        ];
      case 409:
        return [
          'La película ya está en favoritos',
          'Verificar estado actual'
        ];
      default:
        return [
          'Error desconocido',
          'Verificar logs del backend'
        ];
    }
  }
};

// Hacer disponible globalmente para uso en consola
if (typeof window !== 'undefined') {
  (window as any).quickDiagnostic = quickDiagnostic;
  console.log('🔧 Diagnóstico rápido disponible como: quickDiagnostic');
  console.log('💡 Uso: quickDiagnostic.run("68fb2c610f34b66d0eb4d9c2")');
}
