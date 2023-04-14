package com.fiipractic.breeding.requestmodel;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreatePokemonRequest {
    private String name;
    private String description;
    private String prompt;
    private String negativePrompt;
    private Integer parent1;
    private Integer parent2;
    private Integer generation;
    private String image;
    private Integer steps;
    private String seed;

}