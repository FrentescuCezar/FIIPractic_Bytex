package com.fiipractic.whos.that.pokemon.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fiipractic.pokemoncatalog.model.Pokedex;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CustomResponseWrapper {

    private List<Pokedex> content;

    public List<Pokedex> getContent() {
        return content;
    }

    public void setContent(List<Pokedex> content) {
        this.content = content;
    }
}