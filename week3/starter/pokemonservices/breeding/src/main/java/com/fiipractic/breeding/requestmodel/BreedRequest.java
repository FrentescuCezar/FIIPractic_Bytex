package com.fiipractic.breeding.requestmodel;

import jakarta.persistence.Column;
import lombok.Data;

import java.util.Optional;

@Data
public class BreedRequest {
    Integer parent1;
    Integer parent2;
    String token;

}
