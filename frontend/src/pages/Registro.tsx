import { useState, useEffect } from 'react';
import RightTopBar from '../components/RightTopBar';

// Interfaz de los datos que enviará tu ESP32 / Backend
interface EscaneoNFC {
  id: number;
  uid: string;
  empleado: string;
  hora: string;
  tipo: 'Entrada' | 'Salida';
  estado: 'A tiempo' | 'Tarde';
}

export default function Registro() {
  const [lecturas, setLecturas] = useState<EscaneoNFC[]>([]);

  // Aquí en el futuro conectarás un WebSocket o harás un polling a tu base de datos
  // para escuchar lo que manda la ESP32 en tiempo real.
  useEffect(() => {
    const simulacionLecturas: EscaneoNFC[] = [
      { id: 1, uid: "A1:B2:C3:D4", empleado: "Anurbe Martínez", hora: "08:00 AM", tipo: "Entrada", estado: "A tiempo" },
      { id: 2, uid: "F4:E5:D6:C7", empleado: "Andrea Torres", hora: "08:15 AM", tipo: "Entrada", estado: "Tarde" }
    ];
    setLecturas(simulacionLecturas);
  }, []);

  return (
    <>
      <main className="mt-[1.4rem]">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-[1.8rem] font-extrabold">Monitor NFC (En Vivo)</h1>
          <span className="flex items-center gap-2 bg-success text-white px-3 py-1 rounded-full text-xs font-bold shadow-custom">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            ESP32 Conectada
          </span>
        </div>
        <p className="text-dark-variant dark:text-dark-text-variant mb-6">
          Pase la tarjeta por el lector para registrar la asistencia automáticamente.
        </p>

        <table className="bg-white dark:bg-dark-white w-full rounded-[2rem] p-[1.8rem] text-center shadow-custom dark:shadow-custom-dark hover:shadow-none transition-all overflow-hidden">
          <thead className="bg-light dark:bg-dark-light">
            <tr>
              <th className="p-4 text-left">UID Tarjeta</th>
              <th>Empleado</th>
              <th>Hora</th>
              <th>Acción</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {lecturas.map((lectura) => (
              <tr key={lectura.id} className="border-b border-light dark:border-dark-light h-[3.5rem] text-dark-variant dark:text-dark-text-variant hover:bg-light dark:hover:bg-dark-light transition-colors">
                <td className="p-4 font-mono text-left text-primary">{lectura.uid}</td>
                <td className="font-bold text-dark dark:text-dark-text">{lectura.empleado}</td>
                <td>{lectura.hora}</td>
                <td>{lectura.tipo}</td>
                <td className={lectura.estado === 'Tarde' ? 'text-danger font-bold' : 'text-success font-bold'}>
                  {lectura.estado}
                </td>
              </tr>
            ))}
            {lecturas.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-info-dark">Esperando lecturas...</td></tr>
            )}
          </tbody>
        </table>
      </main>

      <div className="mt-[1.4rem]">
        <RightTopBar />
        {/* Panel de alertas rápidas de hardware */}
        <div className="mt-[2rem]">
          <h2 className="mb-[0.8rem] text-[1.4rem]">Estado del Hardware</h2>
          <div className="bg-white dark:bg-dark-white p-[1.8rem] rounded-[2rem] shadow-custom dark:shadow-custom-dark">
            <div className="flex items-center gap-4">
              <span className="material-icons-sharp text-success text-4xl">router</span>
              <div>
                <h3 className="font-bold">Lector Puerta Principal</h3>
                <small className="text-info-dark">Señal: 98% - Latencia: 12ms</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}