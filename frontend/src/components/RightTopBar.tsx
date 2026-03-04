export default function RightTopBar() {
  return (
    <div className="flex justify-end gap-8 mt-6">
      {/* Botón de menú para dispositivos móviles (opcional) */}
      <button className="md:hidden text-dark dark:text-dark-text bg-transparent">
        <span className="material-icons-sharp text-2xl">menu</span>
      </button>
      

    </div>
  );
}