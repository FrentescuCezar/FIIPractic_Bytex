package com.fiipractic.breeding.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fiipractic.breeding.requestmodel.BreedRequest;
import com.fiipractic.breeding.service.BreedingService;
import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.*;

@RequestMapping("/breedapi")
@RestController
public class BreedingController {

    private final BreedingService breedingService;

    public BreedingController(BreedingService breedingService) {
        this.breedingService = breedingService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(value = "/breed")
    public String breed(@RequestBody BreedRequest breedRequest) throws JsonProcessingException {
        return breedingService.breed(breedRequest);

    }


}
