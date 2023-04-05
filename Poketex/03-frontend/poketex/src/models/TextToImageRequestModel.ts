class TextToImageRequestModel {

    prompt?: string;
    commentDescription?: string;
    steps: number;

    constructor(steps: number, prompt: string, commentDescription?: string) {
        this.steps = steps;
        this.prompt = prompt;
        this.commentDescription = commentDescription;

    }
}

export default TextToImageRequestModel;