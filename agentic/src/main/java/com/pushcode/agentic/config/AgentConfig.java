package com.pushcode.agentic.config;

import com.pushcode.agentic.service.PushCodeAgent;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AgentConfig {

    @Value("${langchain4j.open-ai.chat-model.api-key}")
    private String groqApiKey;

    @Value("${langchain4j.open-ai.chat-model.base-url}")
    private String baseUrl;

    @Value("${langchain4j.open-ai.chat-model.model-name}")
    private String modelName;

    @Value("${langchain4j.open-ai.chat-model.temperature}")
    private Double temperature;

    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public ChatModel chatLanguageModel() {
        return OpenAiChatModel.builder()
                .apiKey(groqApiKey)
                .baseUrl(baseUrl)
                .modelName(modelName)
                .temperature(temperature)
                .build();
    }

    @Bean
    public PushCodeAgent pushCodeAgent(ChatModel model, com.pushcode.agentic.tools.CodeIntelligenceTools tools) {
        return AiServices.builder(PushCodeAgent.class)
                .chatModel(model)
                .tools(tools)
                .chatMemory(MessageWindowChatMemory.withMaxMessages(10))
                .build();
    }
}