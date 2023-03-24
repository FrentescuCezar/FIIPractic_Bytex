package com.fiipractic.chatgpt;

import com.plexpt.chatgpt.ChatGPT;
import com.plexpt.chatgpt.entity.chat.ChatCompletion;
import com.plexpt.chatgpt.entity.chat.ChatCompletionResponse;
import com.plexpt.chatgpt.entity.chat.Message;

import java.util.List;


public class OpenAIApiRequest {
    public static void main(String[] args) {


        ChatGPT chatGPT = ChatGPT.builder()
                .apiKey("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")
                .apiHost("https://api.openai.com/") //Reverse proxy address
                .build()
                .init();

        Message message = Message.of("Provide a one-word answer to describe " +
                "an imaginary creative Pokemon name that has the description: \" hippopotamus\", no explanation" );

        ChatCompletion chatCompletion = ChatCompletion.builder()
                .model(ChatCompletion.Model.GPT_3_5_TURBO.getName())
                .messages(List.of(message))
                .maxTokens(30)
                .temperature(0.9)
                .build();
        ChatCompletionResponse response = chatGPT.chatCompletion(chatCompletion);
        Message res = response.getChoices().get(0).getMessage();
        System.out.println(res.getContent());

    }
}