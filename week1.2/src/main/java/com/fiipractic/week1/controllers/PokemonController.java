package com.fiipractic.week1.controllers;

import com.fiipractic.week1.PokemonDB;
import com.fiipractic.week1.models.Pokemon;
import com.fiipractic.week1.repositories.PokemonRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
public class PokemonController {

    private final PokemonDB pokemonDB;
    private final PokemonRepository pokemonRepository;

    public PokemonController(PokemonDB pokemonDB, PokemonRepository pokemonRepository) {
        this.pokemonDB = pokemonDB;
        this.pokemonRepository = pokemonRepository;
    }

    @GetMapping(path = {"/pokemons", "/pokemons/"})
    public List<Pokemon> Pokemons() {
        return pokemonRepository.findAll();
    }

    @GetMapping(path = "/pokemons/{id}")
    public Optional<Pokemon> pokemon(@PathVariable Integer id) {
        return pokemonRepository.findById(id);
    }

    @PostMapping(path = "/pokemons")
    public Pokemon createPokemon(@RequestBody Pokemon pokemon) {
        return pokemonRepository.save(pokemon);
    }

    @DeleteMapping(path = "/pokemons/{id}")
    public void deletePokemon(@PathVariable Integer id) {
        pokemonRepository.deleteById(id);
    }

    @PatchMapping(path = "/pokemons/{id}")
    public ResponseEntity<Pokemon> updatePokemon(@PathVariable("id") Integer id, @RequestBody Pokemon updatedPokemon) {
        Optional<Pokemon> originalPokemon = pokemonRepository.findById(id);

        if (originalPokemon.isPresent()) {
            // Get the existing Pokemon object
            Pokemon pokemon = originalPokemon.get();



            if (updatedPokemon.getName() != null) {
                pokemon.setName(updatedPokemon.getName());
            }
            if (updatedPokemon.getType() != null) {
                pokemon.setType(updatedPokemon.getType());
            }
            if (updatedPokemon.getTrainer() != null) {
                pokemon.setTrainer(updatedPokemon.getTrainer());
            }
            if (updatedPokemon.getLevel() != null) {
                pokemon.setLevel(updatedPokemon.getLevel());
            }


            pokemonRepository.save(pokemon);

            return new ResponseEntity<>(pokemon, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
