const API_URL = 'http://localhost:8080/api';

/**
 * ==========================================
 * MÓDULO DE AUTENTICACIÓN
 * ==========================================
 */

export const loginAPI = async (username: string, password: string) => {
  // ---> MODIFICACIÓN: Forzamos el usuario a minúsculas y quitamos espacios <---
  const usuarioSanitizado = username.trim().toLowerCase();

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: usuarioSanitizado, password }),
  });
  if (!response.ok) throw new Error('Credenciales incorrectas');
  return response.json();
};

export const refreshTokenAPI = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("No hay token");

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Token caducado o inválido');
  return response.json(); 
};

export const solicitarRecuperacionPassword = async (email: string) => {
  const emailSanitizado = email.trim().toLowerCase();
  
  const response = await fetch(`${API_URL}/auth/recuperar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: emailSanitizado }),
  });
  
  if (!response.ok) {
      try {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al solicitar recuperación");
      } catch {
          throw new Error("Error de conexión al servidor");
      }
  }
  return response.json(); 
};

export const restablecerPasswordAPI = async (token: string, nuevaPassword: string) => {
  const response = await fetch(`${API_URL}/auth/restablecer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, nuevaPassword }),
  });
  
  if (!response.ok) {
      try {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al restablecer la contraseña");
      } catch {
          throw new Error("Error de conexión al servidor");
      }
  }
  return response.json();
};

/**
 * ==========================================
 * NÚCLEO DE PETICIONES (FETCH WRAPPER)
 * ==========================================
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

  if (!response.ok) {
    if (response.status === 401 || (response.status === 403 && !endpoint.includes('/empleados'))) {
      localStorage.removeItem('token');
      window.location.href = '/login'; 
      throw new Error('Sesión expirada o acceso denegado');
    }
    
   let errorMessage = 'Error en la petición al servidor';
    try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
        try {
           errorMessage = await response.text() || errorMessage;
        } catch (err) {
           console.debug("No se pudo extraer el texto del error", err);
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
  cargo?: Cargo; 
  horario?: Horario; 
}

export interface EmpleadoRequest {
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  telefono: string;
  nfcUid: string;
  fotoUrl?: string;
  cargoId: number;
  horarioId: number;
  activo?: boolean;
}

export interface Terminal {
  id?: number;
  nombre: string;
  macAddress: string;
  ubicacion: string;
  ultimoPing?: string;
  activo?: boolean;
}

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
  estadoEntrada: string; 
  horasTrabajadas: number | null;
}

export interface DashboardResumen {
  totalEmpleados: number;
  presentesHoy: number;
  tardeHoy: number;
  ausentesHoy: number;
  chartData: {
    dia: string;
    aTiempo: number;
    tarde: number;
    ausentes: number;
  }[];
}

export interface ActualizarPerfilData {
  username: string;
  email: string;
  password?: string;
  avatarUrl?: string;
}


export interface ConfiguracionData {
  cierreAutomatico: boolean;
  lateAlerts: boolean;
  weeklyReports: boolean;
  activityLog: boolean;
}

/**
 * ==========================================
 * ENDPOINTS API
 * ==========================================
 */

// --- CARGOS ---
export const getCargos = () => fetchAuth('/cargos');
export const crearCargo = (cargo: Cargo) => fetchAuth('/cargos', { method: 'POST', body: JSON.stringify(cargo) });
export const actualizarCargo = (id: number, cargo: Cargo) => fetchAuth(`/cargos/${id}`, { method: 'PUT', body: JSON.stringify(cargo) });
export const desactivarCargo = (id: number) => fetchAuth(`/cargos/${id}`, { method: 'DELETE' });

// --- HORARIOS ---
export const getHorarios = () => fetchAuth('/horarios');
export const crearHorario = (horario: Horario) => fetchAuth('/horarios', { method: 'POST', body: JSON.stringify(horario) });
export const actualizarHorario = (id: number, horario: Horario) => fetchAuth(`/horarios/${id}`, { method: 'PUT', body: JSON.stringify(horario) });
export const desactivarHorario = (id: number) => fetchAuth(`/horarios/${id}`, { method: 'DELETE' });

// --- EMPLEADOS ---
export const getEmpleados = () => fetchAuth('/empleados');
export const crearEmpleado = (empleado: EmpleadoRequest) => fetchAuth('/empleados', { method: 'POST', body: JSON.stringify(empleado) });
export const actualizarEmpleado = (id: number, empleado: EmpleadoRequest) => fetchAuth(`/empleados/${id}`, { method: 'PUT', body: JSON.stringify(empleado) });
export const desactivarEmpleado = (id: number) => fetchAuth(`/empleados/${id}`, { method: 'DELETE' });

// --- HARDWARE / NFC ---
export const activarModoRegistro = () => fetchAuth('/empleados/hardware/activar-modo-registro', { method: 'POST' });
export const leerTarjetaHardware = () => fetchAuth('/empleados/hardware/leer-registro');

// --- TERMINALES ---
export const getTerminales = () => fetchAuth('/terminales');
export const crearTerminal = (terminal: Terminal) => fetchAuth('/terminales', { method: 'POST', body: JSON.stringify(terminal) });
export const actualizarTerminal = (id: number, terminal: Terminal) => fetchAuth(`/terminales/${id}`, { method: 'PUT', body: JSON.stringify(terminal) });
export const desactivarTerminal = (id: number) => fetchAuth(`/terminales/${id}`, { method: 'DELETE' });

// --- ASISTENCIAS ---
export const getAsistencias = () => fetchAuth('/asistencias');
export const getDashboardResumen = () => fetchAuth('/asistencias/dashboard/resumen');

// --- PERFIL DE USUARIO ---
export const getMiPerfil = () => fetchAuth('/usuarios/perfil');

export const actualizarPerfil = async (data: ActualizarPerfilData) => {
  // ---> MODIFICACIÓN: Interceptamos y limpiamos los datos <---
  const datosSanitizados = {
    ...data,
    username: data.username.trim().toLowerCase(),
    email: data.email.trim().toLowerCase()
  };

  const response = await fetchAuth('/usuarios/perfil', { 
    method: 'PUT', 
    body: JSON.stringify(datosSanitizados) 
  });
  
  if (response && response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('username', response.username);
    localStorage.setItem('rol', response.rol);
    if (response.avatarUrl) localStorage.setItem('avatar', response.avatarUrl);
    // Usamos el email sanitizado para guardarlo en el local storage
    localStorage.setItem('email', datosSanitizados.email);
  }
  
  return response;
};


// --- CONFIGURACIÓN DEL SISTEMA ---
export const getConfiguracion = () => fetchAuth('/configuracion');
export const actualizarConfiguracion = (data: ConfiguracionData) => fetchAuth('/configuracion', { method: 'PUT', body: JSON.stringify(data) });