import { useState, useEffect } from "react";
import ImageRequestModel from "../../models/TextToImageRequestModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import PoketexRequestModel from "../../models/PoketexRequestModel";

import image from "../../Images/PublicImages/MonBuilderImage.png"

import { useOktaAuth } from '@okta/okta-react';

import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { useHistory } from "react-router-dom";



export const MonBuilderPage = () => {

    const { authState } = useOktaAuth();

    const history = useHistory();



    const [steps, setSteps] = useState(20);
    const [prompt, setPrompt] = useState("");
    const [seedInput, setSeedInput] = useState("");
    const [negativePrompt, setNegativePrompt] = useState("");
    const [finalPrompt, setFinalPrompt] = useState("");
    const [finalSteps, setFinalSteps] = useState(20);



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
        setFinalSteps(steps)
        setPokemonDescription("");
        setPokemonName("");
        submitPrompt(steps, prompt, seedInput ? parseInt(seedInput) : undefined, negativePrompt);
    };


    console.log(pokemonDescription)


    async function submitPokemon(name: string, description: string, prompt: string, image: string, steps: number, seed: number, generation: number, negativePrompt?: string, parent1?: number, parent2?: number) {

        const poketexRequestModel = new PoketexRequestModel(name, description, prompt, image, steps, seed, generation, negativePrompt, parent1, parent2);

        const url = `http://localhost:8084/api/create`;
        const requestOptons = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(poketexRequestModel)
        };
        try {
            const response = await fetch(url, requestOptons);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            // Show success alert
            alert('Pokemon successfully created!');

            // Redirect to /home
            history.push('/home');
        } catch (error) {
            console.error(error);
            alert('Failed to create Pokemon. Please try again.');
        }

    }



    return (
        <div className='my-5'>
            <Container>
                <Row>
                    <Col>
                        <Form>
                            <Form.Group controlId="prompt">
                                <Form.Label>Prompt:</Form.Label>
                                <Form.Control as="textarea" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="negativePrompt">
                                <Form.Label>Negative Prompt (optional):</Form.Label>
                                <Form.Control as="textarea" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="seed">
                                <Form.Label>Seed (optional):</Form.Label>
                                <Form.Control as="textarea" value={seedInput} onChange={(e) => setSeedInput(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="steps">
                                <Form.Label>Steps: {steps}</Form.Label>
                                <Form.Control
                                    type="range"
                                    min="20"
                                    max="50"
                                    value={steps}
                                    onChange={(e) => setSteps(Number(e.target.value))}
                                    className="custom-slider"
                                />
                            </Form.Group>
                            {error && <p className="text-danger">{error}</p>}
                            <Button onClick={handleSubmit} disabled={isImageLoading}>
                                {isImageLoading ? "Generating..." : "Generate Pokemon"}
                            </Button>
                            {isImageLoading && (
                                <div className="d-inline-block ml-2">
                                    <SpinnerLoading />
                                </div>
                            )}
                        </Form>
                        {imageData && (
                            <>
                                <div className="my-5">
                                    <Button onClick={() => fetchPokemonName(finalPrompt)} disabled={isNameLoading}>
                                        {isNameLoading ? "Generating Name..." : "Generate Name"}
                                    </Button>
                                    {isNameLoading ? (
                                        <div className="mt-2">
                                            <SpinnerLoading />
                                        </div>
                                    ) : (
                                        pokemonName && <p>Pokemon Name: {pokemonName}</p>
                                    )}
                                </div>

                                <div className="my-5">
                                    <Button onClick={() => fetchPokemonDescription(finalPrompt)} disabled={isDescriptionLoading}>
                                        {isDescriptionLoading ? "Generating Description..." : "Generate Description"}
                                    </Button>
                                    {isDescriptionLoading && (
                                        <div className="mt-2">
                                            <SpinnerLoading />
                                        </div>
                                    )}
                                    {pokemonDescription && <p>Pokemon Description: {pokemonDescription}</p>}
                                    {pokemonName && pokemonDescription && (
                                        <Button
                                            onClick={() => submitPokemon(pokemonName, pokemonDescription, finalPrompt, imageData, finalSteps, seed, generation, negativePrompt)}
                                        >
                                            Submit Pokemon
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                    </Col>
                    <Col md={6} className="text-center" order={{ md: 2 }}>
                        {imageData ? (
                            <div>
                                <img
                                    src={`data:image/png;base64,${imageData}`}
                                    alt="Generated Pokemon"
                                    className="pokemon-image"
                                />
                                {imageData && (
                                    <>
                                        <p>Seed: {seed}</p>
                                        <p>Prompt: {finalPrompt}</p>
                                        <p>Steps: {steps}</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div>
                                <h3>Design your own Pokemon!</h3>
                                <img src={image} alt="Placeholder" className="pokemon-image" />
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>

    );
};


export default MonBuilderPage;
