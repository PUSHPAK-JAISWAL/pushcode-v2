package com.pushcode.agentic.advice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.RestClientException;



@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RestClientException.class)
    public ResponseEntity<Map<String, String>> handleExecutionServiceError(RestClientException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("status", "ERROR");
        error.put("message", "Execution Service is currently unavailable. AI analysis was successful, but code cannot be run.");
        error.put("details", ex.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleGeneralError(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("status", "INTERNAL_ERROR");
        error.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
