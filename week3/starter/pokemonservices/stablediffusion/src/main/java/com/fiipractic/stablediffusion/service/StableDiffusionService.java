package com.fiipractic.stablediffusion.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fiipractic.pokemoncatalog.model.Pokedex;
import com.fiipractic.stablediffusion.repository.StableDiffusionRepository;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@Service
public class StableDiffusionService {

    private final StableDiffusionRepository stableDiffusionRepository;

    public StableDiffusionService(StableDiffusionRepository stableDiffusionRepository) {
        this.stableDiffusionRepository = stableDiffusionRepository;
    }


    public String sendPrompt(String prompt, Optional<String> negativePrompt, int batch_size, int steps) {
        String txt2imgUrl = "http://127.0.0.1:7861/sdapi/v1/txt2img";

        ResponseEntity<String> response = submitPost(txt2imgUrl, prompt, negativePrompt, batch_size, steps);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                System.out.println(jsonNode);

                String image = jsonNode.get("images").get(0).asText();
                saveEncodedImage(image, "Pokemon" + 0,"starter/pokemonservices/dog" + 0 + ".png");

                String info = jsonNode.get("info").asText();
                JsonNode infoNode = objectMapper.readTree(info);
                String seed = infoNode.get("seed").asText();

                return createJsonResponse(image, seed, prompt, negativePrompt, steps, objectMapper);

            } catch (Exception e) {
                System.err.println("Error parsing JSON response: " + e.getMessage());
            }
        } else {
            System.err.println("Error: " + response.getStatusCode());
        }
        return null;
    }

    private String createJsonResponse(String image, String seed, String prompt, Optional<String> negativePrompt, int steps, ObjectMapper objectMapper) {
        ObjectNode jsonResponse = objectMapper.createObjectNode();
        jsonResponse.put("image", image);
        jsonResponse.put("seed", seed);
        jsonResponse.put("prompt", prompt);
        negativePrompt.ifPresent(np -> jsonResponse.put("negativePrompt", np));
        jsonResponse.put("steps", steps);

        return jsonResponse.toString();
    }

    private static ResponseEntity<String> submitPost(String url, String prompt, Optional<String> negativePrompt, int batch_size, int steps) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String json;
        if(negativePrompt.isPresent()){
            json = "{\"prompt\": \"" + prompt + "\", " +
                    "\"negative_prompt\": \"" + negativePrompt + "\", " +
                    "\"batch_size\": \"" + batch_size + "\", " +
                    "\"steps\": \"" + steps + "\"}";
        }
        else{
            json = "{\"prompt\": \"" + prompt + "\", " +
                    "\"batch_size\": \"" + batch_size + "\", " +
                    "\"steps\": \"" + steps + "\"}";
        }


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

            //stableDiffusionRepository.save(pokemon);


        } catch (Exception e) {
            System.err.println("Error saving image: " + e.getMessage());
        }
    }

    private List<String> generateRandomAbilities() throws IOException {
        List<String> abilitiesList = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader("abilities.txt"))) {
            String abilitiesLine = reader.readLine();
            String[] abilitiesArray = abilitiesLine.split(",");
            for (String ability : abilitiesArray) {
                abilitiesList.add(ability.trim()); // trim removes leading/trailing spaces
            }
        }
        Collections.shuffle(abilitiesList);
        return abilitiesList.subList(0, 2);
    }


}

