package com.fiipractic.stablediffusion.requestmodel;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class ImageToImageRequest{
    @Column(name="image",columnDefinition = "text")
    private String image;
    @Column(name="prompt",columnDefinition = "text")
    private String prompt;
    @Column(name="negative_prompt", columnDefinition = "text")
    private String negativePrompt;
    private Integer steps;
    private Long seed;

}
