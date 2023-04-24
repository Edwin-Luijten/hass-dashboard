import { styled } from '@mui/material/styles';

const AudioVisualizer = styled('div')(({theme}) => ({
    position: 'absolute',
    bottom: 10,
    left: 0,
    width: '100%',
    height: 300,
}));

const AudioCanvas = styled('canvas')(({
    width: '100%',
    height: 300,
}));

export {
    AudioVisualizer,
    AudioCanvas,
}