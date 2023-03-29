package com.fiipractic.stablediffusion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {"com.fiipractic.pokemoncatalog.model"})
@EnableJpaRepositories(basePackages = {"com.fiipractic.stablediffusion.repository"})
public class StableDiffusionApplication {
    public static void main(String[] args) {
        SpringApplication.run(StableDiffusionApplication.class, args);
    }
}
