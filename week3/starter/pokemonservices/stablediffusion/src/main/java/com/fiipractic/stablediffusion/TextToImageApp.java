package com.fiipractic.stablediffusion;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fiipractic.pokemoncatalog.model.Pokedex;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;

public class TextToImageApp {

    public static void main(String[] args) {
        String txt2imgUrl = "http://127.0.0.1:7861/sdapi/v1/txt2img";
        String prompt = "Goku";
        String negativePrompt = "";
        ResponseEntity<String> response = submitPost(txt2imgUrl, prompt, negativePrompt, 1);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(response.getBody());

                // Print every image from the response

                for (int i = 0; i < jsonNode.get("images").size(); i++) {
                    String b64Image = jsonNode.get("images").get(i).asText();
                    saveEncodedImage(b64Image, "dog" + i + ".png");
                }

            } catch (Exception e) {
                System.err.println("Error parsing JSON response: " + e.getMessage());
            }
        } else {
            System.err.println("Error: " + response.getStatusCode());
        }
    }

    public static ResponseEntity<String> submitPost(String url, String prompt, String negativePrompt, int batch_size){
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String json = "{\"prompt\": \"" + prompt + "\", " +
                "\"negative_prompt\": \"" + negativePrompt + "\", " +
                "\"batch_size\": \"" + batch_size + "\" }";

        HttpEntity<String> entity = new HttpEntity<>(json, headers);

        return restTemplate.postForEntity(url, entity, String.class);
    }

    public static void saveEncodedImage(String b64Image, String outputPath) {
        try {

            //ImageSaver imageSaver = new ImageSaver();
            //imageSaver.saveEncodedImage(b64Image, "hey");

            //byte[] decodedBytes = Base64.getDecoder().decode(b64Image);
            //Files.write(Paths.get(outputPath), decodedBytes);
        } catch (Exception e) {
            System.err.println("Error saving image: " + e.getMessage());
        }
    }
}