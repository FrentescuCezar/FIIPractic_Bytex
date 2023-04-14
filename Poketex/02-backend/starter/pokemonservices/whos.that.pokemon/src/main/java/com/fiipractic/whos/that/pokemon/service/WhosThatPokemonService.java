package com.fiipractic.whos.that.pokemon.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;


@Service
public class WhosThatPokemonService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String poketexUrl;

    @Autowired
    public WhosThatPokemonService(RestTemplate restTemplate,
                                  ObjectMapper objectMapper,
                                  @Value("${api.base-url.poketexUrl}") String poketexUrl) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.poketexUrl = poketexUrl;
    }

    public String getRandomPokemon() throws JsonProcessingException {

        int limit = 1;
        String url = "http://localhost:8084/api/poketex/random?limit=" + limit;

        ResponseEntity<JsonNode> response = restTemplate.getForEntity(url, JsonNode.class);
        JsonNode responseBody = response.getBody();
        JsonNode contentNode = responseBody.get("content");
        return objectMapper.writeValueAsString(contentNode.get(0));

    }

    public String getPokemonById(Integer pokemonId) throws JsonProcessingException {

        String url = "http://localhost:8084/api/poketexes/" + pokemonId;
        ResponseEntity<JsonNode> response = restTemplate.getForEntity(url, JsonNode.class);
        return objectMapper.writeValueAsString(response.getBody());
    }

    public String checkGuess(String guess, Integer pokemonId) throws JsonProcessingException {
        String pokemon = getPokemonById(pokemonId);
        JsonNode pokemonNode = objectMapper.readTree(pokemon);

        String result;
        String[] promptArray = pokemonNode.get("prompt").asText().split(" ");

        boolean isGuessCorrect = false;

        if (guess.equalsIgnoreCase(pokemonNode.get("name").asText()))
            isGuessCorrect = true;

        for (String promptWord : promptArray) {
            if (guess.equalsIgnoreCase(promptWord)) {
                isGuessCorrect = true;
                break;
            }
        }

        if (isGuessCorrect)
            result = "Correct!";
        else
            result = "Wrong!";

        return result;
    }

}