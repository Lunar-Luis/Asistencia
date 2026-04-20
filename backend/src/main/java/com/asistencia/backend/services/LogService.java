import com.asistencia.backend.entities.ConfiguracionSistema;
import com.asistencia.backend.entities.LogActividad;
import com.asistencia.backend.repositories.ConfiguracionRepository;
import com.asistencia.backend.repositories.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// Archivo: LogService.java
@Service
public class LogService {
    @Autowired
    private LogRepository logRepository;
    @Autowired
    private ConfiguracionRepository configRepo;

    public void guardarLog(String usuario, String accion, String detalle) {
        // Solo guardamos si el botón de "Registro de Actividad" está encendido
        ConfiguracionSistema config = configRepo.findById(1L).orElse(null);
        if (config != null && config.isActivityLog()) {
            LogActividad log = new LogActividad();
            log.setUsuario(usuario);
            log.setAccion(accion);
            log.setDetalle(detalle);
            logRepository.save(log);
        }
    }
}