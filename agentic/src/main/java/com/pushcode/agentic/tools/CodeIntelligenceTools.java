package com.pushcode.agentic.tools;

import dev.langchain4j.agent.tool.Tool;
import org.springframework.stereotype.Component;

@Component
public class CodeIntelligenceTools {

    @Tool("Identifies the programming language. Returns strictly one of: JAVA, PYTHON, C, CPP.")
    public String detectLanguage(String code) {
        if (code.contains("public class") || code.contains("System.out.println")) return "JAVA";
        if (code.contains("def ") || (code.contains("import ") && code.endsWith(".py"))) return "PYTHON";
        if (code.contains("#include <iostream>")) return "CPP";
        if (code.contains("#include <stdio.h>")) return "C";
        return "UNKNOWN";
    }

}
