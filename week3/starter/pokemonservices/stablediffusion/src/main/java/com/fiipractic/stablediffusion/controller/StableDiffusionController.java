package com.fiipractic.stablediffusion.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fiipractic.comment.utils.ExtractJWT;
import com.fiipractic.pokemoncatalog.model.Pokedex;

import com.fiipractic.stablediffusion.requestmodel.ImageToImageRequest;
import com.fiipractic.stablediffusion.requestmodel.PoketexRequest;
import com.fiipractic.stablediffusion.requestmodel.TextToImageRequest;
import com.fiipractic.stablediffusion.utils.PokemonStatsGenerator;

import com.fiipractic.stablediffusion.repository.StableDiffusionRepository;
import com.fiipractic.stablediffusion.service.StableDiffusionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@JsonFormat
@CrossOrigin(origins = "http://localhost:3000")
public class StableDiffusionController {

    private static final Logger LOGGER = LoggerFactory.getLogger(StableDiffusionController.class);

    @Autowired
    private final StableDiffusionService stableDiffusionService;

    private final StableDiffusionRepository stableDiffusionRepository;

    public StableDiffusionController(StableDiffusionService stableDiffusionService, StableDiffusionRepository stableDiffusionRepository) {
        this.stableDiffusionService = stableDiffusionService;
        this.stableDiffusionRepository = stableDiffusionRepository;
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(value = "/trial")
    public String trial(@RequestBody TextToImageRequest imageRequest) throws Exception {
        return stableDiffusionService.generateTextToImage(imageRequest.getPrompt(), Optional.ofNullable(imageRequest.getSeed()), Optional.ofNullable(imageRequest.getNegativePrompt()), 1, imageRequest.getSteps());
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(value = "/ImageToImage")
    public String ImagetoImage(@RequestBody ImageToImageRequest imageRequest) throws Exception {
        return stableDiffusionService.generateImageToImage(imageRequest.getImage(), imageRequest.getPrompt(), Optional.ofNullable(imageRequest.getNegativePrompt()), imageRequest.getSteps(), imageRequest.getSeed());
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/pokedex/random")
    public Page<Pokedex> getRandomPokemons(@RequestParam(value = "limit", required = true) Integer limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return stableDiffusionRepository.getRandomPokemons(pageable);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/pokedex/random/user")
    public Page<Pokedex> getRandomPokemonsByUsername(@RequestParam(value = "username") String username, @RequestParam(value = "limit") Integer limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return stableDiffusionRepository.getRandomPokemonByUsername(username, pageable);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/userPokemons")
    public Page<Pokedex> getUserPokemons(@RequestParam(value = "username") String username,
                                         @RequestParam("page") int page,
                                         @RequestParam("size") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return stableDiffusionRepository.findByUsername(username, pageable);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/related")
    public Page<Pokedex> getRelatedPokemons(@RequestParam("prompt") String prompt,
                                            @RequestParam("page") int page,
                                            @RequestParam("size") int size) {
        String joinedPrompt = String.join("|", prompt.replaceAll("[,;]", " ").split("\\s+"));
        Pageable pageable = PageRequest.of(page, size);
        return stableDiffusionRepository.findRelatedPokemons(joinedPrompt, pageable);
    }


    @PostMapping("/pokemon-list")
    public List<Pokedex> getPokemonDetailsByIds(@RequestBody List<Integer> pokemonIds) {
        return stableDiffusionService.getPokemonDetailsByIds(pokemonIds);
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/pokedex/{id}/image")
    public ResponseEntity<String> getPokemonImageById(@PathVariable("id") Integer id) {
        Optional<Pokedex> pokedex = stableDiffusionRepository.findById(id);

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
        LOGGER.info("Received request to create Pokemon with token: {}", token);
        LOGGER.info("Received PoketexRequest: {}", pokedexRequest);

        try {
            String username = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
            Pokedex pokedex = stableDiffusionService.createPokedex(pokedexRequest, username);

            stableDiffusionRepository.save(pokedex);

            LOGGER.info("Successfully created Pokemon with ID: {}", pokedex.getId());

            return new ResponseEntity<>(pokedex, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            LOGGER.error("Error creating Pokemon", e);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }





}
