package com.fiipractic.breeding.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fiipractic.breeding.dto.PokemonDetailsDTO;
import com.fiipractic.breeding.requestmodel.BreedRequest;

import com.fiipractic.breeding.requestmodel.CreatePokemonRequest;
import com.fiipractic.breeding.requestmodel.ImageGenerationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@Service
public class BreedingService {
    private final RestTemplate restTemplate;
    private final String poketexBaseUrl;
    private final String imageToImageBaseUrl;
    private final String chatGptBaseUrl;

    @Autowired
    public BreedingService(RestTemplate restTemplate,
                           @Value("${api.base-url.poketex}") String poketexBaseUrl,
                           @Value("${api.base-url.image-to-image}") String imageToImageBaseUrl,
                           @Value("${api.base-url.chatgpt}") String chatGptBaseUrl) {
        this.restTemplate = restTemplate;
        this.poketexBaseUrl = poketexBaseUrl;
        this.imageToImageBaseUrl = imageToImageBaseUrl;
        this.chatGptBaseUrl = chatGptBaseUrl;
    }


    private void validateBreedRequest(BreedRequest breedRequest) {
        Objects.requireNonNull(breedRequest, "breedRequest must not be null");
        Objects.requireNonNull(breedRequest.getParent1(), "parent1 ID must not be null");
        Objects.requireNonNull(breedRequest.getParent2(), "parent2 ID must not be null");
        Objects.requireNonNull(breedRequest.getToken(), "token must not be null");
    }

    public String breed(BreedRequest breedRequest) throws JsonProcessingException {
        validateBreedRequest(breedRequest);


        int parent1Id = breedRequest.getParent1();
        int parent2Id = breedRequest.getParent2();
        String token = breedRequest.getToken();

        PokemonDetailsDTO parent1 = getPokemonDetailsById(parent1Id);
        PokemonDetailsDTO parent2 = getPokemonDetailsById(parent2Id);

        String generatedImage = getNewGeneratedImage(
                new ImageGenerationRequest(
                        parent1.getImage(),
                        parent2.getPrompt(),
                        parent2.getNegativePrompt(),
                        parent2.getSteps(),
                        parent2.getSeed()
                )
        );

        ObjectMapper objectMapper = new ObjectMapper();
        String imageSeed = objectMapper.readTree(generatedImage).get("seed").asText();
        String imageBase64 = objectMapper.readTree(generatedImage).get("image").asText();

        String breedPrompt = parent1.getPrompt() + " + " + parent2.getPrompt();
        String negativePrompt = Stream.of(parent1.getNegativePrompt(), parent2.getNegativePrompt())
                .filter(Objects::nonNull)
                .collect(Collectors.joining(" + "));

        String generatedName = objectMapper.readTree(getGeneratedName(breedPrompt)).get("name").asText();
        String generatedDescription = objectMapper.readTree(getGeneratedDescription(breedPrompt)).get("description").asText();

        int generation = parent2.getGeneration() + 1;
        int steps = parent2.getSteps();

        CreatePokemonRequest createPokemonRequest = new CreatePokemonRequest(
                generatedName,
                generatedDescription,
                breedPrompt,
                negativePrompt,
                parent1Id,
                parent2Id,
                generation,
                imageBase64,
                steps,
                imageSeed
        );

        ResponseEntity<String> response = createPokemon(createPokemonRequest, token);
        return response.getStatusCode().is2xxSuccessful() ? response.getBody() : null;
    }



    private String getNewGeneratedImage(ImageGenerationRequest request) throws JsonProcessingException {
        String apiUrl = imageToImageBaseUrl + "/api/imageToImage";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<ImageGenerationRequest> entity = new HttpEntity<>(request, headers);
        String response = restTemplate.postForObject(apiUrl, entity, String.class);

        return response;
    }


    private String getGeneratedName(String prompt) {
        String url = chatGptBaseUrl + "/name?prompt=" + prompt;
        return restTemplate.getForObject(url, String.class);
    }


    private String getGeneratedDescription(String prompt) {
        String url = chatGptBaseUrl + "/description?prompt=" + prompt;
        return restTemplate.getForObject(url, String.class);
    }


    private PokemonDetailsDTO getPokemonDetailsById(Integer id) {
        String url = poketexBaseUrl + "/api/poketexes/" + id;
        return restTemplate.getForObject(url, PokemonDetailsDTO.class);
    }

    private ResponseEntity<String> createPokemon(CreatePokemonRequest requestBody, String token) {
        String createPokemonUrl = poketexBaseUrl + "/api/poketex/create";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<CreatePokemonRequest> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(createPokemonUrl, entity, String.class);
            return response;
        } catch (HttpClientErrorException e) {
            throw e;
        }
    }

}
