import React from 'react';

interface GuessInputFormProps {
    guess: string;
    handleSubmitGuess: (event: React.FormEvent) => Promise<void>;
    setGuess: (value: string) => void;
}

export const GuessInputForm: React.FC<GuessInputFormProps> = ({ guess, handleSubmitGuess, setGuess }) => {
    return (
        <div className="d-flex justify-content-center">
            <form onSubmit={handleSubmitGuess} className="guess-form">
                <label htmlFor="guess-input" className="form-label">
                    Type your Guess here:
                </label>
                <input
                    type="text"
                    id="guess-input"
                    className="form-control"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="The name or a word from the Prompt"
                    pattern="^[^,\s]+$"
                    title="plz enter only one word with no spaces or commas."
                    required
                />
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary mt-2">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};