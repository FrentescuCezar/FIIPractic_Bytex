import { useEffect, useState, useMemo } from "react";
import PoketexModel from "../../models/PoketexModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { fetchPoketex, postGuess } from "./Api/pokeMysteryApi";
import {
    truncateText,
    maskName,
    maskUsername,
    maskPrompt,
} from "./Utils/pokeMysteryUtils";
import { formatTextWithNewlines } from "./Utils/PokeMysteryUtils2";
import { PokeMysteryDesktop } from "./Components/PokeMysteryDesktop";
import { PokeMysteryMobile } from "./Components/PokeMysteryMobile";

export const PokeMysteryPage = () => {
    const [poketex, setPoketex] = useState<PoketexModel>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState(null);

    const [guess, setGuess] = useState<string>("");

    const [remainingTries, setRemainingTries] = useState<number>(3);
    const [feedbackMessage, setFeedbackMessage] = useState<string>("");
    const [isCorrect, setIsCorrect] = useState<boolean>(false);

    const [maskedName, setMaskedName] = useState<string>("");
    const [maskedUsername, setMaskedUsername] = useState<string>("");
    const [maskedPrompt, setMaskedPrompt] = useState<string>("");

    const [animationKey, setAnimationKey] = useState<number>(0);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const loadedPoketex = await fetchPoketex();
                setPoketex(loadedPoketex);
                setMaskedName(maskName(loadedPoketex.name));
                setMaskedUsername(maskUsername(loadedPoketex.username));
                setMaskedPrompt(maskPrompt(loadedPoketex.prompt));
                setIsLoading(false);
            } catch (error: any) {
                setIsLoading(false);
                setHttpError(error.message);
            }
        };
        fetchData();
    }, []);

    const MAX_LENGTH_DESCRIPTION = 200;
    const truncatedDescription = useMemo(() => truncateText(poketex?.description ?? "No Description", MAX_LENGTH_DESCRIPTION), [poketex?.description]);
    const formattedDescription = useMemo(() => formatTextWithNewlines(truncatedDescription || ""), [truncatedDescription]);


    const handleSubmitGuess = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!poketex || remainingTries <= 0 || isCorrect) return;

        try {
            const result = await postGuess(guess, poketex.id);

            if (result === "Correct!") {
                setIsCorrect(true);
                setMaskedName(poketex.name);
                setMaskedUsername(poketex.username);
                setMaskedPrompt(poketex.prompt);
            } else {
                setRemainingTries(remainingTries - 1);
                if (remainingTries - 1 === 0) {
                    setMaskedName(poketex.name);
                    setMaskedUsername(poketex.username);
                    setMaskedPrompt(poketex.prompt);
                }
            }
            setFeedbackMessage(result);
            setAnimationKey(animationKey + 1);
        } catch (error: any) {
            setFeedbackMessage(`Error: ${error.message}`);
        }
    };

    const guessInputForm = (
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

    const triesAndFeedback = (
        <div className="d-flex justify-content-center">
            <div className="text-center w-15">
                <p>Remaining tries: {remainingTries}</p>
                {feedbackMessage && (
                    <p key={animationKey} className="pulse-animation">
                        {feedbackMessage && (
                            <p className={`alert ${feedbackMessage === "Correct!" ? "alert-success" : "alert-danger"}`}>
                                {feedbackMessage}
                            </p>
                        )}
                    </p>
                )}
            </div>
        </div>
    );


    if (isLoading) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div className="container">
            <PokeMysteryDesktop
                poketex={poketex}
                maskedName={maskedName ?? "?"}
                maskedUsername={maskedUsername ?? "?"}
                maskedPrompt={maskedPrompt ?? "?"}
                formattedDescription={formattedDescription}
                isCorrect={isCorrect}
                remainingTries={remainingTries}
            />
            <PokeMysteryMobile
                poketex={poketex}
                maskedName={maskedName ?? "?"}
                maskedUsername={maskedUsername ?? "?"}
                maskedPrompt={maskedPrompt ?? "?"}
                formattedDescription={formattedDescription}
                isCorrect={isCorrect}
                remainingTries={remainingTries}
            />
            {triesAndFeedback}

            {guessInputForm}
        </div>
    );
};