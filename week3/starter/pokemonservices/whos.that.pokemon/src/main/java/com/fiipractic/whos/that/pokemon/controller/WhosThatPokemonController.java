package com.fiipractic.whos.that.pokemon.controller;

import com.fiipractic.pokemoncatalog.model.Pokedex;

import com.fiipractic.whos.that.pokemon.service.WhosThatPokemonService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.Map;


@RestController
public class WhosThatPokemonController {

    private final WhosThatPokemonService whosThatPokemonService;

    public WhosThatPokemonController(WhosThatPokemonService whosThatPokemonService) {
        this.whosThatPokemonService = whosThatPokemonService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/")
    public Pokedex whosThatPokemon() {
        Pokedex pokemon = whosThatPokemonService.getRandomPokemon();
        return pokemon;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(value = "/guess", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> guessPokemon(@RequestParam String guess, @RequestParam Integer pokemonIndex) {
        Pokedex pokemon = whosThatPokemonService.getPokemonById(pokemonIndex);
        String result;
        String[] promptArray = pokemon.getPrompt().split(" ");

        boolean isGuessCorrect = false;

        if (guess.equalsIgnoreCase(pokemon.getName()))
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

        return ResponseEntity.ok(response);
    }
}
