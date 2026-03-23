package com.pushcode.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExecutionSession {
    private String sessionId;
    private Process process;
}
