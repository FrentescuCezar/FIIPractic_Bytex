package com.fiipractic.whos.that.pokemon.service;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fiipractic.pokemoncatalog.model.Pokedex;
import com.fiipractic.whos.that.pokemon.model.CustomResponseWrapper;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class WhosThatPokemonService extends PageImpl<Pokedex> {
    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public WhosThatPokemonService(List<Pokedex> content, Pageable pageable, long total) {
        super(content, pageable, total);
    }

    public WhosThatPokemonService(List<Pokedex> content) {
        super(content);
    }

    public WhosThatPokemonService() {
        super(Arrays.asList());
    }

    public Pokedex getRandomPokemon() {
        RestTemplate restTemplate = new RestTemplate();

        int limit = 1;
        String url = "http://localhost:8084/api/pokedex/random?limit=" + limit;

        ResponseEntity<CustomResponseWrapper> response = restTemplate.getForEntity(url, CustomResponseWrapper.class);
        CustomResponseWrapper customResponse = response.getBody();

        if (customResponse != null && customResponse.getContent() != null && !customResponse.getContent().isEmpty()) {
            return customResponse.getContent().get(0);
        } else {
            return null;
        }
    }

    public Pokedex getPokemonById(Integer pokemonId) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8084/api/pokedexes/" + pokemonId;
        ResponseEntity<Pokedex> response = restTemplate.getForEntity(url, Pokedex.class);
        return response.getBody();
    }


}
