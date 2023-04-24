import { styled } from '@mui/material/styles';

const TemperatureWidget = styled('div')(({theme}) => ({
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    height: '100%',
    position: 'relative',
    backgroundColor: '#E8D7E9ff',
    display: 'flex',
    width: '100%',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'rgb(0, 0, 0, .3) 0px 20px 30px -10px',
}));

const TemperatureBody = styled('div')(({theme}) => ({
    background: '#eae8e9',
    '&::before, &::after': {
        content: '""',
        position: 'absolute',

        transform: 'translate(-50%, -50%)',
        width: 250,
        height: 250,
        backgroundImage: 'linear-gradient(-47deg, #656565 18%, #BBBBBB 33%, #757575 51%, #616161 66%, #C1C1C1 83%, #83837e 90%)',
        borderRadius: '50%',
        zIndex: 1,
        border: '2px solid #98989a',
        boxShadow: '0 1px 12px 1px rgba(0,0,0,.26)',
    },
    '&::after': {
        backgroundImage: 'linear-gradient(140deg, rgba(255,255,255,.29), rgba(255,255,255,.13) 37%, rgba(255,255,255,0) 37.1%)',
        width: 247,
        height: 247,
        zIndex: 4,
        border: 'none',
        pointerEvents: 'none',
    }
}));

const TemperatureSlider = styled('div')(({theme}) => ({
    position: 'absolute',
    zIndex: 2,
    transform: 'translate(-50%, -50%)',

    '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 250,
        height: 250,
        background: '#000',
        borderRadius: '50%',
        zIndex: 1,
    },

    '&::after': {
        zIndex: 2,
        boxShadow: 'inset 0 0 5px #000',
        background: 'linear-gradient(-190deg, rgba(255, 255, 255, .3),  rgba(255, 255, 255, 0) 50%)',
    }
}));

const TemperatureSliderControl = styled('div')(({theme}) => ({
    position: 'absolute',
    transform: 'translate(-50%, -0%)',
    zIndex: 4,
    top: -100,
}));

const TemperatureSliderControlInner = styled('div')(({theme}) => ({
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 170,
    height: 170,
    boxShadow: 'inset 0 -2px 5px rgba(0, 0, 0, .2), inset 0 3px 5px rgba(0, 0, 0, .1), 0 0 3px #000',
    borderRadius: '50%',
    zIndex: 2,
    opacity: .8
}));

const TemperatureValue = styled('div')(({theme}) => ({
    position: 'absolute',
    top: -50,
    left: '50%',
    transform: 'translate(-50%, -0%)',
    zIndex: 5,
    width: 100,
    height: 100,
}));

export {
    TemperatureWidget,
    TemperatureBody,
    TemperatureSlider,
    TemperatureSliderControl,
    TemperatureSliderControlInner,
    TemperatureValue,
}