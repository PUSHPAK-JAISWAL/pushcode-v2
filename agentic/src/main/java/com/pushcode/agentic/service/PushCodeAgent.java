package com.pushcode.agentic.service;

import com.pushcode.agentic.dto.AnalysisResponse;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

public interface PushCodeAgent {

    @SystemMessage("""
        You are an expert AI Agent for the PushCode IDE.
        Follow these steps:
        1. Use the 'detectLanguage' tool to find the language of the code.
        2. If the tool returns 'UNKNOWN', explain that the language is not supported.
        3. Provide a concise explanation of the code's logic.
        4. Suggest one specific performance optimization.
        
        You MUST return a valid JSON object matching the AnalysisResponse structure.
        """)
    AnalysisResponse analyze(@UserMessage String code);
}