package com.fiipractic.pokemoncatalog.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.Optional;

public class JsonUtils {

    public static String createJsonResponse(String image, String seed, String prompt, Optional<String> negativePrompt, int steps, ObjectMapper objectMapper) {
        ObjectNode jsonResponse = objectMapper.createObjectNode();
        jsonResponse.put("image", image);
        jsonResponse.put("seed", seed);
        jsonResponse.put("prompt", prompt);
        negativePrompt.ifPresent(np -> jsonResponse.put("negativePrompt", np));
        jsonResponse.put("steps", steps);

        return jsonResponse.toString();
    }

}
