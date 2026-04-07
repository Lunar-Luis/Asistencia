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

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    window.location.href = '/login'; 
    throw new Error('Sesión expirada o acceso denegado');
  }

  if (!response.ok) throw new Error('Error en la petición al servidor');
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
 * ENDPOINTS: EMPLEADOS
 * ==========================================
 */
export const getEmpleados = () => fetchAuth('/empleados');
export const crearEmpleado = (empleado: EmpleadoRequest) => fetchAuth('/empleados', { method: 'POST', body: JSON.stringify(empleado) });
export const actualizarEmpleado = (id: number, empleado: EmpleadoRequest) => fetchAuth(`/empleados/${id}`, { method: 'PUT', body: JSON.stringify(empleado) });
export const desactivarEmpleado = (id: number) => fetchAuth(`/empleados/${id}`, { method: 'DELETE' });