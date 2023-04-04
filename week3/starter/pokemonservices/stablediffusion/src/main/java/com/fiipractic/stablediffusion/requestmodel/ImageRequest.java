package com.fiipractic.stablediffusion.requestmodel;

import jakarta.persistence.Column;
import lombok.Data;

import java.util.Optional;

@Data
public class ImageRequest {
    @Column(name="prompt",columnDefinition = "text")
    private String prompt;
    @Column(name="negative_prompt", columnDefinition = "text")
    private String negativePrompt; // Change this line
    private Integer steps;

}
