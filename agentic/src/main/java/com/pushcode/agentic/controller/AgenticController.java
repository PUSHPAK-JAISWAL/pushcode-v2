package com.pushcode.agentic.controller;

import com.pushcode.agentic.dto.*;
import com.pushcode.agentic.service.PushCodeAgent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/agent")
public class AgenticController {

    private final PushCodeAgent agent;
    private final RestTemplate restTemplate;

    @Autowired
    public AgenticController(PushCodeAgent agent, RestTemplate restTemplate) {
        this.agent = agent;
        this.restTemplate = restTemplate;
    }

    @PostMapping("/process")
    public AnalysisResponse processCode(@RequestBody CodeAnalysisRequest request) {
        AnalysisResponse analysis = agent.analyze(request.getCode());

        // NORMALIZATION GUARD: Ensure language is uppercase for Execution Service Enums
        if (analysis.getLanguage() != null) {
            analysis.setLanguage(analysis.getLanguage().toUpperCase().trim());
        }

        if (isInvalidLanguage(analysis.getLanguage())) {
            return analysis;
        }

        try {
            ExecutionRequest execReq = new ExecutionRequest(
                    analysis.getLanguage(),
                    request.getCode()
            );

            ResponseEntity<ExecutionResponse> execResponse = restTemplate.postForEntity(
                    "http://execution-service/api/execute",
                    execReq,
                    ExecutionResponse.class
            );

            if (execResponse.getBody() != null) {
                analysis.setSessionId(execResponse.getBody().getSessionId());
            }

        } catch (Exception e) {
            analysis.setExplanation("Analysis finished, but Execution Service failed: " + e.getMessage());
            analysis.setLanguage("ERROR");
        }

        return analysis;
    }

    private boolean isInvalidLanguage(String lang) {
        return lang == null ||
                "UNKNOWN".equalsIgnoreCase(lang) ||
                "UNSUPPORTED".equalsIgnoreCase(lang) ||
                "ERROR".equalsIgnoreCase(lang);
    }
}