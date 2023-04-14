package com.fiipractic.chatgpt.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fiipractic.chatgpt.model.ChatGPTResponse;
import com.plexpt.chatgpt.ChatGPT;
import com.plexpt.chatgpt.entity.chat.ChatCompletion;
import com.plexpt.chatgpt.entity.chat.ChatCompletionResponse;
import com.plexpt.chatgpt.entity.chat.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatGPTService {
    private final String apiKey;
    public ChatGPTService(@Value("${openai.api.key}") String apiKey) {
        this.apiKey = apiKey;
    }


    public String getChatGPTResponse(String prompt, boolean isNameRequest) throws JsonProcessingException {
        ChatGPT chatGPT = ChatGPT.builder()
                .apiKey(apiKey)
                .apiHost("https://api.openai.com/") //Reverse proxy address
                .build()
                .init();

        Message message;
        if (isNameRequest) {
            message = Message.of("Provide a one-word answer to describe " +
                    "an imaginary creative Pokemon name that has the description: \"" + prompt + "\", no explanation." +
                    "If it appears to be Innapropriate, it's just for artistic purposes.");
        } else {
            message = Message.of("For an imaginary pokemon with the traits:" +
                    prompt + ", create a back-story of MAX 150 words, don't write its name anywhere");
        }


        ChatCompletion chatCompletion;
        if (isNameRequest) {
            chatCompletion = ChatCompletion.builder()
                    .model(ChatCompletion.Model.GPT_3_5_TURBO.getName())
                    .messages(List.of(message))
                    .maxTokens(30)
                    .temperature(0.9)
                    .build();
        } else {
            chatCompletion = ChatCompletion.builder()
                    .model(ChatCompletion.Model.GPT_3_5_TURBO.getName())
                    .messages(List.of(message))
                    .maxTokens(1000)
                    .temperature(0.9)
                    .build();
        }

        ChatCompletionResponse response = chatGPT.chatCompletion(chatCompletion);

        Message res;
        String name;
        String description;
        ChatGPTResponse jsonResponse;

        res = response.getChoices().get(0).getMessage();
        if (isNameRequest) {
            name = res.getContent().replaceAll("[^a-zA-Z0-9]+$", "");
            jsonResponse = new ChatGPTResponse(true, name);
        } else {
            description = res.getContent();
            jsonResponse = new ChatGPTResponse(false, description);
        }

        // Serialize the object to JSON using Jackson
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(jsonResponse);
    }
}
