package com.fiipractic.whos.that.pokemon.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fiipractic.whos.that.pokemon.service.WhosThatPokemonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@JsonFormat
@CrossOrigin(origins = "http://localhost:3000")
public class WhosThatPokemonController {


    private final WhosThatPokemonService whosThatPokemonService;
    private final ObjectMapper objectMapper;

    @Autowired
    public WhosThatPokemonController(WhosThatPokemonService whosThatPokemonService) {
        this.whosThatPokemonService = whosThatPokemonService;
        this.objectMapper = new ObjectMapper();
    }

    @GetMapping(value = "/")
    public String whosThatPokemon() throws JsonProcessingException {
        String pokemon = whosThatPokemonService.getRandomPokemon();
        return pokemon;
    }

    @PostMapping(value = "/guess", produces = MediaType.APPLICATION_JSON_VALUE)
    public String guessPokemon(@RequestParam String guess, @RequestParam Integer pokemonIndex) throws JsonProcessingException {
        String pokemon = whosThatPokemonService.getPokemonById(pokemonIndex);
        JsonNode pokemonNode = objectMapper.readTree(pokemon);

        String result;
        String[] promptArray = pokemonNode.get("prompt").asText().split(" ");

        boolean isGuessCorrect = false;

        if (guess.equalsIgnoreCase(pokemonNode.get("name").asText()))
            isGuessCorrect = true;

        for (String promptWord : promptArray)
            if (guess.equalsIgnoreCase(promptWord)) {
                isGuessCorrect = true;
                break;
            }

        if (isGuessCorrect)
            result = "Correct!";
        else
            result = "Wrong!";

        Map<String, Object> response = new HashMap<>();
        response.put("result", result);

        return objectMapper.writeValueAsString(response);
    }
}