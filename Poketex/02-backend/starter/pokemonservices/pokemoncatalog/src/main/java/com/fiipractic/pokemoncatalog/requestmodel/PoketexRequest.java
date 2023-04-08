package com.fiipractic.pokemoncatalog.requestmodel;

import lombok.Data;

import java.util.Optional;

@Data
public class PoketexRequest {
    String name;
    String description;
    String prompt;
    Optional<String> negativePrompt;
    Optional<Integer> parent1;
    Optional<Integer> parent2;
    Integer generation;
    String image;
    Integer steps;
    Long seed;
}
