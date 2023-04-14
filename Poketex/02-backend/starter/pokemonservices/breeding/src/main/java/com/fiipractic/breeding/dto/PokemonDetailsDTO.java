package com.fiipractic.breeding.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class PokemonDetailsDTO {
    private String image;
    private String prompt;
    private String negativePrompt;
    private Integer steps;
    private Long seed;
    private Integer generation;

}