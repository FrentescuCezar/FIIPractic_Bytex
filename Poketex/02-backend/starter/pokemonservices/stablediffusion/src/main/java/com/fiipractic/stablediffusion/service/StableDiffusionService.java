package com.fiipractic.stablediffusion.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fiipractic.stablediffusion.model.ImageResponse;
import com.fiipractic.stablediffusion.requestmodel.ImageToImageRequest;
import com.fiipractic.stablediffusion.requestmodel.TextToImageRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import org.springframework.web.client.RestTemplate;

@Service
public class StableDiffusionService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String txt2imgUrl;
    private final String img2imgUrl;

    public StableDiffusionService(RestTemplate restTemplate,
                                  ObjectMapper objectMapper,
                                  @Value("${api.base-url.txt2imgUrl}") String txt2imgUrl,
                                  @Value("${api.base-url.img2imgUrl}") String img2imgUrl) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.txt2imgUrl = txt2imgUrl;
        this.img2imgUrl = img2imgUrl;
    }

    public ImageResponse generateTextToImage(TextToImageRequest imageRequest) throws Exception {
        ResponseEntity<String> response = submitRequest(txt2imgUrl, imageRequest);
        return parseResponse(response);
    }

    public ImageResponse generateImageToImage(ImageToImageRequest imageRequest) throws Exception {
        ResponseEntity<String> response = submitRequest(img2imgUrl, imageRequest);
        return parseResponse(response);
    }

    private ResponseEntity<String> submitRequest(String url, Object request) throws JsonProcessingException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String json;
        if (request instanceof ImageToImageRequest) {
            ImageToImageRequest imageRequest = (ImageToImageRequest) request;
            ObjectNode jsonNode = objectMapper.valueToTree(imageRequest);
            ArrayNode initImagesNode = jsonNode.putArray("init_images");
            initImagesNode.add(imageRequest.getImage());
            json = jsonNode.toString();
        } else {
            json = objectMapper.writeValueAsString(request);
        }

        HttpEntity<String> entity = new HttpEntity<>(json, headers);
        return restTemplate.postForEntity(url, entity, String.class);
    }

    private ImageResponse parseResponse(ResponseEntity<String> response) throws Exception {
        if (response.getStatusCode() == HttpStatus.OK) {
            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            String image = jsonNode.get("images").get(0).asText();
            String info = jsonNode.get("info").asText();
            JsonNode infoNode = objectMapper.readTree(info);
            String seed = infoNode.get("seed").asText();

            return new ImageResponse(image, seed);

        } else {
            throw new Exception("Error: " + response.getStatusCode());
        }
    }
}