package com.fiipractic.stablediffusion.controller;

import com.fasterxml.jackson.annotation.JsonFormat;

import com.fiipractic.stablediffusion.requestmodel.ImageToImageRequest;
import com.fiipractic.stablediffusion.requestmodel.TextToImageRequest;

import com.fiipractic.stablediffusion.repository.StableDiffusionRepository;
import com.fiipractic.stablediffusion.service.StableDiffusionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

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


}
