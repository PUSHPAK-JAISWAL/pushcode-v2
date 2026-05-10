package com.pushcode.agentic.controller;

import com.pushcode.agentic.dto.*;
import com.pushcode.agentic.service.PushCodeAgent;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
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
    public AnalysisResponse processCode(
            @RequestBody CodeAnalysisRequest request,
            HttpServletRequest httpServletRequest
    ) {

        AnalysisResponse analysis = agent.analyze(request.getCode());

        // NORMALIZATION GUARD
        if (analysis.getLanguage() != null) {
            analysis.setLanguage(
                    analysis.getLanguage().toUpperCase().trim()
            );
        }

        if (isInvalidLanguage(analysis.getLanguage())) {
            return analysis;
        }

        try {

            ExecutionRequest execReq = new ExecutionRequest(
                    analysis.getLanguage(),
                    request.getCode()
            );

            // Extract Bearer token
            String authHeader =
                    httpServletRequest.getHeader("Authorization");

            // Forward headers
            HttpHeaders headers = new HttpHeaders();

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                headers.set("Authorization", authHeader);
            }

            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<ExecutionRequest> entity =
                    new HttpEntity<>(execReq, headers);

            ResponseEntity<ExecutionResponse> execResponse =
                    restTemplate.exchange(
                            "http://execution-service/api/execute",
                            HttpMethod.POST,
                            entity,
                            ExecutionResponse.class
                    );

            if (execResponse.getBody() != null) {
                analysis.setSessionId(
                        execResponse.getBody().getSessionId()
                );
            }

        } catch (Exception e) {
            analysis.setExplanation(
                    "Analysis finished, but Execution Service failed: "
                            + e.getMessage()
            );

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