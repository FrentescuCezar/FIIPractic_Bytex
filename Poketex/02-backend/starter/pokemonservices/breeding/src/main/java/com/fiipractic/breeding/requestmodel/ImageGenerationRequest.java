package com.fiipractic.breeding.requestmodel;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor

public class ImageGenerationRequest {
    private String image;
    private String prompt;
    private String negativePrompt;
    private Integer steps;
    private Long seed;
}