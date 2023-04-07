package com.fiipractic.pokemoncatalog.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fiipractic.pokemoncatalog.model.Poketex;
import com.fiipractic.pokemoncatalog.requestmodel.PoketexRequest;
import com.fiipractic.pokemoncatalog.service.PokemonCatalogService;
import com.fiipractic.pokemoncatalog.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

    private final PokemonCatalogService pokemonCatalogService;

    @Autowired
    public PokemonCatalogController(PokemonCatalogService pokemonCatalogService) {
        this.pokemonCatalogService = pokemonCatalogService;
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/poketex/recent")
    public Page<Poketex> getRecentPokemons(@RequestParam("page") int page,
                                           @RequestParam("size") int size) {
        return pokemonCatalogService.findAllByOrderByIdDesc(page, size);
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/poketex/random")
    public Page<Poketex> getRandomPokemons(@RequestParam(value = "limit", required = true) Integer limit) {
        return pokemonCatalogService.findRandomPokemons(limit);
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/poketex/user/random")
    public Page<Poketex> getRandomPokemonsByUsername(@RequestParam(value = "username") String username, @RequestParam(value = "limit") Integer limit) {
        return pokemonCatalogService.findRandomPokemonsByUsername(username, limit);
    }



    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/userPokemons")
    public Page<Poketex> getUserPokemons(@RequestParam(value = "username") String username,
                                         @RequestParam("page") int page,
                                         @RequestParam("size") int size) {
        return pokemonCatalogService.findByUsername(username, page, size);
    }




    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/related")
    public Page<Poketex> getRelatedPokemons(@RequestParam("prompt") String prompt,
                                            @RequestParam("page") int page,
                                            @RequestParam("size") int size) {
        return pokemonCatalogService.findRelatedPokemons(prompt, page, size);
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/pokemon-list")
    public List<Poketex> getOrderedPokemonDetailsByIds(@RequestBody List<Integer> pokemonIds) {
        return pokemonCatalogService.getOrderedPokemonDetailsByIds(pokemonIds);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/poketex/{id}/image")
    public ResponseEntity<String> getPokemonImageById(@PathVariable("id") Integer id) {
        Optional<Poketex> poketex = pokemonCatalogService.findById(id);

        if (poketex.isPresent()) {
            String base64Image = poketex.get().getImage();
            return new ResponseEntity<>(base64Image, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/create")
    public ResponseEntity<Poketex> createPokemon(@RequestHeader(value = "Authorization") String token, @RequestBody PoketexRequest poketexRequest) {
        try {
            String username = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
            Poketex poketex = pokemonCatalogService.createPoketex(poketexRequest, username);
            pokemonCatalogService.save(poketex);

            return new ResponseEntity<>(poketex, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
