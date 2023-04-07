import React from "react";
import { postGuess } from "../Api/pokeMysteryApi";


export function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
    } else {
        return text;
    }
}


export function maskString(input: string, probability: number = 0.5): string {
    let output = input.replace(/[a-zA-Z0-9]/g, (char) => {
        return Math.random() < probability ? "?" : char;
    });
    if (!output.includes("?")) {
        const position = Math.floor(Math.random() * (output.length + 1));
        output = output.slice(0, position) + "?" + output.slice(position);
    }
    return output;
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
