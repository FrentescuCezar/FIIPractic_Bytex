package com.fiipractic.breeding.service;

import java.util.Optional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fiipractic.breeding.requestmodel.BreedRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@Service
public class BreedingService {

    private static final Logger LOGGER = LoggerFactory.getLogger(BreedingService.class);

    public String breed(BreedRequest breedRequest) throws JsonProcessingException {
        Integer parent1 = breedRequest.getParent1();
        Integer parent2 = breedRequest.getParent2();
        String token = breedRequest.getToken(); // Extract the token




        Map<String, Object> parent1Details = getPokemonDetailsById(parent1);
        Map<String, Object> parent2Details = getPokemonDetailsById(parent2);

        String imageParent1 = (String) parent1Details.get("image");
        String promptParent1 = (String) parent1Details.get("prompt");
        String negativePromptParent1 = (String) parent1Details.get("negativePrompt");


        String promptParent2 = (String) parent2Details.get("prompt");
        String negativePromptParent2 = (String) parent2Details.get("negativePrompt");
        Integer stepsParent2 = (Integer) parent2Details.get("steps");
        Long seedParent2 = ((Number) parent2Details.get("seed")).longValue();

        Integer generation = (Integer) parent2Details.get("generation") + 1;


        // Get the generated image, name, and description
        String generatedImage = getNewGeneratedImage(imageParent1, promptParent2, negativePromptParent2, stepsParent2, seedParent2);
        System.out.println(generatedImage);

        String generatedName = getGeneratedName(promptParent1 + " + " + promptParent2);
        String generatedDescription = getGeneratedDescription(promptParent1 + " + " + promptParent2);


        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode generatedImageNode = objectMapper.readTree(generatedImage);
        String seedFromGeneratedImage = generatedImageNode.get("seed").asText();

        // Extract the actual values for name, description, and image
        generatedName = objectMapper.readTree(generatedName).get("name").asText();
        generatedDescription = objectMapper.readTree(generatedDescription).get("description").asText();
        generatedImage = objectMapper.readTree(generatedImage).get("image").asText();




        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("name", generatedName);
        requestBody.put("description", generatedDescription);
        requestBody.put("prompt", promptParent1 + " + " + promptParent2);

        String negativePrompt = null;
        if (negativePromptParent1 != null && negativePromptParent2 != null) {
            negativePrompt = negativePromptParent1 + " " + negativePromptParent2;
            requestBody.put("negativePrompt", negativePrompt);
        } else if(negativePromptParent1 != null) {
            negativePrompt = negativePromptParent1;
            requestBody.put("negativePrompt", negativePrompt);
        } else if(negativePromptParent2 != null) {
            negativePrompt = negativePromptParent2;
            requestBody.put("negativePrompt", negativePrompt);
        }else{
            requestBody.put("negativePrompt", null);
        }

        requestBody.put("parent1", parent1);
        requestBody.put("parent2", parent2);
        requestBody.put("generation", generation);
        requestBody.put("image", generatedImage);
        requestBody.put("steps", stepsParent2);
        requestBody.put("seed", seedFromGeneratedImage);

        // Print the JSON request body
        System.out.println("Request body: " + objectMapper.writeValueAsString(requestBody));

        // Call the createPokemon API
        ResponseEntity<String> response = createPokemon(requestBody, token);
        if (response.getStatusCode().is2xxSuccessful()) {
            // Successfully created the new breeded Pokémon
            System.out.println("Pokemon created successfully");
            return response.getBody();
        } else {
            // Handle error
            System.err.println("Error creating Pokemon: " + response.getStatusCode());
            return null;
        }
    }

    private String getGeneratedName(String prompt) {
        String url = "http://localhost:8088/name";
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("prompt", prompt);

        RestTemplate restTemplate = new RestTemplate();
        String generatedName = restTemplate.getForObject(builder.toUriString(), String.class);

        return generatedName;
    }

    private String getGeneratedDescription(String prompt) {
        String url = "http://localhost:8088/description";
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("prompt", prompt);

        RestTemplate restTemplate = new RestTemplate();
        String generatedDescription = restTemplate.getForObject(builder.toUriString(), String.class);

        return generatedDescription;
    }

    private String getNewGeneratedImage(String parent1Image,String prompt, String negativePrompt, Integer steps, Long seed) throws JsonProcessingException {
        String apiUrl = "http://localhost:8081/api/ImageToImage";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("image", parent1Image);
        requestBody.put("prompt", prompt);
        requestBody.put("negativePrompt", negativePrompt);
        requestBody.put("steps", steps);
        requestBody.put("seed", seed);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(requestBody);


        HttpEntity<String> entity = new HttpEntity<>(json, headers);
        String response = restTemplate.postForObject(apiUrl, entity, String.class);

        return response;
    }

    private String getPokemonImageById(Integer id) {
        String url = "http://localhost:8084/api/pokedex/" + id + "/image";
        RestTemplate restTemplate = new RestTemplate();
        String base64Image = restTemplate.getForObject(url, String.class);
        return base64Image;
    }

    private Map<String, Object> getPokemonDetailsById(Integer id) {
        String url = "http://localhost:8084/api/pokedexes/" + id;
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> pokemonDetails = restTemplate.getForObject(url, Map.class);
        return pokemonDetails;
    }



    private ResponseEntity<String> createPokemon(Map<String, Object> requestBody, String token) throws JsonProcessingException {
        String createPokemonUrl = "http://localhost:8084/api/create";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + token);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(requestBody);

        // Log the request body before sending
        LOGGER.info("Sending request body: {}", json);

        HttpEntity<String> entity = new HttpEntity<>(json, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(createPokemonUrl, entity, String.class);
            LOGGER.info("Received successful response from create Pokemon API: {}", response.getBody());
            return response;
        } catch (HttpClientErrorException e) {
            LOGGER.error("Request body: {}", json); // Log the request body
            LOGGER.error("Response: {}", e.getResponseBodyAsString()); // Log the response message
            throw e;
        }
    }

}
