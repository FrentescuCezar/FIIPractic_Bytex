package com.fiipractic.stablediffusion.controller;

import com.fasterxml.jackson.annotation.JsonFormat;

import com.fiipractic.stablediffusion.model.ImageResponse;
import com.fiipractic.stablediffusion.requestmodel.ImageToImageRequest;
import com.fiipractic.stablediffusion.requestmodel.TextToImageRequest;

import com.fiipractic.stablediffusion.service.StableDiffusionService;

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

    @PostMapping(value = "/textToImage")
    public ImageResponse TextToImage(@RequestBody TextToImageRequest imageRequest) throws Exception {
        return stableDiffusionService.generateTextToImage(imageRequest);
    }

    @PostMapping(value = "/imageToImage")
    public ImageResponse ImagetoImage(@RequestBody ImageToImageRequest imageRequest) throws Exception {
        return stableDiffusionService.generateImageToImage(imageRequest);
    }
}