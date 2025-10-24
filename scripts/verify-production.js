#!/usr/bin/env node

/**
 * Script de verificación para configuración de producción
 * Verifica que todos los endpoints y configuraciones estén correctos
 */

const https = require('https');
const http = require('http');

const PRODUCTION_API_URL = 'https://pi-mp-2-back-prod.onrender.com/api';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      method: 'GET',
      timeout: 10000,
      ...options
    };

    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    req.end();
  });
}

async function checkHealthEndpoint() {
  try {
    log('🔍 Verificando endpoint de salud...', 'blue');
    const response = await makeRequest(`${PRODUCTION_API_URL}/health`);
    
    if (response.status === 200) {
      log('✅ Endpoint de salud funcionando', 'green');
      return true;
    } else {
      log(`❌ Endpoint de salud retornó status ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Error verificando endpoint de salud: ${error.message}`, 'red');
    return false;
  }
}

async function checkFavoritesEndpoints() {
  const endpoints = [
    '/favorites/me',
    '/favorites',
    '/users/profile'
  ];

  log('🔍 Verificando endpoints de favoritos...', 'blue');
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${PRODUCTION_API_URL}${endpoint}`);
      
      if (response.status === 401) {
        log(`✅ ${endpoint} - Endpoint disponible (requiere autenticación)`, 'green');
      } else if (response.status === 200) {
        log(`✅ ${endpoint} - Endpoint funcionando`, 'green');
      } else {
        log(`⚠️ ${endpoint} - Status ${response.status}`, 'yellow');
      }
    } catch (error) {
      log(`❌ ${endpoint} - Error: ${error.message}`, 'red');
    }
  }
}

async function checkEnvironmentVariables() {
  log('🔍 Verificando variables de entorno...', 'blue');
  
  const requiredVars = [
    'VITE_API_BASE_URL',
    'VITE_NODE_ENV',
    'VITE_API_TIMEOUT'
  ];

  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length === 0) {
    log('✅ Todas las variables de entorno requeridas están configuradas', 'green');
  } else {
    log(`❌ Variables de entorno faltantes: ${missingVars.join(', ')}`, 'red');
  }
}

async function main() {
  log('🚀 Iniciando verificación de configuración de producción...', 'blue');
  log('', 'reset');

  const healthCheck = await checkHealthEndpoint();
  log('', 'reset');

  await checkFavoritesEndpoints();
  log('', 'reset');

  checkEnvironmentVariables();
  log('', 'reset');

  if (healthCheck) {
    log('✅ Configuración de producción verificada correctamente', 'green');
    log('🎉 Los favoritos deberían funcionar en producción', 'green');
  } else {
    log('❌ Hay problemas con la configuración de producción', 'red');
    log('🔧 Revisa la configuración del backend y las variables de entorno', 'yellow');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkHealthEndpoint, checkFavoritesEndpoints, checkEnvironmentVariables };
