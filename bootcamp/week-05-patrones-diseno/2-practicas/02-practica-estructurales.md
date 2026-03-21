# 💻 Práctica 02 — Patrones Estructurales en Acción

## 🎯 Objetivos

- Implementar **Adapter** para integrar una API de geolocalización externa
- Implementar **Facade** para unificar un sistema de pagos en Colombia
- Aplicar el principio de **inversión de dependencias** usando estos patrones

## ⏱️ Duración estimada: 40 minutos

---

## 🏋️ Ejercicio 1 — Adapter: Integrando APIs de Geolocalización (20 min)

### El Escenario

**DeliveryCO** es un sistema de entregas que necesita calcular distancias y rutas. Actualmente usa la API de OpenStreetMap (gratuita), pero podría migrar a Google Maps (de pago, más precisa). El reto: que el código de negocio no sepa cuál API está usando.

### Estructura del proyecto

```
practica-estructurales/
└── src/
    ├── index.js
    ├── adapter/
    │   ├── geo-service.js          ← Interfaz esperada por el sistema
    │   ├── openstreetmap-api.js    ← API externa (no la modificamos)
    │   ├── googlemaps-api.js       ← Otra API externa
    │   ├── osm-adapter.js          ← Adapter para OpenStreetMap
    │   └── googlemaps-adapter.js   ← Adapter para Google Maps
    └── facade/
        ├── payment-gateway.js
        ├── bancolombia-sdk.js      ← SDK externo (simulado)
        ├── daviplata-sdk.js        ← SDK externo (simulado)
        └── colombian-payment-facade.js
```

### Paso 1 — Define la interfaz que necesita tu sistema

```javascript
// src/adapter/geo-service.js
// Esta es la interfaz que NUESTRO SISTEMA espera — no cambia nunca

class GeoService {
  /**
   * Calcular distancia entre dos puntos
   * @param {{ lat: number, lng: number }} origin
   * @param {{ lat: number, lng: number }} destination
   * @returns {{ distanceKm: number, durationMinutes: number }}
   */
  async getDistance(origin, destination) {
    throw new Error('getDistance() debe ser implementado');
  }

  /**
   * Obtener coordenadas a partir de una dirección
   * @param {string} address - Dirección en texto
   * @returns {{ lat: number, lng: number, formattedAddress: string }}
   */
  async geocode(address) {
    throw new Error('geocode() debe ser implementado');
  }
}

export { GeoService };
```

### Paso 2 — Simula las APIs externas (como si fueran SDKs reales)

```javascript
// src/adapter/openstreetmap-api.js
// Simula el SDK de OpenStreetMap/Nominatim — tiene su propia interfaz

class OpenStreetMapAPI {
  async nominatimSearch(query) {
    // En producción: GET https://nominatim.openstreetmap.org/search?q=...
    console.log(`[OSM Nominatim] Buscando: "${query}"`);
    // Datos simulados de Bogotá
    return [{
      place_id: 12345,
      display_name: `${query}, Bogotá, Colombia`,
      lat: '4.7110',
      lon: '-74.0721',
    }];
  }

  async osrmRoute(startLat, startLon, endLat, endLon) {
    // En producción: GET https://router.project-osrm.org/route/v1/...
    console.log(`[OSM OSRM] Ruta de (${startLat},${startLon}) a (${endLat},${endLon})`);
    return {
      routes: [{
        distance: 12500,      // en metros
        duration: 1800,       // en segundos
        geometry: 'encoded_polyline_here',
      }],
      code: 'Ok',
    };
  }
}

export { OpenStreetMapAPI };
```

```javascript
// src/adapter/googlemaps-api.js
// Simula el SDK de Google Maps — interfaz completamente diferente

class GoogleMapsAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async geocodeAddress(params) {
    // Google Maps tiene su propia estructura de respuesta
    console.log(`[Google Maps] Geocodificando: "${params.address}"`);
    return {
      status: 'OK',
      results: [{
        formatted_address: `${params.address}, Bogotá, Colombia`,
        geometry: {
          location: { lat: 4.7110 + Math.random() * 0.01, lng: -74.0721 }
        }
      }]
    };
  }

  async getDirections(params) {
    console.log(`[Google Maps] Calculando ruta con tráfico en tiempo real...`);
    return {
      status: 'OK',
      routes: [{
        legs: [{
          distance: { value: 11200, text: '11.2 km' },
          duration: { value: 1440, text: '24 mins' },
          duration_in_traffic: { value: 2100, text: '35 mins' },
        }]
      }]
    };
  }
}

export { GoogleMapsAPI };
```

### Paso 3 — Crea los Adapters

```javascript
// src/adapter/osm-adapter.js
import { GeoService } from './geo-service.js';
import { OpenStreetMapAPI } from './openstreetmap-api.js';

class OSMAdapter extends GeoService {
  #api;

  constructor() {
    super();
    this.#api = new OpenStreetMapAPI();
  }

  async getDistance(origin, destination) {
    // Adaptar: nuestra interfaz → interfaz de OSM
    const route = await this.#api.osrmRoute(
      origin.lat, origin.lng,
      destination.lat, destination.lng
    );

    if (route.code !== 'Ok' || route.routes.length === 0) {
      throw new Error('No se pudo calcular la ruta');
    }

    const { distance, duration } = route.routes[0];

    // Adaptar la respuesta de OSM → nuestra interfaz estándar
    return {
      distanceKm: Math.round(distance / 100) / 10,       // metros → km
      durationMinutes: Math.round(duration / 60),         // segundos → minutos
      provider: 'OpenStreetMap',
    };
  }

  async geocode(address) {
    const results = await this.#api.nominatimSearch(address);
    if (results.length === 0) throw new Error(`No se encontró: "${address}"`);

    const { lat, lon, display_name } = results[0];
    return {
      lat: parseFloat(lat),
      lng: parseFloat(lon),
      formattedAddress: display_name,
    };
  }
}

export { OSMAdapter };
```

```javascript
// src/adapter/googlemaps-adapter.js
import { GeoService } from './geo-service.js';
import { GoogleMapsAPI } from './googlemaps-api.js';

class GoogleMapsAdapter extends GeoService {
  #api;

  constructor(apiKey) {
    super();
    this.#api = new GoogleMapsAPI(apiKey);
  }

  async getDistance(origin, destination) {
    // Primero geocodificamos los puntos si solo tenemos coordenadas
    const result = await this.#api.getDirections({
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      mode: 'driving',
      traffic_model: 'best_guess',
    });

    if (result.status !== 'OK') throw new Error('Google Maps no pudo calcular la ruta');

    const leg = result.routes[0].legs[0];
    return {
      distanceKm: Math.round(leg.distance.value / 100) / 10,
      durationMinutes: Math.round(leg.duration_in_traffic.value / 60), // tráfico en tiempo real
      provider: 'Google Maps',
    };
  }

  async geocode(address) {
    const result = await this.#api.geocodeAddress({ address });
    if (result.status !== 'OK') throw new Error(`Google Maps no encontró: "${address}"`);

    const { lat, lng } = result.results[0].geometry.location;
    return {
      lat,
      lng,
      formattedAddress: result.results[0].formatted_address,
    };
  }
}

export { GoogleMapsAdapter };
```

### Paso 4 — El sistema de negocio usa la interfaz, no el proveedor

```javascript
// src/index.js (parcial)
import { OSMAdapter } from './adapter/osm-adapter.js';
import { GoogleMapsAdapter } from './adapter/googlemaps-adapter.js';

// Cambiar de proveedor = cambiar esta línea
const geoService = process.env.USE_GOOGLE_MAPS === 'true'
  ? new GoogleMapsAdapter(process.env.GOOGLE_MAPS_KEY)
  : new OSMAdapter();

const origin = { lat: 4.6097, lng: -74.0817 };      // Bogotá Centro
const destination = { lat: 4.7110, lng: -74.0721 };  // Bogotá Norte

const result = await geoService.getDistance(origin, destination);
console.log(`\nDistancia: ${result.distanceKm} km`);
console.log(`Duración: ${result.durationMinutes} minutos`);
console.log(`Proveedor: ${result.provider}`);
// El código de negocio NO cambió — solo cambió el Adapter ✅
```

### 🤔 Preguntas de Reflexión

1. ¿Qué hacemos si `OpenStreetMapAPI` cambia su respuesta de `distance` en metros a kilómetros directamente? ¿Dónde se hace el ajuste?
2. ¿Cómo probarías unitariamente el `OSMAdapter` sin hacer llamadas reales a Internet?
3. ¿Qué diferencia hay entre Adapter y Facade? Escribe una frase diferenciándolos.

---

## 🏋️ Ejercicio 2 — Facade: Pagos Colombianos Unificados (20 min)

### El Escenario

**DeliveryCO** debe procesar pagos con múltiples métodos colombianos (Bancolombia, Daviplata, PSE). Cada banco tiene su propio SDK con firma de endpoints, tokens diferentes y respuestas distintas. La Facade unifica todo.

```javascript
// src/facade/bancolombia-sdk.js
// SDK simulado de Bancolombia
class BancolombiaSDK {
  async autenticar(clientId, clientSecret) {
    return { access_token: `bc_${Date.now()}`, expires_in: 3600 };
  }
  async debitarCuenta({ token, numeroCuenta, valor, referencia }) {
    console.log(`[Bancolombia] Debitando $${valor} de cuenta ${numeroCuenta}`);
    return { codigo_respuesta: '00', descripcion: 'APROBADA', nro_aprobacion: `BC${Date.now()}` };
  }
}

// src/facade/daviplata-sdk.js
// SDK simulado de Daviplata
class DaviplataSDK {
  async login(apiKey) {
    return { sessionToken: `dvt_${Date.now()}` };
  }
  async realizarTransferencia({ sessionToken, celular, monto, concepto }) {
    console.log(`[Daviplata] Transferencia de $${monto} a ${celular}`);
    return { estado: 'EXITOSO', idTransaccion: `DV${Date.now()}`, celular };
  }
}

export { BancolombiaSDK, DaviplataSDK };
```

```javascript
// src/facade/colombian-payment-facade.js
import { BancolombiaSDK, DaviplataSDK } from './bancolombia-sdk.js';

class ColombianPaymentFacade {
  #bancolombia;
  #daviplata;
  #bcToken = null;
  #dvtToken = null;

  constructor(config) {
    this.#bancolombia = new BancolombiaSDK();
    this.#daviplata = new DaviplataSDK();
    this.#config = config;
  }

  async #ensureBCToken() {
    if (!this.#bcToken) {
      const auth = await this.#bancolombia.autenticar(
        this.#config.bancolombia.clientId,
        this.#config.bancolombia.clientSecret
      );
      this.#bcToken = auth.access_token;
    }
    return this.#bcToken;
  }

  async #ensureDVTToken() {
    if (!this.#dvtToken) {
      const auth = await this.#daviplata.login(this.#config.daviplata.apiKey);
      this.#dvtToken = auth.sessionToken;
    }
    return this.#dvtToken;
  }

  /**
   * Procesar pago — interfaz única para todos los métodos
   * @param {number} amount - Monto en pesos colombianos
   * @param {string} method - 'bancolombia' | 'daviplata'
   * @param {Object} details - Detalles específicos del método
   * @returns {{ success: boolean, transactionId: string, method: string }}
   */
  async processPayment(amount, method, details) {
    if (method === 'bancolombia') {
      const token = await this.#ensureBCToken();
      const result = await this.#bancolombia.debitarCuenta({
        token,
        numeroCuenta: details.accountNumber,
        valor: amount,
        referencia: details.reference ?? `REF${Date.now()}`,
      });
      return {
        success: result.codigo_respuesta === '00',
        transactionId: result.nro_aprobacion,
        method: 'Bancolombia',
      };
    }

    if (method === 'daviplata') {
      const token = await this.#ensureDVTToken();
      const result = await this.#daviplata.realizarTransferencia({
        sessionToken: token,
        celular: details.phone,
        monto: amount,
        concepto: details.concept ?? 'Pago DeliveryCO',
      });
      return {
        success: result.estado === 'EXITOSO',
        transactionId: result.idTransaccion,
        method: 'Daviplata',
      };
    }

    throw new Error(`Método de pago no soportado: "${method}"`);
  }
}

export { ColombianPaymentFacade };
```

```javascript
// Integración en src/index.js
import { ColombianPaymentFacade } from './facade/colombian-payment-facade.js';

const payments = new ColombianPaymentFacade({
  bancolombia: { clientId: 'bc_test_id', clientSecret: 'bc_test_secret' },
  daviplata: { apiKey: 'dvt_test_key' },
});

// El código de negocio usa siempre la misma interfaz
const r1 = await payments.processPayment(85000, 'bancolombia', { accountNumber: '1234567890' });
console.log('\nPago Bancolombia:', r1);

const r2 = await payments.processPayment(45000, 'daviplata', { phone: '+573001234567' });
console.log('Pago Daviplata:', r2);
```

---

## ✅ Verificación Final

Antes de terminar, responde estas preguntas en tu cuaderno:

1. ¿Cuál es la diferencia de responsabilidad entre un **Adapter** y una **Facade**?
   - Adapter: conecta interfaces **incompatibles**
   - Facade: **simplifica** un subsistema complejo
   
2. ¿Cómo cambiarías el sistema de pagos para agregar PSE sin modificar el código que llama a `processPayment()`?

3. ¿Qué pasaría con el código de negocio si Bancolombia cambiara su estructura de respuesta de `codigo_respuesta` a `response_code`?

---

_Bootcamp de Arquitectura de Software · SENA · bc-channel-epti_
