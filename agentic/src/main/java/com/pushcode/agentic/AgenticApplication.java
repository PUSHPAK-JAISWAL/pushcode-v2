package com.pushcode.agentic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AgenticApplication {

	public static void main(String[] args) {
		SpringApplication.run(AgenticApplication.class, args);
	}

}
