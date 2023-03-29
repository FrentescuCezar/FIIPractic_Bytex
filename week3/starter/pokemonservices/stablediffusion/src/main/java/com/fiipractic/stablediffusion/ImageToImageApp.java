package com.fiipractic.stablediffusion;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


public class ImageToImageApp {

    public static String readJsonFile(String filePath) {
        StringBuilder jsonContent = new StringBuilder();

        try (BufferedReader bufferedReader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                jsonContent.append(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return jsonContent.toString();
    }

    public static void main(String[] args) {
        String img2imgUrl = "http://127.0.0.1:7861/sdapi/v1/img2img";
        //Read json.txt file and put it to String json

        String jsonFilePath = "json.txt";
        String json = readJsonFile(jsonFilePath);


        ResponseEntity<String> response = submitPost(img2imgUrl, json);

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

    public static ResponseEntity<String> submitPost(String url, String json){
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

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