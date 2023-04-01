package com.fiipractic.stablediffusion.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fiipractic.pokemoncatalog.model.Pokedex;
import com.fiipractic.stablediffusion.repository.StableDiffusionRepository;
import com.fiipractic.stablediffusion.service.StableDiffusionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

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


    @GetMapping(value = "/trial")
    public String trial(@RequestParam String prompt,
                        @RequestParam(required = false, defaultValue = "") String negativePrompt,
                        @RequestParam(required = false, defaultValue = "1") int batch_size,
                        @RequestParam(required = false, defaultValue = "20") int steps,
                        Model model){
        System.out.println(stableDiffusionService.sendPrompt(prompt, negativePrompt, batch_size, steps));
        return "trial";
    }
}
