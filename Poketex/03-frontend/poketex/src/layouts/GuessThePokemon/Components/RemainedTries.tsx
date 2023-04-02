import React from 'react';

interface RemainedTriesProps {
    remainingTries: number;
    feedbackMessage: string;
    animationKey: number;
}

export const RemainedTries: React.FC<RemainedTriesProps> = ({ remainingTries, feedbackMessage, animationKey }) => {
    return (
        <div className="d-flex justify-content-center">
            <div className="text-center w-15">
                <p>Remaining tries: {remainingTries}</p>
                {feedbackMessage && (
                    <div key={animationKey} className="pulse-animation">
                        {feedbackMessage && (
                            <p className={`alert ${feedbackMessage === "Correct!" ? "alert-success" : "alert-danger"}`}>
                                {feedbackMessage}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};