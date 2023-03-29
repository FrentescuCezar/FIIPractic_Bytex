package com.fiipractic.stablediffusion.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fiipractic.pokemoncatalog.model.Pokedex;
import com.fiipractic.stablediffusion.repository.StableDiffusionRepository;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.client.RestTemplate;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;

@Service
public class StableDiffusionService {

    private final StableDiffusionRepository stableDiffusionRepository;

    public StableDiffusionService(StableDiffusionRepository stableDiffusionRepository) {
        this.stableDiffusionRepository = stableDiffusionRepository;
    }


    public String sendPrompt(String prompt, String negativePrompt, int batch_size, int steps) {
        String txt2imgUrl = "http://127.0.0.1:7861/sdapi/v1/txt2img";

        ResponseEntity<String> response = submitPost(txt2imgUrl, prompt, negativePrompt, batch_size, steps);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                System.out.println(jsonNode);
                for (int i = 0; i < jsonNode.get("images").size(); i++) {
                    String b64Image = jsonNode.get("images").get(i).asText();
                    saveEncodedImage(b64Image, "Pokemon" + i,"starter/pokemonservices/dog" + i + ".png");
                }

                return jsonNode.get("images").asText();

            } catch (Exception e) {
                System.err.println("Error parsing JSON response: " + e.getMessage());
            }
        } else {
            System.err.println("Error: " + response.getStatusCode());
        }
        return null;
    }

    private static ResponseEntity<String> submitPost(String url, String prompt, String negativePrompt, int batch_size, int steps) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String json = "{\"prompt\": \"" + prompt + "\", " +
                "\"negative_prompt\": \"" + negativePrompt + "\", " +
                "\"batch_size\": \"" + batch_size + "\", " +
                "\"steps\": \"" + steps + "\"}";

        HttpEntity<String> entity = new HttpEntity<>(json, headers);

        return restTemplate.postForEntity(url, entity, String.class);
    }

    @PostMapping
    private void saveEncodedImage(String b64Image, String pokemonName, String outputPath) {
        try {
            Pokedex pokemon = new Pokedex();
            pokemon.setName(pokemonName);
            pokemon.setImage(b64Image);

            byte[] decodedBytes = Base64.getDecoder().decode(b64Image);
            Files.write(Paths.get(outputPath), decodedBytes);

            stableDiffusionRepository.save(pokemon);


        } catch (Exception e) {
            System.err.println("Error saving image: " + e.getMessage());
        }
    }

}

