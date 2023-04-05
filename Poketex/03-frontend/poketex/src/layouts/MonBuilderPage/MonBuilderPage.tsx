import { useState, useEffect } from "react";
import ImageRequestModel from "../../models/TextToImageRequestModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import PoketexRequestModel from "../../models/PoketexRequestModel";

import { useOktaAuth } from '@okta/okta-react';


export const MonBuilderPage = () => {

    const { authState } = useOktaAuth();


    const [steps, setSteps] = useState(20);
    const [prompt, setPrompt] = useState("");
    const [seedInput, setSeedInput] = useState("");
    const [negativePrompt, setNegativePrompt] = useState("");
    const [finalPrompt, setFinalPrompt] = useState("");



    const [imageData, setImageData] = useState("");
    const [seed, setSeed] = useState(0);
    const generation = 0;


    // 2 Buttons
    const [pokemonName, setPokemonName] = useState("");
    const [pokemonDescription, setPokemonDescription] = useState("");



    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isNameLoading, setIsNameLoading] = useState(false);
    const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
    const [error, setError] = useState("");




    // Image generation
    async function submitPrompt(steps: number, prompt: string, seed?: number, negativePrompt?: string) {
        setIsImageLoading(true);
        const imageRequestModel = new ImageRequestModel(steps, prompt, seed, negativePrompt);
        const url = `http://localhost:8084/api/trial`;
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(imageRequestModel),
        };

        try {
            const response = await fetch(url, requestOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            setImageData(data.image);
            setSeed(data.seed);
        } catch (error) {
            console.error(error);
        } finally {
            setIsImageLoading(false);
        }
    }




    // Name generation
    async function fetchPokemonName(prompt: string) {
        setIsNameLoading(true);
        const url = `http://localhost:8088/name?prompt=${encodeURIComponent(prompt)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            setPokemonName(data.name);
        } catch (error) {
            console.error(error);
        } finally {
            setIsNameLoading(false);
        }
    }








    // Description generation
    async function fetchPokemonDescription(prompt: string) {
        setIsDescriptionLoading(true);
        const url = `http://localhost:8088/description?prompt=${encodeURIComponent(prompt)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            setPokemonDescription(data.description);
        } catch (error) {
            console.error(error);
        } finally {
            setIsDescriptionLoading(false);
        }
    }




    const handleSubmit = () => {
        if (!prompt) {
            setError("Prompt is required.");
            return;
        }
        setError("");
        setFinalPrompt(prompt);
        setPokemonDescription("");
        setPokemonName("");
        submitPrompt(steps, prompt, seedInput ? parseInt(seedInput) : undefined, negativePrompt);
    };


    console.log(pokemonDescription)


    async function submitPokemon(name: string, description: string, prompt: string, image: string, steps: number, seed: number, generation: number, negativePrompt?: string, parent1?: number, parent2?: number) {


        const poketexRequestModel = new PoketexRequestModel(name, description, prompt, image, steps, seed, generation, negativePrompt, parent1, parent2);

        console.log(poketexRequestModel)

        const url = `http://localhost:8084/api/create`;
        const requestOptons = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(poketexRequestModel)
        };
        const response = await fetch(url, requestOptons);
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
    }




    return (
        <div>
            <div>
                <label htmlFor="prompt">Prompt:</label>
                <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            </div>
            <div>
                <label htmlFor="negativePrompt">Negative Prompt (optional):</label>
                <textarea
                    id="negativePrompt"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="seed">Seed (optional):</label>
                <textarea
                    id="seed"
                    value={seedInput}
                    onChange={(e) => setSeedInput(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="steps">Steps: {steps}</label>
                <input
                    id="steps"
                    type="range"
                    min="20"
                    max="50"
                    value={steps}
                    onChange={(e) => setSteps(Number(e.target.value))}
                />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleSubmit} disabled={isImageLoading}>
                {isImageLoading ? "Generating..." : "Generate Pokemon"}
            </button>
            {imageData && (
                <div>
                    <h3>Generated Pokemon</h3>
                    <img src={`data:image/png;base64,${imageData}`} alt="Generated Pokemon" />
                    <p>Seed: {seed}</p>
                    <p>Prompt: {prompt}</p>
                    <p>Steps: {steps}</p>
                    <button onClick={() => fetchPokemonName(finalPrompt)} disabled={isNameLoading}>
                        {isNameLoading ? "Generating Name..." : "Generate Name"}
                    </button>
                    {pokemonName && <p>Pokemon Name: {pokemonName}</p>}
                    <button onClick={() => fetchPokemonDescription(finalPrompt)} disabled={isDescriptionLoading}>
                        {isDescriptionLoading ? "Generating Description..." : "Generate Description"}
                    </button>
                    {pokemonDescription && <p>Pokemon Description: {pokemonDescription}</p>}

                    {pokemonName && pokemonDescription && (
                        <button
                            onClick={() => submitPokemon(pokemonName, pokemonDescription, finalPrompt, imageData, steps, seed, generation, negativePrompt)}
                        >
                            Submit Pokemon
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MonBuilderPage;

