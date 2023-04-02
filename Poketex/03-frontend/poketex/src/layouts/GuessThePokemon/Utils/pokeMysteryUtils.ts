import React from "react";
import { postGuess } from "../Api/pokeMysteryApi";


export function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
    } else {
        return text;
    }
}


export function maskString(input: string, probability: number = 0.69): string {
    return input.replace(/[a-zA-Z0-9]/g, (char) => {
        return Math.random() < probability ? "?" : char;
    });
}

export function maskName(name: string): string {
    return maskString(name);
}


export function maskUsername(username: string): string {
    return maskString(username);
}

export function maskPrompt(prompt: string): string {
    return maskString(prompt);
}
