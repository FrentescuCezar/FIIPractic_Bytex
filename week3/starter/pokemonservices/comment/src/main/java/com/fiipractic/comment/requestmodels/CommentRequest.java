package com.fiipractic.comment.requestmodels;

import lombok.Data;

import java.util.Optional;

@Data
public class CommentRequest {
    private Integer pokemonId;
    private Optional<String> commentDescription;
    private double rating;

}
