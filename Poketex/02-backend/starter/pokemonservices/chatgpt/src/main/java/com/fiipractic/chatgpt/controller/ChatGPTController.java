package com.fiipractic.chatgpt.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fiipractic.chatgpt.service.ChatGPTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController

@CrossOrigin(origins = "http://localhost:3000")
public class ChatGPTController {

    private final ChatGPTService chatGPTService;
    @Autowired
    public ChatGPTController(ChatGPTService chatGPTService) {
        this.chatGPTService = chatGPTService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/name")
    public String createName(@RequestParam(value = "prompt") String prompt) throws JsonProcessingException {
        return chatGPTService.getChatGPTResponse(prompt, true);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/description")
    public String createDescription(@RequestParam(value = "prompt") String prompt) throws JsonProcessingException {
        return chatGPTService.getChatGPTResponse(prompt, false);
    }

}
