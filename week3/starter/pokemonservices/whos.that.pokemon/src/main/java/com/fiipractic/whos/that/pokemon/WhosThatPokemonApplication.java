package com.fiipractic.whos.that.pokemon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
public class WhosThatPokemonApplication {
    public static void main(String[] args) {
        SpringApplication.run(WhosThatPokemonApplication.class, args);
    }
}