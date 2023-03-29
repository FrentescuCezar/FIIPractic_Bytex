package com.fiipractic.stablediffusion.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fiipractic.stablediffusion.service.StableDiffusionService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api")
@JsonFormat
@CrossOrigin(origins = "http://localhost:3000")
public class StableDiffusionController {

    private final StableDiffusionService stableDiffusionService;

    public StableDiffusionController(StableDiffusionService stableDiffusionService) {
        this.stableDiffusionService = stableDiffusionService;
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
