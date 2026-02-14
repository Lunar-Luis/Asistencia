import { useState } from 'react';
import Swal from 'sweetalert2';
import RightTopBar from '../components/RightTopBar';

export default function Empleados() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uidNfc, setUidNfc] = useState('');

  // DATOS SIMULADOS (Relaciones de la Base de Datos)
  // Cuando conectes el backend, estos datos vendrán de un fetch()
  const cargosSimulados = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Recursos Humanos' },
    { id: 3, nombre: 'Operario' },
  ];

  const horariosSimulados = [
    { id: 1, nombre: 'Turno Administrativo (08:00 AM - 05:00 PM)' },
    { id: 2, nombre: 'Turno Operativo Mañana (06:00 AM - 02:00 PM)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isDark = document.documentElement.classList.contains('dark');
    setIsModalOpen(false);
    
    Swal.fire({ 
      icon: 'success', 
      title: '¡Empleado agregado!', 
      text: 'El empleado ha sido vinculado a su cargo y horario exitosamente.',
      confirmButtonColor: '#7380ec', 
      background: isDark ? '#2c2c2c' : '#fff', 
      color: isDark ? '#fff' : '#000' 
    });
  };

  return (
    <>
      <main className="mt-[1.4rem]">
        <h1 className="text-[1.8rem] font-extrabold mb-4">Gestión de Empleados</h1>
        
        {/* Tarjetas de Empleados */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mt-6">
          <div className="relative bg-white dark:bg-dark-white p-4 rounded-[2rem] shadow-custom dark:shadow-custom-dark hover:shadow-none hover:-translate-y-1 transition-all flex flex-col items-center overflow-hidden group">
            <span className="absolute top-3 right-3 bg-success text-white px-3 py-1 rounded-full text-xs font-bold uppercase opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all">Presente</span>
            <img src="/images/ANURBE.jpg" alt="Empleado" className="w-20 h-20 rounded-full object-cover mb-3" />
            <h3 className="font-bold text-[1rem]">Anurbe Martínez</h3>
            <p className="text-[0.85rem] text-dark-variant dark:text-dark-text-variant">Cargo: Administrador</p>
            <p className="text-[0.80rem] text-info-dark dark:text-dark-text-variant mt-1">Horario: Administrativo</p>
            <div className="flex gap-2 mt-3">
              <button className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg font-bold">Detalles</button>
              <button className="bg-warning text-white text-xs px-3 py-1.5 rounded-lg font-bold">Editar</button>
            </div>
          </div>
        </div>

        {/* Botón Agregar */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="mt-6 border-2 border-dashed border-primary text-primary flex items-center justify-center p-4 rounded-[2rem] cursor-pointer hover:bg-light dark:hover:bg-dark-light transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="material-icons-sharp text-[1.6rem]">add</span>
            <h3 className="font-bold text-[1rem]">Agregar Empleado</h3>
          </div>
        </div>
      </main>

      <div className="mt-[1.4rem]">
        <RightTopBar />
      </div>

      {/* Modal Formulario con Relaciones */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex justify-center items-center">
          <div className="bg-white dark:bg-dark-bg p-8 rounded-[1rem] w-full max-w-[500px] relative shadow-custom animate-[fadeIn_0.3s_ease-in-out]">
            <span className="absolute right-4 top-4 text-[1.5rem] cursor-pointer text-dark dark:text-dark-text" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2 className="text-[1.4rem] font-bold mb-4">Agregar Nuevo Empleado</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.9rem] mb-1">Cédula</label>
                  <input type="text" placeholder="Ej: 12345678" required className="w-full p-[0.7rem] border border-light dark:border-dark-light rounded-[0.5rem] bg-transparent outline-none text-dark dark:text-dark-text" />
                </div>
                <div>
                  <label className="block text-[0.9rem] mb-1">Nombre Completo</label>
                  <input type="text" placeholder="Ej: Juan Pérez" required className="w-full p-[0.7rem] border border-light dark:border-dark-light rounded-[0.5rem] bg-transparent outline-none text-dark dark:text-dark-text" />
                </div>
              </div>
              
              {/* Select Relacional: Cargo */}
              <div>
                <label className="block text-[0.9rem] mb-1">Cargo Asignado</label>
                <select required className="w-full p-[0.7rem] border border-light dark:border-dark-light rounded-[0.5rem] bg-transparent outline-none text-dark dark:text-dark-text cursor-pointer">
                  <option value="" className="bg-white dark:bg-dark-bg text-dark dark:text-dark-text">Seleccione un cargo...</option>
                  {cargosSimulados.map(cargo => (
                    <option key={cargo.id} value={cargo.id} className="bg-white dark:bg-dark-bg text-dark dark:text-dark-text">
                      {cargo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Relacional: Horario */}
              <div>
                <label className="block text-[0.9rem] mb-1">Horario Asignado</label>
                <select required className="w-full p-[0.7rem] border border-light dark:border-dark-light rounded-[0.5rem] bg-transparent outline-none text-dark dark:text-dark-text cursor-pointer">
                  <option value="" className="bg-white dark:bg-dark-bg text-dark dark:text-dark-text">Seleccione un horario...</option>
                  {horariosSimulados.map(horario => (
                    <option key={horario.id} value={horario.id} className="bg-white dark:bg-dark-bg text-dark dark:text-dark-text">
                      {horario.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo atado a la ESP32 */}
              <div>
                <label className="block text-[0.9rem] mb-1 text-primary font-bold">UID Tarjeta NFC (Automático)</label>
                <input 
                  type="text" 
                  value={uidNfc} 
                  placeholder="Esperando escaneo ESP32..." 
                  readOnly 
                  className="w-full p-[0.7rem] border border-light dark:border-dark-light rounded-[0.5rem] bg-gray-100 dark:bg-[#202528] text-dark-variant cursor-not-allowed outline-none font-mono" 
                />
              </div>

              <button type="submit" className="mt-4 bg-primary text-white py-[0.7rem] rounded-[0.5rem] hover:bg-primary-variant transition-colors font-bold shadow-custom">
                Guardar Empleado
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}