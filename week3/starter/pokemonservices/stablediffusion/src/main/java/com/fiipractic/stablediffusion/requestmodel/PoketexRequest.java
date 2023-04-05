package com.fiipractic.stablediffusion.requestmodel;

import lombok.Data;

import java.util.Optional;

@Data
public class PoketexRequest {
    String name;
    String description;
    String prompt;
    Optional<String> negativePrompt;
    String image;
    Integer steps;
    Long seed;
}
