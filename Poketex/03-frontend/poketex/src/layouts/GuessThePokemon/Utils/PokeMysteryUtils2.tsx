import React from 'react';

export function formatTextWithNewlines(text: string) {
    return text.split('\n').map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));
}