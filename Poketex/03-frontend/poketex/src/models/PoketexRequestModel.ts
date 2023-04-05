class PoketexRequestModel {

    name: string;
    description: string;
    prompt: string;
    negativePrompt?: string;
    parent1?: number;
    parent2?: number;
    generation: number;
    image: string;
    steps: number;
    seed: number;

    constructor(name: string, description: string, prompt: string, image: string, steps: number, seed: number, generation:number, negativePrompt?: string, parent1?: number, parent2?: number) {
        this.name = name;
        this.description = description;
        this.prompt = prompt;
        this.image = image;
        this.steps = steps;
        this.seed = seed;
        this.negativePrompt = negativePrompt;
        this.parent1 = parent1;
        this.parent2 = parent2;
        this.generation = generation;
    }
}

export default PoketexRequestModel;