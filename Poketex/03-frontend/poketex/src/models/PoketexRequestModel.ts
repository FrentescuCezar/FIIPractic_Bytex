class PoketexRequestModel {

    name: string;
    description: string;
    prompt: string;
    negativePrompt?: string;
    image: string;
    steps: number;
    seed: number;

    constructor(name: string, description: string, prompt: string, image: string, steps: number, seed: number, negativePrompt?: string) {
        this.name = name;
        this.description = description;
        this.prompt = prompt;
        this.image = image;
        this.steps = steps;
        this.seed = seed;
        this.negativePrompt = negativePrompt;
    }
}

export default PoketexRequestModel;