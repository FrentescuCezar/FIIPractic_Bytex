import React from "react";
import SilhouetteImage from "../Utils/SilhouetteImage";
import { Link } from "react-router-dom";

interface PokeMysteryDesktopProps {
    poketex: any;
    maskedName: string;
    maskedPrompt: string;
    formattedDescription: React.ReactNode;
    isCorrect: boolean;
    remainingTries: number;
}

export const PokeMysteryDesktop: React.FC<PokeMysteryDesktopProps> = ({
    poketex,
    maskedName,
    maskedPrompt,
    formattedDescription,
    isCorrect,
    remainingTries,
}) => {

    const showNormalImage = isCorrect || remainingTries === 0;

    return (
        <div className="container d-none d-lg-block">
            <div className=" mt-5 d-flex flex-column align-items-center justify-content-center">
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
                <div className="mt-3 text-center">
                    <h1>{maskedName}</h1>
                    <h6>"{maskedPrompt}"</h6>
                </div>

                <div className="col-4 col-md-7 container">
                    <div className="ml-2 text-center">
                        <p className="lead">{formattedDescription}</p>
                    </div>
                </div>
                <hr />
            </div>
        </div >
    );
};