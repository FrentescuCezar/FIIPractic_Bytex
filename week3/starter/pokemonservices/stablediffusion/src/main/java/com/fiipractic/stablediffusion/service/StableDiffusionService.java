package com.fiipractic.stablediffusion.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fiipractic.pokemoncatalog.model.Pokedex;
import com.fiipractic.stablediffusion.repository.StableDiffusionRepository;
import com.fiipractic.stablediffusion.requestmodel.PoketexRequest;
import com.fiipractic.stablediffusion.utils.JsonUtils;
import com.fiipractic.stablediffusion.utils.PokemonStatsGenerator;
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
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class StableDiffusionService {

    private final StableDiffusionRepository stableDiffusionRepository;

    public StableDiffusionService(StableDiffusionRepository stableDiffusionRepository) {
        this.stableDiffusionRepository = stableDiffusionRepository;
    }


    public List<Pokedex> getPokemonDetailsByIds(List<Integer> pokemonIds) {
        List<Pokedex> pokemons = stableDiffusionRepository.findAllById(pokemonIds);
        Map<Integer, Pokedex> pokemonMap = pokemons.stream().collect(Collectors.toMap(Pokedex::getId, Function.identity()));

        List<Pokedex> orderedPokemons = new ArrayList<>();
        for (Integer id : pokemonIds) {
            Pokedex pokemon = pokemonMap.get(id);
            if (pokemon != null) {
                orderedPokemons.add(pokemon);
            }
        }
        return orderedPokemons;
    }

    public String generateTextToImage(String prompt, Optional<Long> seed,Optional<String> negativePrompt, int batch_size, int steps) throws JsonProcessingException {
        String txt2imgUrl = "http://127.0.0.1:7861/sdapi/v1/txt2img";

        ResponseEntity<String> response = submitTextToImagePost(txt2imgUrl, prompt, seed, negativePrompt, batch_size, steps);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                System.out.println(jsonNode);

                String image = jsonNode.get("images").get(0).asText();
                String info = jsonNode.get("info").asText();
                JsonNode infoNode = objectMapper.readTree(info);
                String seed2 = infoNode.get("seed").asText();

                return JsonUtils.createJsonResponse(image, seed2, prompt, negativePrompt, steps, objectMapper);

            } catch (Exception e) {
                System.err.println("Error parsing JSON response: " + e.getMessage());
            }
        } else {
            System.err.println("Error: " + response.getStatusCode());
        }
        return null;
    }


    public static ResponseEntity<String> submitTextToImagePost(String url, String prompt, Optional<Long> seed ,Optional<String> negativePrompt, int batch_size, int steps) throws JsonProcessingException, JsonProcessingException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> jsonMap = new HashMap<>();
        jsonMap.put("prompt", prompt);
        jsonMap.put("batch_size", batch_size);
        jsonMap.put("steps", steps);

        if (seed.isPresent()) {
            jsonMap.put("seed", seed.get());
        }

        if (negativePrompt.isPresent()) {
            jsonMap.put("negative_prompt", negativePrompt.get());
        }

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(jsonMap);

        HttpEntity<String> entity = new HttpEntity<>(json, headers);

        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.postForEntity(url, entity, String.class);
    }


    public String generateImageToImage(String image, String prompt, Optional<String> negativePrompt, Integer steps, Long seed) {
        String img2imgUrl = "http://127.0.0.1:7861/sdapi/v1/img2img";
        //Read json.txt file and put it to String json

        ResponseEntity<String> response = submitImageToImagePost(img2imgUrl, image, prompt, negativePrompt, steps, seed);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(response.getBody());

                String image2 = jsonNode.get("images").get(0).asText();
                String info = jsonNode.get("info").asText();
                JsonNode infoNode = objectMapper.readTree(info);
                String seed2 = infoNode.get("seed").asText();

                return JsonUtils.createJsonResponse(image2, seed2, prompt, negativePrompt, steps, objectMapper);


            } catch (Exception e) {
                System.err.println("Error parsing JSON response: " + e.getMessage());
            }
        } else {
            System.err.println("Error: " + response.getStatusCode());
        }
        return null;
    }


    public static ResponseEntity<String> submitImageToImagePost(String url, String image, String prompt, Optional<String> negativePrompt, Integer steps, Long seed) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode jsonNode = objectMapper.createObjectNode();
        ArrayNode initImagesNode = jsonNode.putArray("init_images");
        initImagesNode.add(image);
        jsonNode.put("prompt", prompt);
        jsonNode.put("steps", steps);
        jsonNode.put("seed", seed);

        if (negativePrompt.isPresent()) {
            jsonNode.put("negative_prompt", negativePrompt.get());
        }

        String json = jsonNode.toString();

        HttpEntity<String> entity = new HttpEntity<>(json, headers);

        return restTemplate.postForEntity(url, entity, String.class);
    }

    public Pokedex createPokedex(PoketexRequest pokedexRequest, String username) throws IOException {
        Pokedex pokedex = new Pokedex();

        pokedex.setName(pokedexRequest.getName());
        pokedex.setDescription(pokedexRequest.getDescription());
        pokedex.setPrompt(pokedexRequest.getPrompt());

        if (pokedexRequest.getNegativePrompt() != null && pokedexRequest.getNegativePrompt().isPresent()) {
            pokedex.setNegativePrompt(pokedexRequest.getNegativePrompt().map(Object::toString)
                    .orElse(null));
        }

        pokedex.setSteps(pokedexRequest.getSteps());
        pokedex.setSeed(pokedexRequest.getSeed());
        pokedex.setImage(pokedexRequest.getImage());
        pokedex.setGeneration(0);

        pokedex.setHp(PokemonStatsGenerator.generateHP());
        pokedex.setAttack(PokemonStatsGenerator.generateAttack());
        pokedex.setSpAttack(PokemonStatsGenerator.generateSpecialAttack());
        pokedex.setDefense(PokemonStatsGenerator.generateDefense());
        pokedex.setSpDefense(PokemonStatsGenerator.generateSpecialDefense());
        pokedex.setSpeed(PokemonStatsGenerator.generateSpeed());
        pokedex.setBaseEggSteps(PokemonStatsGenerator.generateBaseEggSteps());
        pokedex.setExperienceGrowth(PokemonStatsGenerator.generateExperienceGrowth());
        pokedex.setBaseTotal(PokemonStatsGenerator.calculateBaseTotal(pokedex.getHp(), pokedex.getAttack(), pokedex.getSpAttack(), pokedex.getSpDefense(), pokedex.getSpeed()));
        pokedex.setAbilities(PokemonStatsGenerator.generateRandomAbilities());
        pokedex.setUsername(username);

        return pokedex;
    }


}

