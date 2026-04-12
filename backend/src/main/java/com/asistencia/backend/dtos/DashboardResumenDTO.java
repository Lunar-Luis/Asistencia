package com.asistencia.backend.dtos;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DashboardResumenDTO {
    private long totalEmpleados;
    private long presentesHoy;
    private long tardeHoy;
    private long ausentesHoy;

    // ---> NUEVO: Lista para la gráfica <---
    private List<ChartDataDTO> chartData;
}