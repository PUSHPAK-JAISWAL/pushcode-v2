package com.pushcode.backend.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
public class TimeOutManager {

    @Value("${execution.time-seconds}")
    private int timeout;

    public void applyTimeout(Process process) {

        Executors.newSingleThreadScheduledExecutor()
                .schedule(() -> {
                    if (process.isAlive()) {
                        process.destroyForcibly();
                    }
                },timeout, TimeUnit.SECONDS);
    }

}
