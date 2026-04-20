package com.asistencia.backend.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException; // <--- NUEVO IMPORT
import org.springframework.validation.FieldError; // <--- NUEVO IMPORT
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors; // <--- NUEVO IMPORT

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }

    // ---> NUEVO: MANEJADOR DE ERRORES DE VALIDACIÓN <---
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // Extrae todos los errores (ej: "El nombre es obligatorio", "Correo inválido") y los une con una coma.
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", errorMessage));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Ocurrió un error interno en el servidor. Contacte al administrador."));
    }

    // ---> NUEVO: MANEJADOR DE DATOS REPETIDOS (Cédula, Correo, NFC) <---
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(org.springframework.dao.DataIntegrityViolationException ex) {
        // En lugar de una traza gigante de SQL, enviamos un error amigable
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Error al guardar. La Cédula, el Correo o la Tarjeta NFC ya están registrados en otro empleado."));
    }
}