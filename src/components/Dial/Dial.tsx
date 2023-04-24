import { useCallback, useEffect, useRef, useState } from 'react';
import { DialRoot, DialWrapper, Handle, Indicator, Progress, Value, Knob } from './DialStyle';
import { Typography } from '@mui/material';

type KnobProps = {
    title: string;
    value: number;
    steps: number;
    end?: number;
    onChange: (value: number) => void;
    children?: JSX.Element | JSX.Element[] | string | number;
}

function roundHalf(num: number) {
    return Math.round(num);
}

export function Dial(props: KnobProps) {
    const [currentValue, setCurrentValue] = useState<number>(props.value);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
    const knobRef = useRef<HTMLDivElement | null>(null);
    const handleRef = useRef<HTMLDivElement | null>(null);
    const canvasWidth = useRef<number>(0);
    const knobPosition = useRef({x: 0, y: 0});
    const center = useRef({x: 0, y: 0});
    const target = useRef(0);
    const steps = props.steps;
    const radius = 150;
    const maxDiff = 150;
    const constraint = 360;

    const draw = useCallback(() => {
        if (!canvasRef.current || !canvasContextRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        let i, j, ref;

        canvas.width = 350
        canvas.height = 350;

        ctx.save();
        ctx.translate(175, 175);
        ctx.rotate(((-90 * (Math.PI / 180)) - (Math.PI * 2 / steps)));

        for (i = j = 0, ref = steps - 1; j <= ref; i = j += 1) {
            ctx.beginPath();
            ctx.rotate(Math.PI * 2 / steps);
            ctx.lineWidth = 2;
            ctx.lineTo(160, 0);
            ctx.lineTo(170, 0);

            if (i <= Math.floor(currentValue)) {
                ctx.shadowBlur = 10;
                ctx.strokeStyle = '#fff';
                ctx.shadowColor = '#fff';

                if (i > (steps * 0.75) && currentValue > (steps * 0.75)) {
                    ctx.strokeStyle = '#ff9306';
                    ctx.shadowColor = '#ff9306';
                }

                if (i > (steps * 0.88) && currentValue > (steps * 0.88)) {
                    ctx.strokeStyle = '#ff0606';
                    ctx.shadowColor = '#ff0606';
                }
            } else {
                ctx.strokeStyle = '#444';
                ctx.shadowBlur = 0;
                ctx.shadowColor = '#fff';
            }
            ctx.stroke();
        }
        ctx.restore();
    }, [currentValue]);

    const setDialPosition = useCallback(() => {
        if (!knobRef.current || !handleRef.current) return;

        knobRef.current.style.transform = `rotate(${target.current}deg)`;
        handleRef.current.style.transform = `rotate(-${target.current}deg)`;

        draw();
    }, [draw]);

    const updateMouseMove = useCallback((e: MouseEvent) => {
        if (!canvasRef.current) {
            console.log('no canvas current');
            return;
        }

        const bounding = canvasRef.current.getBoundingClientRect();
        const x = e.pageX - bounding.left;
        const y = e.pageY - bounding.top;

        let atan, diff, t;

        atan = Math.atan2(x - radius, y - radius);
        t = -atan / (Math.PI / 180) + 180;
        diff = Math.abs(t - target.current);

        if (diff < maxDiff && t < constraint) {
            target.current = t;
            setCurrentValue(roundHalf(map(target.current, 0, 360, 0, steps)));
            setDialPosition();
        }
    }, [setDialPosition, setCurrentValue]);

    const map = (value: number, low1: number, high1: number, low2: number, high2: number) => {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

    const updateToucheMove = useCallback((e: TouchEvent) => {
        e.preventDefault();

        if (!canvasRef.current) {
            console.log('no canvas current');
            return;
        }

        const bounding = canvasRef.current.getBoundingClientRect();
        const x = e.touches[0].clientX - bounding.left;
        const y = e.touches[0].clientY - bounding.top;

        let atan, diff, t;

        atan = Math.atan2(x - radius, y - radius);
        t = -atan / (Math.PI / 180) + 180;
        diff = Math.abs(t - target.current);

        if (diff < maxDiff && t < constraint) {
            target.current = t;
            setCurrentValue(roundHalf(map(target.current, 0, 360, 0, steps)));
            setDialPosition();
        }
    }, [setCurrentValue, setDialPosition])

    const onRelease = useCallback(() => {
        props.onChange(currentValue);
    }, [currentValue, props]);

    useEffect(() => {
        if (!canvasRef.current) return;

        canvasContextRef.current = canvasRef.current.getContext('2d');
        canvasRef.current.addEventListener('mousemove', updateMouseMove);
        canvasRef.current.addEventListener('mouseup', onRelease);
        canvasRef.current.addEventListener('touchmove', updateToucheMove);
        canvasRef.current.addEventListener('touchend', onRelease);

        knobPosition.current = {
            x: knobRef.current?.offsetLeft ?? 0,
            y: knobRef.current?.offsetTop ?? 0,
        }

        center.current = {
            x: canvasRef.current.width / 2,
            y: canvasRef.current.height / 2,
        }

        canvasWidth.current = canvasRef.current.width;

        setDialPosition();

        return () => {
            window.removeEventListener('mousemove', updateMouseMove);
            window.removeEventListener('mouseup', onRelease);
            window.removeEventListener('touchmove', updateToucheMove);
            window.removeEventListener('touchend', onRelease);
        }
    }, [setDialPosition, updateMouseMove, updateToucheMove, draw, onRelease]);

    return (
        <DialRoot>
            <Value><span><Typography variant="h2">{currentValue}</Typography></span></Value>
            <DialWrapper>
                <Knob ref={knobRef}>
                    <Handle ref={handleRef}/>
                    <Indicator/>
                </Knob>
            </DialWrapper>
            <Progress ref={canvasRef}/>
        </DialRoot>
    )
}