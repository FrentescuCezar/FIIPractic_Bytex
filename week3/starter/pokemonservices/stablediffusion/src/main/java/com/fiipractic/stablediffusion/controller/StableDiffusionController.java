package com.fiipractic.stablediffusion.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fiipractic.pokemoncatalog.model.Pokedex;
import com.fiipractic.stablediffusion.repository.StableDiffusionRepository;
import com.fiipractic.stablediffusion.requestmodel.ImageRequest;
import com.fiipractic.stablediffusion.service.StableDiffusionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@JsonFormat
@CrossOrigin(origins = "http://localhost:3000")
public class StableDiffusionController {

    private final StableDiffusionService stableDiffusionService;
    private final StableDiffusionRepository stableDiffusionRepository;

    public StableDiffusionController(StableDiffusionService stableDiffusionService, StableDiffusionRepository stableDiffusionRepository) {
        this.stableDiffusionService = stableDiffusionService;
        this.stableDiffusionRepository = stableDiffusionRepository;
    }


    @PostMapping(value = "/trial")
    public String trial(@RequestBody ImageRequest imageRequest) throws Exception{
        return stableDiffusionService.sendPrompt(imageRequest.getPrompt(), Optional.ofNullable(imageRequest.getNegativePrompt()), 1, imageRequest.getSteps());
    }

    @GetMapping(value = "/pokedex/random")
    public Page<Pokedex> getRandomPokemons(@RequestParam(value = "limit", required = true) Integer limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return stableDiffusionRepository.getRandomPokemons(pageable);
    }




}
