package com.fiipractic.whos.that.pokemon.service;

import com.fiipractic.whos.that.pokemon.model.Pokemon;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class WhosThatPokemonService {
    public Pokemon getRandomPokemon(){
        RestTemplate restTemplate = new RestTemplate();

        Pokemon[] response = restTemplate.getForObject(
                "http://localhost:8081/pokedex/random?limit=" + 1,
                Pokemon[].class);

        return response[0];
    }

    public Pokemon getPokemonById(Integer pokemonId){
        RestTemplate restTemplate = new RestTemplate();

        Pokemon response = restTemplate.getForObject(
                "http://localhost:8081/pokedex/pokemon/" + pokemonId,
                Pokemon.class);

        return response;
    }



}
