package com.asistencia.backend.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChartDataDTO {
    private String dia;
    private long aTiempo;
    private long tarde;
    private long ausentes;
}