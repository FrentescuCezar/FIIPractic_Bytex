package com.fiipractic.chatgpt.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatGPTResponse {
    @JsonProperty("name")
    private String name;

    @JsonProperty("description")
    private String description;

    public ChatGPTResponse(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public ChatGPTResponse(boolean isName, String value) {
        if (isName) {
            this.name = value;
        } else {
            this.description = value;
        }
    }
}