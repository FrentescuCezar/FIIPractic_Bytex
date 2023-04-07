import { useState, useEffect } from "react";
import { useOktaAuth } from '@okta/okta-react';
import { useHistory } from "react-router-dom";

import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { SpinnerLoading } from "../Utils/SpinnerLoading";

import { submitPrompt, fetchPokemonName, fetchPokemonDescription, submitPokemon } from "./Api/MonBuilderApi";


import image from "../../Images/PublicImages/MonBuilderImage.png"


export const MonBuilderPage = () => {

    const { authState } = useOktaAuth();
    const history = useHistory();


    // Prompt and steps states
    const [prompt, setPrompt] = useState("");
    const [steps, setSteps] = useState(20);
    const [seedInput, setSeedInput] = useState("");
    const [negativePrompt, setNegativePrompt] = useState("");

    // Final prompt and steps states
    const [finalPrompt, setFinalPrompt] = useState("");
    const [finalSteps, setFinalSteps] = useState(20);

    // Generated image states
    const [imageData, setImageData] = useState("");
    const [seed, setSeed] = useState(0);
    const generation = 0;

    // Pokemon name and description states
    const [pokemonName, setPokemonName] = useState("");
    const [pokemonDescription, setPokemonDescription] = useState("");

    // Loading states
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isNameLoading, setIsNameLoading] = useState(false);
    const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);

    const [error, setError] = useState("");










    const handleSubmit = () => {
        if (!prompt) {
            setError("Prompt is required.");
            return;
        }
        setError("");
        setFinalPrompt(prompt);
        setFinalSteps(steps);
        setPokemonDescription("");
        setPokemonName("");
        submitPrompt(
            steps,
            prompt,
            setIsImageLoading,
            setImageData,
            setSeed,
            seedInput ? parseInt(seedInput) : undefined,
            negativePrompt
        );
    };


    console.log(pokemonDescription)



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
                                    <Button onClick={() => fetchPokemonName(finalPrompt, setIsNameLoading, setPokemonName)} disabled={isNameLoading}>
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
                                    <Button onClick={() => fetchPokemonDescription(
                                        finalPrompt,
                                        setIsDescriptionLoading,
                                        setPokemonDescription
                                    )} disabled={isDescriptionLoading}>
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
                                            onClick={() => submitPokemon(
                                                pokemonName,
                                                pokemonDescription,
                                                finalPrompt,
                                                imageData,
                                                finalSteps,
                                                seed,
                                                generation,
                                                authState,
                                                history,
                                                negativePrompt
                                            )}
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
