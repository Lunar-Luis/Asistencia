import { useState } from 'react';
import Swal from 'sweetalert2';
import RightTopBar from '../components/RightTopBar';

export default function Horarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isDark = document.documentElement.classList.contains('dark');
    setIsModalOpen(false);
    
    Swal.fire({
      icon: 'success',
      title: '¡Horario guardado!',
      text: 'El nuevo horario ha sido registrado en el sistema.',
      background: isDark ? '#2c2c2c' : '#fff',
      color: isDark ? '#fff' : '#000',
      confirmButtonColor: '#7380ec'
    });
  };

  return (
    <>
      <main className="mt-[1.4rem]">
        <h1 className="text-[1.8rem] font-extrabold mb-4">Gestión de Horarios</h1>
        
        <div className="mt-[2rem]">
          <h2 className="mb-[0.8rem] text-[1.4rem]">Horarios Establecidos</h2>
          <div className="bg-white dark:bg-dark-white rounded-[2rem] p-[1.8rem] shadow-custom dark:shadow-custom-dark overflow-hidden">
            <table className="w-full text-center">
              <thead className="border-b border-light dark:border-dark-light">
                <tr>
                  <th className="p-4">Nombre del Turno</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Tolerancia</th>
                  <th>Días Laborables</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-light dark:border-dark-light h-[3.5rem] text-dark-variant dark:text-dark-text-variant hover:bg-light dark:hover:bg-dark-light transition-colors">
                  <td className="font-bold text-dark dark:text-dark-text">Turno Administrativo</td>
                  <td>08:00 AM</td>
                  <td>05:00 PM</td>
                  <td>15 min</td>
                  <td>Lun - Vie</td>
                  <td className="text-primary font-bold cursor-pointer hover:underline">Editar</td>
                </tr>
                <tr className="border-b border-light dark:border-dark-light h-[3.5rem] text-dark-variant dark:text-dark-text-variant hover:bg-light dark:hover:bg-dark-light transition-colors">
                  <td className="font-bold text-dark dark:text-dark-text">Turno Operativo (Mañana)</td>
                  <td>06:00 AM</td>
                  <td>02:00 PM</td>
                  <td>10 min</td>
                  <td>Lun - Sab</td>
                  <td className="text-primary font-bold cursor-pointer hover:underline">Editar</td>
                </tr>
              </tbody>
            </table>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="block mx-auto mt-6 text-primary font-bold text-[1rem] hover:underline"
            >
              Crear Nuevo Horario
            </button>
          </div>
        </div>
      </main>

      {/* Panel Derecho */}
      <div className="mt-[1.4rem]">
        <RightTopBar />
      </div>

      {/* Modal Formulario de Horarios */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex justify-center items-center">
          <div className="bg-white dark:bg-dark-bg p-8 rounded-[1rem] w-full max-w-[500px] relative shadow-custom animate-[fadeIn_0.3s_ease-in-out]">
            <span className="absolute right-4 top-4 text-[1.5rem] cursor-pointer text-dark dark:text-dark-text" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2 className="text-[1.4rem] font-bold mb-4">Configurar Horario</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[0.9rem] mb-1">Nombre del Turno</label>
                <input type="text" placeholder="Ej: Turno Nocturno" required className="w-full p-[0.7rem] border border-light dark:border-dark-light rounded-[0.5rem] bg-transparent outline-none text-dark dark:text-dark-text" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.9rem] mb-1">Hora de Entrada</label>
                  <input type="time" required className="w-full p-[0.7rem] border border-light dark:border-dark-light rounded-[0.5rem] bg-transparent outline-none text-dark dark:text-dark-text" />
                </div>
                <div>
                  <label className="block text-[0.9rem] mb-1">Hora de Salida</label>
                  <input type="time" required className="w-full p-[0.7rem] border border-light dark:border-dark-light rounded-[0.5rem] bg-transparent outline-none text-dark dark:text-dark-text" />
                </div>
              </div>

              <div>
                <label className="block text-[0.9rem] mb-1">Tolerancia de llegada (minutos)</label>
                <input type="number" min="0" placeholder="Ej: 15" required className="w-full p-[0.7rem] border border-light dark:border-dark-light rounded-[0.5rem] bg-transparent outline-none text-dark dark:text-dark-text" />
                <small className="text-info-dark dark:text-dark-text-variant">Tiempo de gracia antes de marcar como "Tarde".</small>
              </div>

              <div>
                <label className="block text-[0.9rem] mb-2">Días Laborables</label>
                <div className="flex flex-wrap gap-3">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(dia => (
                    <label key={dia} className="flex items-center gap-1 text-[0.85rem] cursor-pointer text-dark-variant dark:text-dark-text-variant">
                      <input type="checkbox" className="accent-primary w-4 h-4 cursor-pointer" defaultChecked={dia !== 'Dom'} />
                      {dia}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="mt-2 bg-primary text-white py-[0.7rem] px-[1.2rem] rounded-[0.5rem] hover:bg-primary-variant transition-colors font-bold shadow-custom">
                Guardar Horario
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}