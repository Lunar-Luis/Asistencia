import { useState, useEffect } from 'react';

export default function RightTopBar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="flex justify-end gap-8 mt-6">
      <button className="hidden text-dark dark:text-dark-text bg-transparent">
        <span className="material-icons-sharp text-2xl">menu</span>
      </button>
      
      <div 
        className="flex justify-between items-center h-[1.6rem] w-[4.2rem] cursor-pointer rounded-[0.4rem] bg-light dark:bg-dark-light"
        onClick={() => setIsDark(!isDark)}
      >
        <span className={`material-icons-sharp w-1/2 h-full flex items-center justify-center text-[1.2rem] ${!isDark ? 'bg-primary text-white rounded-[0.4rem]' : ''}`}>light_mode</span>
        <span className={`material-icons-sharp w-1/2 h-full flex items-center justify-center text-[1.2rem] ${isDark ? 'bg-primary text-white rounded-[0.4rem]' : ''}`}>dark_mode</span>
      </div>
      
      <div className="flex gap-8 text-right">
        <div className="info">
          <p>Hola, <b>CMBT</b></p>
          <small className="text-info-dark dark:text-dark-text-variant">Admin</small>
        </div>
        <div className="w-[2.8rem] h-[2.8rem] rounded-full overflow-hidden">
          <img src="/images/logo.png" alt="Perfil" className="w-full object-cover" />
        </div>
      </div>
    </div>
  );
}