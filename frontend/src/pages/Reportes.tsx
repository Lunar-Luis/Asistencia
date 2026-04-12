import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import {
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Activity,
  Briefcase,
  FileText,
  Search,
  FileSpreadsheet,
  FileType,
  FileSearch,
  User,
} from "lucide-react";

// IMPORTAMOS LA API REAL Y SUS TIPOS
import * as api from "../services/api";
import type { Asistencia, Empleado, Cargo } from "../services/api";

const animProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4 },
};
const cardStyle =
  "bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8 transition-colors";
const inputStyle =
  "w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none text-[13px] font-bold text-slate-700 dark:text-white border border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer";
const disabledInputStyle =
  "bg-slate-200/50 dark:bg-slate-800/50 cursor-not-allowed text-slate-400 dark:text-white/40";
const optionClassName =
  "bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold py-2";

const SkeletonReportes = () => (
  <div className="space-y-8 animate-pulse w-full">
    <div className={cardStyle}>
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
        <div className="space-y-2">
          <div className="w-56 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="w-40 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"
          ></div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"
          ></div>
        ))}
      </div>
    </div>
    <div
      className={`${cardStyle} flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-slate-200 dark:border-slate-800`}
    >
      <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full mb-6"></div>
      <div className="w-56 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-3"></div>
      <div className="w-72 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
    </div>
  </div>
);

const SkeletonResultados = () => (
  <motion.div {...animProps} className="space-y-6 animate-pulse w-full">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`${cardStyle} !p-6 flex items-center justify-between`}
        >
          <div className="space-y-3">
            <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="w-12 h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
        </div>
      ))}
    </div>
    <div className={cardStyle}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="space-y-3">
          <div className="w-56 h-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="w-72 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
        <div className="flex gap-3">
          <div className="w-28 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="w-28 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="w-full h-10 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-full h-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
          ></div>
        ))}
      </div>
    </div>
  </motion.div>
);

// Funciones Helper
const formatearHora = (fechaString: string | null) => {
  if (!fechaString) return "---";
  const fecha = new Date(fechaString);
  return fecha.toLocaleTimeString("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatearEstado = (estado: string) => {
  if (estado === "A_TIEMPO") return "A tiempo";
  if (estado === "TARDE") return "Tarde";
  if (estado === "AUSENTE") return "Ausente";
  return estado;
};

// ---> NUEVA FUNCIÓN: Convierte minutos totales (ej: 135) a texto (ej: "2h 15m") <---
const formatearMinutosAHoras = (minutosTotales: number | null | undefined) => {
  if (minutosTotales === null || minutosTotales === undefined) return "---";
  const horas = Math.floor(minutosTotales / 60);
  const minutosRestantes = minutosTotales % 60;
  return `${horas}h ${minutosRestantes.toString().padStart(2, "0")}m`;
};

export default function Reportes() {
  const [isLoading, setIsLoading] = useState(true);

  const [listaEmpleados, setListaEmpleados] = useState<Empleado[]>([]);
  const [listaCargos, setListaCargos] = useState<Cargo[]>([]);

  const [tipoReporte, setTipoReporte] = useState("diario");
  // Función para obtener "YYYY-MM-DD" en la zona horaria LOCAL del usuario
  const obtenerFechaLocal = () => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0");
    const day = String(hoy.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const HOY = obtenerFechaLocal();
  const [fechaDesde, setFechaDesde] = useState(HOY);
  const [fechaHasta, setFechaHasta] = useState(HOY);
  const [empleadoFiltro, setEmpleadoFiltro] = useState("all");
  const [cargoFiltro, setCargoFiltro] = useState("all");
  const [estadoFiltro, setEstadoFiltro] = useState("all");

  const [isGenerating, setIsGenerating] = useState(false);
  const [reporteGenerado, setReporteGenerado] = useState(false);
  const [datosReporte, setDatosReporte] = useState<Asistencia[]>([]);

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [emps, cars] = await Promise.all([
          api.getEmpleados(),
          api.getCargos(),
        ]);
        setListaEmpleados(emps);
        setListaCargos(cars);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSelectData();
  }, []);

  const handleTipoReporteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoTipo = e.target.value;
    setTipoReporte(nuevoTipo);

    const baseDate = new Date();

    if (nuevoTipo === 'diario') {
      setFechaDesde(HOY);
      setFechaHasta(HOY);
    } else if (nuevoTipo === 'semanal') {
      const past = new Date(baseDate); past.setDate(past.getDate() - 7);
      // Extraemos localmente
      const y = past.getFullYear();
      const m = String(past.getMonth() + 1).padStart(2, '0');
      const d = String(past.getDate()).padStart(2, '0');
      setFechaDesde(`${y}-${m}-${d}`);
      setFechaHasta(HOY);
    } else if (nuevoTipo === 'mensual') {
      const past = new Date(baseDate); past.setDate(past.getDate() - 30);
      // Extraemos localmente
      const y = past.getFullYear();
      const m = String(past.getMonth() + 1).padStart(2, '0');
      const d = String(past.getDate()).padStart(2, '0');
      setFechaDesde(`${y}-${m}-${d}`);
      setFechaHasta(HOY);
    }
  };

  const handleGenerarReporte = async () => {
    setIsGenerating(true);
    setReporteGenerado(false);

    try {
      // 1. Pedimos TODO el historial a Spring Boot
      const todoElHistorial = await api.getAsistencias();

      // 2. Aplicamos el filtrado localmente
      // ---> AÑADIMOS EL TIPO AQUÍ: (item: Asistencia) <---
      const datosFiltrados = todoElHistorial.filter((item: Asistencia) => {
        const itemDate = new Date(item.fechaRegistro).getTime();
        const desdeDate = new Date(fechaDesde).getTime();
        const hastaDate = new Date(fechaHasta).getTime();
        const matchFecha = itemDate >= desdeDate && itemDate <= hastaDate;

        const matchEmpleado =
          empleadoFiltro === "all"
            ? true
            : item.empleado.id.toString() === empleadoFiltro;
        const matchCargo =
          cargoFiltro === "all"
            ? true
            : item.empleado.cargo?.nombre === cargoFiltro;

        let matchEstado = true;
        if (estadoFiltro === "ontime")
          matchEstado = item.estadoEntrada === "A_TIEMPO";
        else if (estadoFiltro === "late")
          matchEstado = item.estadoEntrada === "TARDE";
        else if (estadoFiltro === "absent")
          matchEstado = item.estadoEntrada === "AUSENTE";

        return matchFecha && matchEmpleado && matchCargo && matchEstado;
      });

      // Ordenamos para que los más recientes salgan arriba
      // ---> AÑADIMOS EL TIPO AQUÍ: (a: Asistencia, b: Asistencia) <---
      datosFiltrados.sort(
        (a: Asistencia, b: Asistencia) =>
          new Date(b.marcaEntrada).getTime() -
          new Date(a.marcaEntrada).getTime(),
      );

      setDatosReporte(datosFiltrados);
      setReporteGenerado(true);
    } catch (error) {
      console.error("Error generando el reporte", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const isDateDisabled = tipoReporte !== "personalizado";

  const statsCalculados = useMemo(() => {
    return {
      aTiempo: datosReporte.filter((r) => r.estadoEntrada === "A_TIEMPO")
        .length,
      tarde: datosReporte.filter((r) => r.estadoEntrada === "TARDE").length,
      ausente: datosReporte.filter((r) => r.estadoEntrada === "AUSENTE").length,
      total: datosReporte.length,
    };
  }, [datosReporte]);

  return (
    <main className="pb-8 max-w-[1600px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="pt-2">
          <h1 className="text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-black tracking-tighter uppercase italic leading-[1.1] flex flex-wrap items-center gap-x-2">
            <span className="text-slate-800 dark:text-white">Generar</span>
            <span className="bg-gradient-to-r from-primary via-indigo-900 to-primary dark:via-white bg-[length:200%_auto] bg-clip-text text-transparent inline-block not-italic py-1 px-2">
              Reportes
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2">
            Análisis avanzado y exportación de datos
          </p>
        </div>
      </motion.div>

      {isLoading ? (
        <SkeletonReportes />
      ) : (
        <>
          <motion.div {...animProps} className={`${cardStyle} mb-8`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <FileSearch className="text-primary" size={28} />
                <div>
                  <h2 className="font-black uppercase italic tracking-tighter dark:text-white text-2xl text-slate-800">
                    Configuración del Reporte
                  </h2>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                    Selecciona los parámetros deseados
                  </p>
                </div>
              </div>
              <button
                onClick={handleGenerarReporte}
                disabled={isGenerating}
                className={`w-full sm:w-auto bg-primary hover:bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold uppercase text-[12px] tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all ${isGenerating ? "opacity-70 cursor-wait" : ""}`}
              >
                {isGenerating ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{" "}
                    Consultando...
                  </>
                ) : (
                  <>
                    <FileText size={18} /> Generar Reporte
                  </>
                )}
              </button>
            </div>

            {/* FILTROS FECHA Y TIPO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              <div className="relative">
                <label className="text-[10px] font-black uppercase text-primary mb-2 block ml-2">
                  Tipo de Reporte
                </label>
                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />
                  <select
                    className={inputStyle}
                    value={tipoReporte}
                    onChange={handleTipoReporteChange}
                  >
                    <option value="diario" className={optionClassName}>
                      Diario (Hoy)
                    </option>
                    <option value="semanal" className={optionClassName}>
                      Últimos 7 Días
                    </option>
                    <option value="mensual" className={optionClassName}>
                      Últimos 30 Días
                    </option>
                    <option value="personalizado" className={optionClassName}>
                      Personalizado
                    </option>
                  </select>
                </div>
              </div>
              <div className="relative">
                <label className="text-[10px] font-black uppercase text-primary mb-2 block ml-2">
                  {tipoReporte === "diario" ? "Fecha" : "Fecha Desde"}
                </label>
                <div className="relative">
                  <CalendarDays
                    size={18}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDateDisabled ? "text-slate-300 dark:text-slate-700" : "text-slate-400 dark:text-slate-500"}`}
                  />
                  <input
                    type="date"
                    disabled={isDateDisabled}
                    className={`${inputStyle} ${isDateDisabled ? disabledInputStyle : ""}`}
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                  />
                </div>
              </div>
              {tipoReporte !== "diario" ? (
                <div className="relative">
                  <label className="text-[10px] font-black uppercase text-primary mb-2 block ml-2">
                    Fecha Hasta
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDateDisabled ? "text-slate-300 dark:text-slate-700" : "text-slate-400 dark:text-slate-500"}`}
                    />
                    <input
                      type="date"
                      disabled={isDateDisabled}
                      className={`${inputStyle} ${isDateDisabled ? disabledInputStyle : ""}`}
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="hidden md:block"></div>
              )}
              <div className="relative">
                <label className="text-[10px] font-black uppercase text-primary mb-2 block ml-2">
                  Estado de Asistencia
                </label>
                <div className="relative">
                  <Activity
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />
                  <select
                    className={inputStyle}
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                  >
                    <option value="all" className={optionClassName}>
                      Todos los estados
                    </option>
                    <option value="ontime" className={optionClassName}>
                      A tiempo
                    </option>
                    <option value="late" className={optionClassName}>
                      Tarde
                    </option>
                    <option value="absent" className={optionClassName}>
                      Ausente
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* FILTROS EMPLEADO Y CARGO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-[10px] font-black uppercase text-primary mb-2 block ml-2">
                  Empleado
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />
                  <select
                    className={inputStyle}
                    value={empleadoFiltro}
                    onChange={(e) => setEmpleadoFiltro(e.target.value)}
                  >
                    <option value="all" className={optionClassName}>
                      Todos los empleados
                    </option>
                    {listaEmpleados.map((emp) => (
                      <option
                        key={emp.id}
                        value={emp.id}
                        className={optionClassName}
                      >
                        {emp.nombre} {emp.apellido}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="relative">
                <label className="text-[10px] font-black uppercase text-primary mb-2 block ml-2">
                  Cargo / Departamento
                </label>
                <div className="relative">
                  <Briefcase
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />
                  <select
                    className={inputStyle}
                    value={cargoFiltro}
                    onChange={(e) => setCargoFiltro(e.target.value)}
                  >
                    <option value="all" className={optionClassName}>
                      Todos los cargos
                    </option>
                    {listaCargos.map((cargo) => (
                      <option
                        key={cargo.id}
                        value={cargo.nombre}
                        className={optionClassName}
                      >
                        {cargo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {!reporteGenerado && !isGenerating && (
              <motion.div
                key="waiting"
                {...animProps}
                className={`${cardStyle} !p-12 text-center flex flex-col items-center justify-center min-h-[350px] border-2 border-dashed border-slate-200 dark:border-slate-800`}
              >
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 flex items-center justify-center rounded-full mb-6 border border-slate-100 dark:border-slate-700">
                  <Search
                    size={40}
                    className="text-slate-300 dark:text-slate-600"
                  />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight mb-2">
                  Listo para Consultar
                </h3>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest max-w-md mx-auto">
                  Ajusta los filtros y genera el reporte para visualizar y
                  exportar los datos.
                </p>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SkeletonResultados />
              </motion.div>
            )}

            {reporteGenerado && !isGenerating && (
              <motion.div key="results" {...animProps} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: "A Tiempo",
                      value: statsCalculados.aTiempo,
                      icon: <CheckCircle2 size={28} />,
                      color: "text-emerald-600 dark:text-success",
                      bg: "bg-emerald-50 dark:bg-success/10",
                    },
                    {
                      title: "Tarde",
                      value: statsCalculados.tarde,
                      icon: <AlertCircle size={28} />,
                      color: "text-amber-600 dark:text-warning",
                      bg: "bg-amber-50 dark:bg-warning/10",
                    },
                    {
                      title: "Ausentes",
                      value: statsCalculados.ausente,
                      icon: <XCircle size={28} />,
                      color: "text-red-500 dark:text-danger",
                      bg: "bg-red-50 dark:bg-danger/10",
                    },
                    {
                      title: "Total Registros",
                      value: statsCalculados.total,
                      icon: <Activity size={28} />,
                      color: "text-primary",
                      bg: "bg-primary/10",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`${cardStyle} !p-6 flex items-center justify-between`}
                    >
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1.5">
                          {stat.title}
                        </p>
                        <h3 className="text-4xl font-black text-slate-800 dark:text-white leading-none">
                          {stat.value}
                        </h3>
                      </div>
                      <div
                        className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}
                      >
                        {stat.icon}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={cardStyle}>
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div>
                      <h2 className="font-black uppercase italic tracking-tighter dark:text-white text-2xl text-slate-800">
                        Datos de Asistencia
                      </h2>
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                        Resultados desde {fechaDesde}{" "}
                        {tipoReporte !== "diario" && `hasta ${fechaHasta}`}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                      <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-50 dark:bg-danger/10 text-red-500 dark:text-danger hover:bg-red-500 hover:text-white transition-all rounded-xl font-bold uppercase text-[11px] tracking-widest border border-transparent hover:border-red-200">
                        <FileType size={18} /> PDF
                      </button>
                      <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-50 dark:bg-success/10 text-emerald-600 dark:text-success hover:bg-emerald-600 hover:text-white transition-all rounded-xl font-bold uppercase text-[11px] tracking-widest border border-transparent hover:border-emerald-200">
                        <FileSpreadsheet size={18} /> Excel
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {datosReporte.length > 0 ? (
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                          <tr>
                            <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 rounded-l-xl">
                              Empleado
                            </th>
                            <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                              Fecha
                            </th>
                            <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                              Entrada
                            </th>
                            <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                              Salida
                            </th>
                            <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center">
                              Horas Total
                            </th>
                            <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right rounded-r-xl">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                          {datosReporte.map((row) => (
                            <tr
                              key={row.id}
                              className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group"
                            >
                              <td className="p-4">
                                <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                  {row.empleado.nombre} {row.empleado.apellido}
                                </p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                                  {row.empleado.cargo?.nombre || "Sin Cargo"}
                                </p>
                              </td>
                              <td className="p-4">
                                <p className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                                  {row.fechaRegistro}
                                </p>
                              </td>
                              <td className="p-4">
                                <span className="text-[12px] font-bold text-slate-600 dark:text-white/60 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-md">
                                  {formatearHora(row.marcaEntrada)}
                                </span>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`text-[12px] font-bold px-3 py-1.5 rounded-md ${row.marcaSalida ? "text-slate-600 dark:text-white/60 bg-slate-50 dark:bg-slate-800" : "text-slate-400 bg-transparent"}`}
                                >
                                  {row.marcaSalida
                                    ? formatearHora(row.marcaSalida)
                                    : "---"}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                {/* ---> AQUÍ LLAMAMOS A LA NUEVA FUNCIÓN <--- */}
                                <span
                                  className={`text-[13px] font-black ${row.horasTrabajadas ? "text-primary" : "text-slate-400"}`}
                                >
                                  {formatearMinutosAHoras(row.horasTrabajadas)}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <span
                                  className={`inline-flex items-center justify-center gap-1 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider ${row.estadoEntrada === "A_TIEMPO" ? "text-emerald-600 bg-emerald-50 dark:text-success dark:bg-success/10" : row.estadoEntrada === "TARDE" ? "text-amber-600 bg-amber-50 dark:text-warning dark:bg-warning/10" : "text-red-500 bg-red-50 dark:text-danger dark:bg-danger/10"}`}
                                >
                                  {formatearEstado(row.estadoEntrada)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                        <Search size={40} className="mx-auto mb-4 opacity-50" />
                        <p className="text-sm font-bold uppercase tracking-widest">
                          No se encontraron resultados
                        </p>
                        <p className="text-[11px] font-medium mt-1">
                          El rango de fechas o los filtros no coinciden con
                          ningún registro.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </main>
  );
}
