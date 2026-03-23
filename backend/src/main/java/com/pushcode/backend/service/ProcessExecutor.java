package com.pushcode.backend.service;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class ProcessExecutor {
    public Process start(List<String> command) throws IOException {
        return new ProcessBuilder(command).start();
    }
}
