import React, { useRef, useEffect } from 'react';

interface SilhouetteImageProps {
    imageUrl: string;
    customHeight?: number;
    customWidth?: number;
}

const SilhouetteImage: React.FC<SilhouetteImageProps> = ({ imageUrl, customHeight, customWidth }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;


            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = imageUrl;

            img.onload = () => {
                const imgWidth = customWidth || img.width;
                const imgHeight = customHeight || img.height;
                canvas.width = imgWidth;
                canvas.height = imgHeight;

                ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

                const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    if (r > 150 && g > 150 && b > 150) {
                        data[i] = data[i + 1] = data[i + 2] = 255;
                        data[i + 3] = 0;
                    } else {
                        data[i] = data[i + 1] = data[i + 2] = 0;
                    }
                }

                ctx.imageSmoothingEnabled = true; // Enable anti-aliasing

                ctx.putImageData(imageData, 0, 0);
            };
        }
    }, [canvasRef, imageUrl, customHeight, customWidth]); // Added imageUrl to the dependency array

    return <canvas ref={canvasRef} />;
};

export default SilhouetteImage;