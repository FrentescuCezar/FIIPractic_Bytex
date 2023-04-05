import React from "react";
import SilhouetteImage from "../Utils/SilhouetteImage";
import { Link } from "react-router-dom";

interface PokeMysteryMobileProps {
    poketex: any;
    maskedName: string;
    maskedPrompt: string;
    formattedDescription: React.ReactNode;
    isCorrect: boolean;
    remainingTries: number;
}

export const PokeMysteryMobile: React.FC<PokeMysteryMobileProps> = ({
    poketex,
    maskedName,
    maskedPrompt,
    formattedDescription,
    isCorrect,
    remainingTries,
}) => {

    const showNormalImage = isCorrect || remainingTries === 0;


    return (
        <div className="container d-lg-none mt-5 d-flex flex-column align-items-center">
            <div className="d-flex flex-column align-items-center">
                {showNormalImage ? (
                    <Link to={`/pokemon/${poketex.id}`}>
                        <img
                            src={`data:image/png;base64,${poketex.image}`}
                            width="256"
                            height="256"
                            alt="Pokemon"
                        />
                    </Link>
                ) : (
                    <SilhouetteImage
                        imageUrl={`data:image/png;base64,${poketex.image}`}
                        customHeight={256}
                        customWidth={256}
                    />

                )}
                <div className="d-flex flex-column align-items-center">
                    <div className="text-center">
                        <h2>{maskedName}</h2>
                        <h6>"{maskedPrompt}"</h6>
                        <p className="lead">{formattedDescription}</p>
                    </div>
                </div>
            </div>
            <hr className="mt-4 mb-0" />
        </div>
    );
};