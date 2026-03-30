// src/services/mockData.ts

export interface Empleado { id: number; nombre: string; cedula: string; cargo: string; departamento: string; correo: string; telefono: string; nfc_uid: string; ingreso: string; horario: string; status: 'Activo' | 'Inactivo'; foto: string | null; }
export interface Cargo { id: number; nombre: string; descripcion: string; empleadosCount: number; status: 'Activo' | 'Inactivo'; }
export interface Horario { id: number; nombre: string; tipo: string; entrada: string; salida: string; tolerancia: number; dias: string[]; status: 'Activo' | 'Inactivo'; empleados: number; }
export interface RegistroAsistencia { id: number; empleado: string; cargo: string; fecha: string; hora: string; tipo: 'Entrada' | 'Salida'; estado: 'A tiempo' | 'Tarde' | 'Ausente'; nfc: string; }

// Interfaz actualizada sin 'any'
export interface ResumenDashboard {
  stats: {
    totalEmpleados: number;
    presentesHoy: number;
    tardeHoy: number;
    ausentesHoy: number;
  };
  chartData: {
    dia: string;
    aTiempo: number;
    tarde: number;
    ausentes: number;
  }[];
}

// ==========================================
// BASE DE DATOS SIMULADA
// ==========================================
const db = {
  empleados: [
    { id: 1, nombre: 'Luis Medina', cedula: '26.852.963', cargo: 'Desarrollador', departamento: 'Tecnología', correo: 'lmedina@empresa.com', telefono: '+1 555 123 4567', nfc_uid: '04:3B:5C:22', ingreso: '01/08/2023', horario: 'Horario Normal', status: 'Activo', foto: null },
    { id: 2, nombre: 'Anurbe Martínez', cedula: '25.123.456', cargo: 'Administrador', departamento: 'Tecnología', correo: 'anurbe@empresa.com', telefono: '+1 234 567 8901', nfc_uid: 'A1:B2:C3:D4', ingreso: '12/01/2024', horario: 'Flexible', status: 'Activo', foto: '/images/ANURBE.jpg' },
    { id: 3, nombre: 'Andrea Torres', cedula: '24.987.654', cargo: 'Recursos Humanos', departamento: 'Talento', correo: 'andrea@empresa.com', telefono: '+1 987 654 3210', nfc_uid: 'D4:C3:B2:A1', ingreso: '05/03/2023', horario: 'Horario Normal', status: 'Inactivo', foto: null },
    { id: 4, nombre: 'Juan Castro', cedula: '21.456.789', cargo: 'Operario', departamento: 'Planta', correo: 'jcastro@empresa.com', telefono: '+1 123 456 7890', nfc_uid: 'E5:F6:G7:H8', ingreso: '15/06/2022', horario: 'Turno Operativo CMBT', status: 'Activo', foto: null },
  ] as Empleado[],

  cargos: [
    { id: 1, nombre: 'Administrador', descripcion: 'Gestión completa del sistema.', empleadosCount: 1, status: 'Activo' },
    { id: 2, nombre: 'Desarrollador', descripcion: 'Mantenimiento técnico.', empleadosCount: 1, status: 'Activo' },
    { id: 3, nombre: 'Recursos Humanos', descripcion: 'Manejo de personal.', empleadosCount: 1, status: 'Activo' },
    { id: 4, nombre: 'Operario', descripcion: 'Personal de planta.', empleadosCount: 1, status: 'Activo' },
  ] as Cargo[],

  horarios: [
    { id: 1, nombre: 'Horario Normal', tipo: 'Normal', entrada: '08:00', salida: '17:00', tolerancia: 10, dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'], status: 'Activo', empleados: 2 },
    { id: 2, nombre: 'Flexible', tipo: 'Administrativo', entrada: '09:00', salida: '18:00', tolerancia: 15, dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'], status: 'Activo', empleados: 1 },
    { id: 3, nombre: 'Turno Operativo CMBT', tipo: 'Operativo', entrada: '06:00', salida: '14:00', tolerancia: 5, dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], status: 'Activo', empleados: 1 },
  ] as Horario[],

  historialAsistencia: [
    { id: 1, empleado: "Luis Medina", cargo: "Desarrollador", fecha: "2024-11-12", hora: "07:55 AM", tipo: "Entrada", estado: "A tiempo", nfc: "04:3B:5C:22" },
    { id: 2, empleado: "Anurbe Martínez", cargo: "Administrador", fecha: "2024-11-12", hora: "08:50 AM", tipo: "Entrada", estado: "A tiempo", nfc: "A1:B2:C3:D4" },
    { id: 3, empleado: "Andrea Torres", cargo: "Recursos Humanos", fecha: "2024-11-12", hora: "08:15 AM", tipo: "Entrada", estado: "Tarde", nfc: "D4:C3:B2:A1" },
    { id: 4, empleado: "Juan Castro", cargo: "Operario", fecha: "2024-11-12", hora: "---", tipo: "Entrada", estado: "Ausente", nfc: "E5:F6:G7:H8" },
    { id: 5, empleado: "Luis Medina", cargo: "Desarrollador", fecha: "2024-11-11", hora: "08:05 AM", tipo: "Entrada", estado: "A tiempo", nfc: "04:3B:5C:22" },
    { id: 6, empleado: "Anurbe Martínez", cargo: "Administrador", fecha: "2024-11-11", hora: "09:16 AM", tipo: "Entrada", estado: "Tarde", nfc: "A1:B2:C3:D4" },
    { id: 7, empleado: "Andrea Torres", cargo: "Recursos Humanos", fecha: "2024-11-11", hora: "08:00 AM", tipo: "Entrada", estado: "A tiempo", nfc: "D4:C3:B2:A1" },
    { id: 8, empleado: "Juan Castro", cargo: "Operario", fecha: "2024-11-11", hora: "06:00 AM", tipo: "Entrada", estado: "A tiempo", nfc: "E5:F6:G7:H8" },
    { id: 9, empleado: "Juan Castro", cargo: "Operario", fecha: "2024-11-10", hora: "06:05 AM", tipo: "Entrada", estado: "A tiempo", nfc: "E5:F6:G7:H8" },
    { id: 10, empleado: "Juan Castro", cargo: "Operario", fecha: "2024-11-09", hora: "06:10 AM", tipo: "Entrada", estado: "Tarde", nfc: "E5:F6:G7:H8" },
    { id: 11, empleado: "Luis Medina", cargo: "Desarrollador", fecha: "2024-11-08", hora: "07:50 AM", tipo: "Entrada", estado: "A tiempo", nfc: "04:3B:5C:22" },
    { id: 12, empleado: "Anurbe Martínez", cargo: "Administrador", fecha: "2024-11-08", hora: "08:55 AM", tipo: "Entrada", estado: "A tiempo", nfc: "A1:B2:C3:D4" },
    { id: 13, empleado: "Andrea Torres", cargo: "Recursos Humanos", fecha: "2024-11-08", hora: "---", tipo: "Entrada", estado: "Ausente", nfc: "D4:C3:B2:A1" },
    { id: 14, empleado: "Juan Castro", cargo: "Operario", fecha: "2024-11-08", hora: "05:55 AM", tipo: "Entrada", estado: "A tiempo", nfc: "E5:F6:G7:H8" },
    { id: 15, empleado: "Luis Medina", cargo: "Desarrollador", fecha: "2024-11-07", hora: "08:12 AM", tipo: "Entrada", estado: "Tarde", nfc: "04:3B:5C:22" },
    { id: 16, empleado: "Anurbe Martínez", cargo: "Administrador", fecha: "2024-11-07", hora: "09:00 AM", tipo: "Entrada", estado: "A tiempo", nfc: "A1:B2:C3:D4" },
    { id: 17, empleado: "Andrea Torres", cargo: "Recursos Humanos", fecha: "2024-11-07", hora: "08:02 AM", tipo: "Entrada", estado: "A tiempo", nfc: "D4:C3:B2:A1" },
    { id: 18, empleado: "Juan Castro", cargo: "Operario", fecha: "2024-11-07", hora: "05:58 AM", tipo: "Entrada", estado: "A tiempo", nfc: "E5:F6:G7:H8" },
    { id: 19, empleado: "Luis Medina", cargo: "Desarrollador", fecha: "2024-11-06", hora: "07:58 AM", tipo: "Entrada", estado: "A tiempo", nfc: "04:3B:5C:22" },
    { id: 20, empleado: "Anurbe Martínez", cargo: "Administrador", fecha: "2024-11-06", hora: "08:50 AM", tipo: "Entrada", estado: "A tiempo", nfc: "A1:B2:C3:D4" },
    { id: 21, empleado: "Andrea Torres", cargo: "Recursos Humanos", fecha: "2024-11-06", hora: "07:55 AM", tipo: "Entrada", estado: "A tiempo", nfc: "D4:C3:B2:A1" },
    { id: 22, empleado: "Juan Castro", cargo: "Operario", fecha: "2024-11-06", hora: "---", tipo: "Entrada", estado: "Ausente", nfc: "E5:F6:G7:H8" },
  ] as RegistroAsistencia[],
};

const DELAY = 800;
const CURRENT_DATE = "2024-11-12"; 

export const api = {
  getEmpleados: (): Promise<Empleado[]> => new Promise(resolve => setTimeout(() => resolve([...db.empleados]), DELAY)),
  getCargos: (): Promise<Cargo[]> => new Promise(resolve => setTimeout(() => resolve([...db.cargos]), DELAY)),
  getHorarios: (): Promise<Horario[]> => new Promise(resolve => setTimeout(() => resolve([...db.horarios]), DELAY)),
  getReportes: (): Promise<RegistroAsistencia[]> => new Promise(resolve => setTimeout(() => resolve([...db.historialAsistencia]), 1500)),
  
  getActividadEnVivo: (): Promise<RegistroAsistencia[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const hoy = db.historialAsistencia.filter(r => r.fecha === CURRENT_DATE && r.estado !== 'Ausente');
        resolve(hoy);
      }, DELAY);
    });
  },

  // Retorna la interfaz estricta ResumenDashboard
  getDashboardResumen: (): Promise<ResumenDashboard> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const registrosHoy = db.historialAsistencia.filter(r => r.fecha === CURRENT_DATE);
        const presentesHoy = registrosHoy.filter(r => r.estado === 'A tiempo').length;
        const tardeHoy = registrosHoy.filter(r => r.estado === 'Tarde').length;
        const ausentesHoy = registrosHoy.filter(r => r.estado === 'Ausente').length;
        const totalEmpleados = db.empleados.length;

        const diasSemana = ["06 Nov", "07 Nov", "08 Nov", "09 Nov", "10 Nov", "11 Nov", "12 Nov"];
        const fechasISO = ["2024-11-06", "2024-11-07", "2024-11-08", "2024-11-09", "2024-11-10", "2024-11-11", "2024-11-12"];
        
        const chartData = fechasISO.map((fecha, index) => {
          const registrosDelDia = db.historialAsistencia.filter(r => r.fecha === fecha);
          return {
            dia: diasSemana[index],
            aTiempo: registrosDelDia.filter(r => r.estado === 'A tiempo').length,
            tarde: registrosDelDia.filter(r => r.estado === 'Tarde').length,
            ausentes: registrosDelDia.filter(r => r.estado === 'Ausente').length,
          };
        });

        resolve({
          stats: { totalEmpleados, presentesHoy, tardeHoy, ausentesHoy },
          chartData
        });
      }, DELAY);
    });
  }
};