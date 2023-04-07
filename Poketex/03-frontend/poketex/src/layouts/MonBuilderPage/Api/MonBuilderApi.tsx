import ImageRequestModel from '../../../models/TextToImageRequestModel'
import PoketexRequestModel from '../../../models/PoketexRequestModel'



// Image generation
export async function submitPrompt(
    steps: number,
    prompt: string,
    setIsImageLoading: (loading: boolean) => void,
    setImageData: (data: string) => void,
    setSeed: (seed: number) => void,
    seed?: number,
    negativePrompt?: string
) {
    setIsImageLoading(true);
    const imageRequestModel = new ImageRequestModel(steps, prompt, seed, negativePrompt);
    const url = `http://localhost:8081/api/textToImage`;
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
export async function fetchPokemonName(
    prompt: string,
    setIsNameLoading: (loading: boolean) => void,
    setPokemonName: (name: string) => void
) {
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
export async function fetchPokemonDescription(
    prompt: string,
    setIsDescriptionLoading: (loading: boolean) => void,
    setPokemonDescription: (description: string) => void
) {
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

export async function submitPokemon(
    name: string,
    description: string,
    prompt: string,
    image: string,
    steps: number,
    seed: number,
    generation: number,
    authState: any,
    history: any,
    negativePrompt?: string,
    parent1?: number,
    parent2?: number
) {
    const poketexRequestModel = new PoketexRequestModel(name, description, prompt, image, steps, seed, generation, negativePrompt, parent1, parent2);

    const url = `http://localhost:8084/api/poketex/create`;
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