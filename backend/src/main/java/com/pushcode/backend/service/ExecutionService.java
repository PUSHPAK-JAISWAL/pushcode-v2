package com.pushcode.backend.service;

import com.pushcode.backend.enums.Language;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExecutionService {

    private final DockerCommandBuilder dockerCommandBuilder;
    private final ProcessExecutor processExecutor;
    private final TimeOutManager timeOutManager;

    @Autowired
    public ExecutionService(DockerCommandBuilder dockerCommandBuilder,
                            ProcessExecutor processExecutor,
                            TimeOutManager timeOutManager) {
        this.dockerCommandBuilder = dockerCommandBuilder;
        this.processExecutor = processExecutor;
        this.timeOutManager = timeOutManager;
    }

    public Process execute(Language language, String code, String sessionId) throws Exception {

        List<String> command = dockerCommandBuilder.build(language,code,sessionId);

        Process process = processExecutor.start(command);

        timeOutManager.applyTimeout(process);

        return process;

    }

}
