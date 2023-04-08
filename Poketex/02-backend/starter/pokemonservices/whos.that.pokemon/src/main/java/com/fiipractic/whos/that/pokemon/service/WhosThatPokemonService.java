package com.fiipractic.whos.that.pokemon.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class WhosThatPokemonService {
    public WhosThatPokemonService() {
    }

    public String getRandomPokemon() throws JsonProcessingException {

         RestTemplate restTemplate = new RestTemplate();
         ObjectMapper objectMapper = new ObjectMapper();

        int limit = 1;
        String url = "http://localhost:8084/api/poketex/random?limit=" + limit;

        ResponseEntity<JsonNode> response = restTemplate.getForEntity(url, JsonNode.class);
        JsonNode responseBody = response.getBody();
        JsonNode contentNode = responseBody.get("content");
        return objectMapper.writeValueAsString(contentNode.get(0));

    }

    public String getPokemonById(Integer pokemonId) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        ObjectMapper objectMapper = new ObjectMapper();

        String url = "http://localhost:8084/api/poketexes/" + pokemonId;
        ResponseEntity<JsonNode> response = restTemplate.getForEntity(url, JsonNode.class);
        return objectMapper.writeValueAsString(response.getBody());
    }
}
