import { useEffect, useRef, useState } from 'react';
import { AudioPlayerContext } from './useAudioContext';
import { WaveForm } from './WaveForm';

type AudioPlayerProps = {
    onEnd: () => void;
    track: {
        title: string;
        src: string;
    } | undefined;
};

export function AudioPlayer(props: AudioPlayerProps) {
    const [analyser, setAnalyser] = useState<AnalyserNode>();
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(new Audio());

    audioRef.current.onloadedmetadata = () => {
        try {
            audioRef.current.play();

            setPlaying(true);
        } catch (e: any) {
            alert(e.message);
        }
    };

    useEffect(() => {
        if (!props.track) return;

        setPlaying(false);
        audioRef.current.pause();

        const audio = (audioRef.current = new Audio());

        let ctx = new AudioContext();
        const source = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();

        source?.connect(analyser);
        analyser?.connect(ctx.destination);
        setAnalyser(analyser);

        audio.crossOrigin = 'anonymous';
        audio.src = props.track.src;
        audio.addEventListener('ended', props.onEnd)
        audio.load();

    }, [props.track, props.onEnd]);

    return (
        <AudioPlayerContext.Provider value={{analyser, playing}}>
            <WaveForm/>
        </AudioPlayerContext.Provider>
    )
}