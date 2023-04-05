class TextToImageRequestModel {

    prompt?: string;
    commentDescription?: string;
    steps: number;
    seed?: number;

    constructor(steps: number, prompt: string, seed?: number, commentDescription?: string) {
        this.steps = steps;
        this.seed = seed;
        this.prompt = prompt;
        this.commentDescription = commentDescription;

    }
}

export default TextToImageRequestModel;