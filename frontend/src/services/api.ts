// src/services/api.ts

const API_URL = 'http://localhost:8080/api';

/**
 * ==========================================
 * MÓDULO DE AUTENTICACIÓN
 * ==========================================
 */

/**
 * Autentica al usuario contra el backend y devuelve el JWT.
 * @param username El nombre de usuario (ej. 'admin')
 * @param password La contraseña en texto plano
 * @returns Objeto con el token JWT, username y rol.
 */
export const loginAPI = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error('Credenciales incorrectas');
  return response.json();
};

/**
 * Función interna para realizar peticiones HTTP adjuntando el Token JWT.
 * Si el token expira, intercepta el error 401/403 y expulsa al usuario al Login.
 * @param endpoint Ruta del backend (ej. '/cargos')
 * @param options Opciones nativas de fetch (method, body, headers, etc.)
 */
const fetchAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Si la respuesta no es OK
  if (!response.ok) {
    // Solo expulsamos si es 401 (No Autorizado) o si es 403 Y el endpoint NO es de creación/edición de datos
    // Esto previene que un error de validación en /empleados te saque del sistema.
    if (response.status === 401 || (response.status === 403 && !endpoint.includes('/empleados'))) {
      localStorage.removeItem('token');
      window.location.href = '/login'; 
      throw new Error('Sesión expirada o acceso denegado');
    }
    
    // Intentamos extraer el mensaje de error real del backend
   let errorMessage = 'Error en la petición al servidor';
    try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
        // Si no es JSON, intentamos texto
        try {
           errorMessage = await response.text() || errorMessage;
        } catch {
           // Ignoramos el error de parseo para conservar el mensaje por defecto
        }
    }
    throw new Error(errorMessage);
  }
  
  if (response.status === 204) return null;
  
  return response.json();
};

/**
 * ==========================================
 * INTERFACES DE DATOS (MODELOS)
 * ==========================================
 */

export interface Cargo {
  id?: number;
  nombre: string;
  descripcion: string;
  activo?: boolean;
  empleadosCount?: number;
}

export interface Horario {
  id?: number;
  nombre: string;
  horaEntrada: string;
  horaSalida: string;
  toleranciaMinutos: number;
  diasLaborables: string;
  activo?: boolean;
  empleadosCount?: number;
}

export interface Empleado {
  id?: number;
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  telefono: string;
  nfcUid: string;
  fotoUrl?: string;
  activo?: boolean;
  fechaIngreso?: string;
  // Relaciones devueltas por Spring Boot
  cargo?: Cargo; 
  horario?: Horario; 
}

// Interfaz para crear/editar (coincide con EmpleadoRequestDTO)
export interface EmpleadoRequest {
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  telefono: string;
  nfcUid: string;
  cargoId: number;
  horarioId: number;
  activo?: boolean; // Para poder reactivarlo desde React
}

/**
 * ==========================================
 * INTERFACES: TERMINALES
 * ==========================================
 */
export interface Terminal {
  id?: number;
  nombre: string;
  macAddress: string;
  ubicacion: string;
  ultimoPing?: string;
  activo?: boolean;
}

/**
 * ==========================================
 * INTERFACES: ASISTENCIAS
 * ==========================================
 */
export interface Asistencia {
  id: number;
  empleado: {
    id: number;
    nombre: string;
    apellido: string;
    nfcUid: string;
    cargo: { nombre: string };
  };
  terminal: { nombre: string };
  fechaRegistro: string;
  marcaEntrada: string;
  marcaSalida: string | null;
  estadoEntrada: string; // 'A_TIEMPO', 'TARDE', 'AUSENTE'
  horasTrabajadas: number | null;
}

/**
 * ==========================================
 * ENDPOINTS: CARGOS
 * ==========================================
 */
export const getCargos = () => fetchAuth('/cargos');
export const crearCargo = (cargo: Cargo) => fetchAuth('/cargos', { method: 'POST', body: JSON.stringify(cargo) });
export const actualizarCargo = (id: number, cargo: Cargo) => fetchAuth(`/cargos/${id}`, { method: 'PUT', body: JSON.stringify(cargo) });
export const desactivarCargo = (id: number) => fetchAuth(`/cargos/${id}`, { method: 'DELETE' });

/**
 * ==========================================
 * ENDPOINTS: HORARIOS
 * ==========================================
 */
export const getHorarios = () => fetchAuth('/horarios');
export const crearHorario = (horario: Horario) => fetchAuth('/horarios', { method: 'POST', body: JSON.stringify(horario) });
export const actualizarHorario = (id: number, horario: Horario) => fetchAuth(`/horarios/${id}`, { method: 'PUT', body: JSON.stringify(horario) });
export const desactivarHorario = (id: number) => fetchAuth(`/horarios/${id}`, { method: 'DELETE' });

/**
 * ==========================================
 * ENDPOINTS: EMPLEADOS Y HARDWARE
 * ==========================================
 */
export const getEmpleados = () => fetchAuth('/empleados');
export const crearEmpleado = (empleado: EmpleadoRequest) => fetchAuth('/empleados', { method: 'POST', body: JSON.stringify(empleado) });
export const actualizarEmpleado = (id: number, empleado: EmpleadoRequest) => fetchAuth(`/empleados/${id}`, { method: 'PUT', body: JSON.stringify(empleado) });
export const desactivarEmpleado = (id: number) => fetchAuth(`/empleados/${id}`, { method: 'DELETE' });

// ---> NUEVOS ENDPOINTS PARA LEER LA TARJETA DESDE REACT <---
export const activarModoRegistro = () => fetchAuth('/empleados/hardware/activar-modo-registro', { method: 'POST' });
export const leerTarjetaHardware = () => fetchAuth('/empleados/hardware/leer-registro');


/**
 * ==========================================
 * ENDPOINTS: TERMINALES
 * ==========================================
 */
export const getTerminales = () => fetchAuth('/terminales');
export const crearTerminal = (terminal: Terminal) => fetchAuth('/terminales', { method: 'POST', body: JSON.stringify(terminal) });
export const actualizarTerminal = (id: number, terminal: Terminal) => fetchAuth(`/terminales/${id}`, { method: 'PUT', body: JSON.stringify(terminal) });
export const desactivarTerminal = (id: number) => fetchAuth(`/terminales/${id}`, { method: 'DELETE' });

/**
 * ==========================================
 * ENDPOINTS: ASISTENCIAS
 * ==========================================
 */
// Obtiene el historial completo de asistencias desde la base de datos
export const getAsistencias = () => fetchAuth('/asistencias');