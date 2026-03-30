import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Intentamos scroll en el elemento principal del documento
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Si tienes un contenedor principal con scroll (como un main), lo reseteamos también
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}