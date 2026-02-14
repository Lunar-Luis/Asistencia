import { useState } from 'react';
import Swal from 'sweetalert2';
import RightTopBar from '../components/RightTopBar';

export default function Cargos() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isDark = document.documentElement.classList.contains('dark');
    setIsModalOpen(false);
    
    Swal.fire({
      icon: 'success',
      title: '¡Cargo agregado!',
      background: isDark ? '#2c2c2c' : '#fff',
      color: isDark ? '#fff' : '#000',
      confirmButtonColor: '#7380ec'
    });
  };

  return (
    <>
      <main className="mt-[1.4rem]">
        <h1 className="text-[1.8rem] font-extrabold mb-4">Gestión de Cargos</h1>
        
        <div className="mt-[2rem]">
          <h2 className="mb-[0.8rem] text-[1.4rem]">Lista de Cargos</h2>
          <div className="bg-white dark:bg-dark-white rounded-[2rem] p-[1.8rem] shadow-custom dark:shadow-custom-dark overflow-hidden">
            <table className="w-full text-center">
              <thead className="border-b border-light dark:border-dark-light">
                <tr>
                  <th className="p-4">ID</th>
                  <th>Cargo</th>
                  <th>Descripción</th>
                  <th>Empleados Asignados</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-light dark:border-dark-light h-[3.5rem] text-dark-variant dark:text-dark-text-variant hover:bg-light dark:hover:bg-dark-light transition-colors">
                  <td>01</td>
                  <td className="font-bold text-dark dark:text-dark-text">Administrador</td>
                  <td>Gestión completa del sistema</td>
                  <td>2</td>
                  <td className="text-primary font-bold cursor-pointer hover:underline">Editar</td>
                </tr>
                <tr className="border-b border-light dark:border-dark-light h-[3.5rem] text-dark-variant dark:text-dark-text-variant hover:bg-light dark:hover:bg-dark-light transition-colors">
                  <td>02</td>
                  <td className="font-bold text-dark dark:text-dark-text">Recursos Humanos</td>
                  <td>Manejo de empleados y asistencia</td>
                  <td>3</td>
                  <td className="text-primary font-bold cursor-pointer hover:underline">Editar</td>
                </tr>
                <tr className="border-b border-light dark:border-dark-light h-[3.5rem] text-dark-variant dark:text-dark-text-variant hover:bg-light dark:hover:bg-dark-light transition-colors">
                  <td>03</td>
                  <td className="font-bold text-dark dark:text-dark-text">Operario</td>
                  <td>Control de producción y tareas</td>
                  <td>5</td>
                  <td className="text-primary font-bold cursor-pointer hover:underline">Editar</td>
                </tr>
              </tbody>
            </table>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="block mx-auto mt-6 text-primary font-bold text-[1rem] hover:underline"
            >
              Agregar Cargo
            </button>
          </div>
        </div>
      </main>

      {/* Panel Derecho (Limpio, solo el TopBar) */}
      <div className="mt-[1.4rem]">
        <RightTopBar />
      </div>

      {/* Modal Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex justify-center items-center">
          <div className="bg-white dark:bg-dark-bg p-8 rounded-[1rem] w-full max-w-[500px] relative shadow-custom animate-[fadeIn_0.3s_ease-in-out]">
            <span className="absolute right-4 top-4 text-[1.5rem] cursor-pointer text-dark dark:text-dark-text" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2 className="text-[1.4rem] font-bold mb-4">Agregar Nuevo Cargo</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-[0.9rem] mb-1">Nombre del Cargo</label>
                <input type="text" placeholder="Ej: Supervisor" required className="w-full p-[0.7rem] border border-light dark:border-dark-light rounded-[0.5rem] bg-transparent outline-none" />
              </div>
              
              <div>
                <label className="block text-[0.9rem] mb-1">Descripción</label>
                <textarea rows={3} placeholder="Describe el cargo..." required className="w-full p-[0.7rem] border border-light dark:border-dark-light rounded-[0.5rem] bg-transparent outline-none resize-y max-h-[200px]"></textarea>
              </div>

              <div>
                <label className="block text-[0.9rem] mb-1">Número de empleados asignados</label>
                <input type="number" min="0" placeholder="Ej: 4" className="w-full p-[0.7rem] border border-light dark:border-dark-light rounded-[0.5rem] bg-transparent outline-none" />
              </div>

              <button type="submit" className="mt-4 bg-primary text-white py-[0.7rem] px-[1.2rem] rounded-[0.5rem] hover:bg-primary-variant transition-colors font-bold">
                Guardar Cargo
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}