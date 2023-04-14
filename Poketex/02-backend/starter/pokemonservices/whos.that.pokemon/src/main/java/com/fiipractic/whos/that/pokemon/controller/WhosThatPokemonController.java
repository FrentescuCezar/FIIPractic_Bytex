package com.fiipractic.whos.that.pokemon.controller;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fiipractic.whos.that.pokemon.service.WhosThatPokemonService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class WhosThatPokemonController {

    private final WhosThatPokemonService whosThatPokemonService;

    @Autowired
    public WhosThatPokemonController(WhosThatPokemonService whosThatPokemonService) {
        this.whosThatPokemonService = whosThatPokemonService;
    }

    @GetMapping(value = "/")
    public String whosThatPokemon() throws JsonProcessingException {
        String pokemon = whosThatPokemonService.getRandomPokemon();
        return pokemon;
    }

    @PostMapping(value = "/guess", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> guessPokemon(@RequestParam String guess, @RequestParam Integer pokemonIndex) throws JsonProcessingException {
        Map<String, Object> response = new HashMap<>();
        String result = whosThatPokemonService.checkGuess(guess, pokemonIndex);
        response.put("result", result);
        return response;
    }
}
