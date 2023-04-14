package com.fiipractic.stablediffusion.model;

import lombok.Data;

@Data
public class ImageResponse {
    private String image;
    private String seed;

    public ImageResponse(String image, String seed) {
        this.image = image;
        this.seed = seed;
    }
}