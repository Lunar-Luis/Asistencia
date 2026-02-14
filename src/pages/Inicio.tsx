import RightTopBar from '../components/RightTopBar';

export default function Inicio() {
  return (
    <>
      <main className="mt-[1.4rem]">
        <h1 className="text-[1.8rem] font-extrabold">Inicio</h1>

        <div className="inline-block bg-light dark:bg-dark-light rounded-[0.4rem] mt-4 px-[1.6rem] py-[0.5rem]">
          <input type="date" className="bg-transparent text-dark dark:text-dark-text outline-none" />
        </div>

        {/* Tarjetas Insights */}
        <div className="grid grid-cols-3 gap-[1.6rem] mt-4">
          
          <div className="bg-white dark:bg-dark-white p-[1.8rem] rounded-[2rem] shadow-custom dark:shadow-custom-dark hover:shadow-none transition-all">
            <span className="material-icons-sharp bg-primary p-2 rounded-full text-white text-[1.4rem]">analytics</span>
            <div className="flex items-center justify-between mt-4">
              <div>
                <h3 className="text-[0.87rem] mt-4 mb-[0.6rem]">Total De Empleados</h3>
                <h1 className="text-[1.8rem] font-extrabold">10</h1>
              </div>
              <div className="relative w-[92px] h-[92px] rounded-full">
                <svg className="w-28 h-28"><circle cx="38" cy="38" r="36" className="fill-none stroke-primary stroke-[14px] stroke-dasharray-[110] stroke-dashoffset-[10] translate-x-[5px] translate-y-[5px] stroke-linecap-round"></circle></svg>
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center"><p>50%</p></div>
              </div>
            </div>
            <small className="text-info-dark dark:text-dark-text-variant block mt-[1.3rem]">Última actualización hace 1 hora</small>
          </div>

          <div className="bg-white dark:bg-dark-white p-[1.8rem] rounded-[2rem] shadow-custom dark:shadow-custom-dark hover:shadow-none transition-all">
            <span className="material-icons-sharp bg-warning p-2 rounded-full text-white text-[1.4rem]">bar_chart</span>
            <div className="flex items-center justify-between mt-4">
              <div>
                <h3 className="text-[0.87rem] mt-4 mb-[0.6rem]">Empleados Presentes</h3>
                <h1 className="text-[1.8rem] font-extrabold">5</h1>
              </div>
              <div className="relative w-[92px] h-[92px] rounded-full">
                <svg className="w-28 h-28"><circle cx="38" cy="38" r="36" className="fill-none stroke-warning stroke-[14px] stroke-dasharray-[110] stroke-dashoffset-[50] translate-x-[5px] translate-y-[5px] stroke-linecap-round"></circle></svg>
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center"><p>25%</p></div>
              </div>
            </div>
            <small className="text-info-dark dark:text-dark-text-variant block mt-[1.3rem]">Última actualización hace 1 hora</small>
          </div>

          <div className="bg-white dark:bg-dark-white p-[1.8rem] rounded-[2rem] shadow-custom dark:shadow-custom-dark hover:shadow-none transition-all">
            <span className="material-icons-sharp bg-success p-2 rounded-full text-white text-[1.4rem]">stacked_line_chart</span>
            <div className="flex items-center justify-between mt-4">
              <div>
                <h3 className="text-[0.87rem] mt-4 mb-[0.6rem]">Empleados Registrados</h3>
                <h1 className="text-[1.8rem] font-extrabold">20</h1>
              </div>
              <div className="relative w-[92px] h-[92px] rounded-full">
                <svg className="w-28 h-28"><circle cx="38" cy="38" r="36" className="fill-none stroke-success stroke-[14px] stroke-dasharray-[110] stroke-dashoffset-[0] translate-x-[5px] translate-y-[5px] stroke-linecap-round"></circle></svg>
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center"><p>100%</p></div>
              </div>
            </div>
            <small className="text-info-dark dark:text-dark-text-variant block mt-[1.3rem]">Última actualización hace 1 hora</small>
          </div>

        </div>

        {/* Entradas Recientes */}
        <div className="mt-[2rem]">
          <h2 className="mb-[0.8rem] text-[1.4rem]">Entradas Recientes</h2>
          <table className="bg-white dark:bg-dark-white w-full rounded-[2rem] p-[1.8rem] text-center shadow-custom dark:shadow-custom-dark hover:shadow-none transition-all">
            <thead>
              <tr><th className="p-4">Cédula</th><th>Empleados</th><th>Entrada</th><th>Salida</th><th></th></tr>
            </thead>
            <tbody>
              <tr className="border-b border-light dark:border-dark-light h-[2.8rem] text-dark-variant dark:text-dark-text-variant">
                <td>123456789</td><td>Sebastián López</td><td>08:00 AM</td><td>05:00 PM</td>
                <td className="text-warning cursor-pointer">Reportar</td><td className="text-primary cursor-pointer pr-4">Detalles</td>
              </tr>
            </tbody>
          </table>
          <a href="#" className="block text-center mx-auto my-[1rem] text-primary">Mostrar Más</a>
        </div>
      </main>

      <div className="mt-[1.4rem]">
        <RightTopBar />
        
        <div className="mt-[1rem]">
          <h2 className="mb-[0.8rem] text-[1.4rem]">Actualizaciones recientes</h2>
          <div className="bg-white dark:bg-dark-white p-[1.8rem] rounded-[2rem] shadow-custom dark:shadow-custom-dark hover:shadow-none transition-all">
            
            <div className="grid grid-cols-[2.6rem_auto] gap-[1rem] mb-[1rem]">
              <div className="w-[2.8rem] h-[2.8rem] rounded-full overflow-hidden">
                <img src="/images/ANURBE.jpg" alt="Foto" />
              </div>
              <div>
                <p className="text-dark-variant dark:text-dark-text-variant"><b className="text-dark dark:text-dark-text">Anurbe</b> Registró su entrada el dia de hoy.</p>
                <small className="text-info-dark dark:text-dark-text-variant">2 minutos atrás</small>
              </div>
            </div>

            <div className="grid grid-cols-[2.6rem_auto] gap-[1rem]">
              <div className="w-[2.8rem] h-[2.8rem] rounded-full overflow-hidden">
                <img src="/images/ANDREA.jpg" alt="Foto" />
              </div>
              <div>
                <p className="text-dark-variant dark:text-dark-text-variant"><b className="text-dark dark:text-dark-text">Andrea</b> Registró su entrada el dia de hoy.</p>
                <small className="text-info-dark dark:text-dark-text-variant">10 minutos atrás</small>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}