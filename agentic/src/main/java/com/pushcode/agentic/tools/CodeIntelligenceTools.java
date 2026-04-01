package com.pushcode.agentic.tools;

import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.agent.tool.P;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;

@Component
public class CodeIntelligenceTools {

    private static final List<String> SUPPORTED_LANGUAGES = Arrays.asList("JAVA", "PYTHON", "C", "CPP");

    @Tool("Validates the language and returns the REQUIRED uppercase format (JAVA, PYTHON, C, CPP).")
    public String validateAndFormatLanguage(@P("The language name identified from the code") String identifiedLanguage) {
        if (identifiedLanguage == null) return "UNSUPPORTED";

        String upper = identifiedLanguage.toUpperCase().trim();

        // 1. Direct match check
        if (SUPPORTED_LANGUAGES.contains(upper)) return upper;

        // 2. Specific variation mapping
        if (upper.contains("C++") || upper.equals("CPP")) return "CPP";

        // Use a regex or specific check to ensure "C" isn't part of "C#" or "C++"
        if (upper.equals("C") || upper.equals("C LANGUAGE") || upper.startsWith("C ")) return "C";

        if (upper.contains("JAVA")) return "JAVA";
        if (upper.contains("PYTHON") || upper.equals("PY")) return "PYTHON";

        return "UNSUPPORTED";
    }

    @Tool("Submit the final code analysis results. Use this tool only AFTER calling validateAndFormatLanguage.")
    public void submitAnalysis(
            @P("The standardized language name (e.g., JAVA)") String language,
            @P("A detailed technical explanation of the code logic") String explanation,
            @P("A specific performance optimization with a code example") String optimization
    ) {
        // Landing tool for LLM structured output
    }
}