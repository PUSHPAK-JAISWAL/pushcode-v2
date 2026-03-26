package com.pushcode.agentic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponse {
    private String language;
    private String explanation;
    private String optimization;
    private String sessionId;
}
