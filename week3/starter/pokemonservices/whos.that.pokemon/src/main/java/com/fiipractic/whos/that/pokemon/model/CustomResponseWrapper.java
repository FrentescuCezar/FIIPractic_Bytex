package com.fiipractic.whos.that.pokemon.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fiipractic.pokemoncatalog.model.Poketex;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CustomResponseWrapper {

    private List<Poketex> content;
    public List<Poketex> getContent() {
        return content;
    }
    public void setContent(List<Poketex> content) {
        this.content = content;
    }
}