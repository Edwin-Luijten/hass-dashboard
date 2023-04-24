import { useAudioPlayerContext } from './useAudioContext';
import { useEffect, useRef } from 'react';
import { AudioCanvas } from '../BrowserMod/BrowserModStyle';

const animation = (type: string) => {
    return animateBars
};

function animateBars(
    analyser: AnalyserNode,
    canvas: HTMLCanvasElement,
    canvasCtx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number
) {
    analyser.getByteFrequencyData(dataArray);

    canvasCtx.fillStyle = '#000';

    const HEIGHT = canvas.height / 2;

    const barWidth = Math.ceil(canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * HEIGHT;

        const r = barHeight + 25 * (i / bufferLength);
        const g = HEIGHT * (i / bufferLength);
        const b = 50;

        canvasCtx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}

export function WaveForm() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {playing, analyser} = useAudioPlayerContext();

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!playing || !canvas || !analyser) return;

        analyser.fftSize = 2048;
        const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const animate = () => {
            requestAnimationFrame(animate);

            canvasCtx.translate(0, canvas.offsetHeight / 2 - 115); // Set Y = 0 to be in the middle of the canvas
            animation('')(analyser, canvas, canvasCtx, dataArray, bufferLength);
        };

        animate();
    }, [playing, analyser]);

    return (
        <AudioCanvas ref={canvasRef}></AudioCanvas>
    )
}