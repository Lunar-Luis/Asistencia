import { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import RightTopBar from '../components/RightTopBar';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Reportes() {
  const [filtroFecha, setFiltroFecha] = useState('');

  // Configuración del gráfico de torta basado en tu diseño original
  const chartData = {
    labels: ['Presente', 'Ausente', 'Vacaciones'],
    datasets: [{
      data: [7, 3, 2],
      backgroundColor: ['#41f1b6', '#ff4d4f', '#ffbb55'],
      borderWidth: 0,
    }],
  };

  return (
    <>
      <main className="mt-[1.4rem]">
        <h1 className="text-[1.8rem] font-extrabold mb-4">Reportes y Análisis</h1>

        {/* Tarjetas de Estadísticas (Insights) */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <div className="bg-white dark:bg-dark-white p-6 rounded-[1rem] shadow-custom dark:shadow-custom-dark text-center hover:-translate-y-1 transition-transform">
            <h3 className="mb-2 text-[0.87rem]">Empleados Presentes</h3>
            <h1 className="text-[1.8rem] font-bold text-success">7</h1>
          </div>
          <div className="bg-white dark:bg-dark-white p-6 rounded-[1rem] shadow-custom dark:shadow-custom-dark text-center hover:-translate-y-1 transition-transform">
            <h3 className="mb-2 text-[0.87rem]">Empleados Ausentes</h3>
            <h1 className="text-[1.8rem] font-bold text-danger">3</h1>
          </div>
          <div className="bg-white dark:bg-dark-white p-6 rounded-[1rem] shadow-custom dark:shadow-custom-dark text-center hover:-translate-y-1 transition-transform">
            <h3 className="mb-2 text-[0.87rem]">Total Horas Trabajadas</h3>
            <h1 className="text-[1.8rem] font-bold text-primary">320</h1>
          </div>
        </div>

        {/* Sección de Gráfica y Filtros */}
        <div className="mt-[2rem] bg-white dark:bg-dark-white p-[1.8rem] rounded-[2rem] shadow-custom dark:shadow-custom-dark">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[1.2rem] font-bold">Visualización de Datos</h2>
            <div className="flex gap-2">
              <button className="bg-primary text-white flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm">
                <span className="material-icons-sharp text-base">pie_chart</span> Torta
              </button>
            </div>
          </div>
          <div className="max-w-[300px] mx-auto">
            <Pie data={chartData} />
          </div>
        </div>

        {/* Tabla Detallada */}
        <div className="mt-[2rem]">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-[1.4rem]">Asistencia Detallada</h2>
            <div className="flex gap-4">
              <label className="text-sm">Fecha: <input type="date" className="border border-light rounded px-2 py-1 bg-transparent" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} /></label>
            </div>
          </div>
          
          <table className="bg-white dark:bg-dark-white w-full rounded-[1rem] text-center shadow-custom dark:shadow-custom-dark overflow-hidden">
            <thead className="bg-light dark:bg-dark-light">
              <tr><th className="p-3">Empleado</th><th>Fecha</th><th>Estado</th><th>Entrada</th><th>Salida</th></tr>
            </thead>
            <tbody>
              <tr className="border-b border-light dark:border-dark-light h-10 text-dark-variant">
                <td>Anurbe Martínez</td><td>31/08/2025</td><td className="text-success font-bold">Presente</td><td>08:00</td><td>16:00</td>
              </tr>
              <tr className="border-b border-light dark:border-dark-light h-10 text-dark-variant">
                <td>Trino Pérez</td><td>31/08/2025</td><td className="text-danger font-bold">Ausente</td><td>-</td><td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      {/* Panel Derecho */}
      <div className="mt-[1.4rem]">
        <RightTopBar />
        
        <div className="mt-[2rem] flex flex-col gap-4">
          <div className="bg-white dark:bg-dark-white p-5 rounded-[1rem] shadow-custom dark:shadow-custom-dark">
            <h4 className="font-bold mb-2">Exportar Reporte</h4>
            <div className="text-sm text-dark-variant mb-4">
              <p>Registros filtrados: <b className="text-primary">2</b></p>
            </div>
            <div className="flex gap-2">
              <button className="bg-danger text-white flex-1 py-2 rounded-lg flex justify-center items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="material-icons-sharp text-sm">picture_as_pdf</span> PDF
              </button>
              <button className="bg-success text-white flex-1 py-2 rounded-lg flex justify-center items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="material-icons-sharp text-sm">grid_on</span> Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}