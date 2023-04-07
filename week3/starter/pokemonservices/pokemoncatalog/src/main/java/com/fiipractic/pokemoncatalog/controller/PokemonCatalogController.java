package com.fiipractic.pokemoncatalog.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fiipractic.pokemoncatalog.model.Pokedex;
import com.fiipractic.pokemoncatalog.repository.PokemonCatalogRepository;
import com.fiipractic.pokemoncatalog.requestmodel.PoketexRequest;
import com.fiipractic.pokemoncatalog.service.PokemonCatalogService;
import com.fiipractic.pokemoncatalog.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api")
@JsonFormat
@CrossOrigin(origins = "http://localhost:3000")
public class PokemonCatalogController {

    private final PokemonCatalogRepository pokemonCatalogRepository;
    @Autowired
    private final PokemonCatalogService pokemonCatalogService;

    public PokemonCatalogController(PokemonCatalogRepository pokemonCatalogRepository, PokemonCatalogService pokemonCatalogService) {
        this.pokemonCatalogRepository = pokemonCatalogRepository;
        this.pokemonCatalogService = pokemonCatalogService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/pokedex/recent")
    public Page<Pokedex> getRecentPokemons(@RequestParam("page") int page,
                                           @RequestParam("size") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return pokemonCatalogRepository.findAllByOrderByIdDesc(pageable);
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/pokedex/random")
    public Page<Pokedex> getRandomPokemons(@RequestParam(value = "limit", required = true) Integer limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return pokemonCatalogRepository.getRandomPokemons(pageable);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/pokedex/random/user")
    public Page<Pokedex> getRandomPokemonsByUsername(@RequestParam(value = "username") String username, @RequestParam(value = "limit") Integer limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return pokemonCatalogRepository.getRandomPokemonByUsername(username, pageable);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/userPokemons")
    public Page<Pokedex> getUserPokemons(@RequestParam(value = "username") String username,
                                         @RequestParam("page") int page,
                                         @RequestParam("size") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return pokemonCatalogRepository.findByUsername(username, pageable);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/related")
    public Page<Pokedex> getRelatedPokemons(@RequestParam("prompt") String prompt,
                                            @RequestParam("page") int page,
                                            @RequestParam("size") int size) {
        String joinedPrompt = String.join("|", prompt.replaceAll("[,;]", " ").split("\\s+"));
        Pageable pageable = PageRequest.of(page, size);
        return pokemonCatalogRepository.findRelatedPokemons(joinedPrompt, pageable);
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/pokemon-list")
    public List<Pokedex> getPokemonDetailsByIds(@RequestBody List<Integer> pokemonIds) {
        return pokemonCatalogService.getPokemonDetailsByIds(pokemonIds);
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/pokedex/{id}/image")
    public ResponseEntity<String> getPokemonImageById(@PathVariable("id") Integer id) {
        Optional<Pokedex> pokedex = pokemonCatalogRepository.findById(id);

        if (pokedex.isPresent()) {
            String base64Image = pokedex.get().getImage(); // Assuming the image field name is 'image'
            return new ResponseEntity<>(base64Image, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/create")
    public ResponseEntity<Pokedex> createPokemon(@RequestHeader(value = "Authorization") String token, @RequestBody PoketexRequest pokedexRequest) {
        try {
            String username = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
            Pokedex pokedex = pokemonCatalogService.createPokedex(pokedexRequest, username);
            pokemonCatalogRepository.save(pokedex);

            return new ResponseEntity<>(pokedex, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
