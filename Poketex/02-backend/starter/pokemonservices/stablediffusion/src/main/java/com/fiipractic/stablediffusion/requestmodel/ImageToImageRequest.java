package com.fiipractic.stablediffusion.requestmodel;

import lombok.Data;

@Data

public class ImageToImageRequest {
    private String image;
    private String prompt;
    private String negativePrompt;
    private Integer steps;
    private Long seed;
}