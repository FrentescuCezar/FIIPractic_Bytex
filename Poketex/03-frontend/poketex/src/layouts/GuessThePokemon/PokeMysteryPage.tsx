import { useEffect, useState, useMemo } from "react";
import PoketexModel from "../../models/PoketexModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { fetchPoketex, postGuess } from "./Api/pokeMysteryApi";
import {
    truncateText,
    maskName,
    maskPrompt,
} from "./Utils/pokeMysteryUtils";
import { formatTextWithNewlines } from "./Utils/PokeMysteryUtils2";
import { PokeMysteryDesktop } from "./Components/PokeMysteryDesktop";
import { PokeMysteryMobile } from "./Components/PokeMysteryMobile";
import { RemainedTries } from "./Components/RemainedTries";
import { GuessInputForm } from "./Components/GuessInputForm";



export const PokeMysteryPage = () => {



    const [poketex, setPoketex] = useState<PoketexModel>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState(null);

    const [guess, setGuess] = useState<string>("");

    const [remainingTries, setRemainingTries] = useState<number>(3);
    const [feedbackMessage, setFeedbackMessage] = useState<string>("");
    const [isCorrect, setIsCorrect] = useState<boolean>(false);

    const [maskedName, setMaskedName] = useState<string>("");
    const [maskedPrompt, setMaskedPrompt] = useState<string>("");

    const [animationKey, setAnimationKey] = useState<number>(0);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const loadedPoketex = await fetchPoketex();
                setPoketex(loadedPoketex);
                setMaskedName(maskName(loadedPoketex.name));
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
                setMaskedPrompt(poketex.prompt);
            } else {
                setRemainingTries(remainingTries - 1);
                if (remainingTries - 1 === 0) {
                    setMaskedName(poketex.name);
                    setMaskedPrompt(poketex.prompt);
                }
            }
            setFeedbackMessage(result);
            setAnimationKey(animationKey + 1);
        } catch (error: any) {
            setFeedbackMessage(`Error: ${error.message}`);
        }
    };


    const refreshPokemon = async () => {
        setIsLoading(true);
        try {
            const loadedPoketex = await fetchPoketex();
            setPoketex(loadedPoketex);
            setMaskedName(maskName(loadedPoketex.name));
            setMaskedPrompt(maskPrompt(loadedPoketex.prompt));
            setRemainingTries(3);
            setIsCorrect(false);
            setFeedbackMessage("");
            setGuess("");
            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            setHttpError(error.message);
        }
    };



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
                maskedPrompt={maskedPrompt ?? "?"}
                formattedDescription={formattedDescription}
                isCorrect={isCorrect}
                remainingTries={remainingTries}
            />
            <PokeMysteryMobile
                poketex={poketex}
                maskedName={maskedName ?? "?"}
                maskedPrompt={maskedPrompt ?? "?"}
                formattedDescription={formattedDescription}
                isCorrect={isCorrect}
                remainingTries={remainingTries}
            />
            <RemainedTries remainingTries={remainingTries} feedbackMessage={feedbackMessage} animationKey={animationKey} />
            <GuessInputForm guess={guess} handleSubmitGuess={handleSubmitGuess} setGuess={setGuess} refreshPokemon={refreshPokemon} />
        </div>
    );
};