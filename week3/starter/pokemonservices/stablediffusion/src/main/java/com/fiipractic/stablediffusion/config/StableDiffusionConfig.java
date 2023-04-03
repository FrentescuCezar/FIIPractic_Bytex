package com.fiipractic.stablediffusion.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.fiipractic.stablediffusion.repository")
public class StableDiffusionConfig {
}