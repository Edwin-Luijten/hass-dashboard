import { styled } from '@mui/material/styles';

const WeatherWidget = styled('div')(({theme}) => ({
    position: 'relative',
    width: 400,
    height: 600,
}));

const WeatherWidgetImageWrapper = styled('div')(({theme}) => ({
    width: 400,
    height: 400,
    background: '#171646ff',
    borderRadius: '50%',
    position: 'relative',
}));

const WeatherWidgetImage = styled('img')(({theme}) => ({
    position: 'absolute',
    left: '-10%',
    top: '10%',
    transform: 'scale(1.1)',
}));

const WeatherWidgetState = styled('div')(({theme}) => ({
    width: 200,
    height: 350,
    borderRadius: '50%/20%',
    backgroundColor: 'rgba(255, 255, 255, .2)',
    backdropFilter: 'blur(6px)',
    position: 'absolute',
    left: '45%',
    top: '20%',
    textAlign: 'center',
    paddingTop: 50,
    textTransform: 'capitalize',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: 'rgb(0, 0, 0, .3) 0px 20px 30px -10px',
}));

export {
    WeatherWidget,
    WeatherWidgetImageWrapper,
    WeatherWidgetImage,
    WeatherWidgetState,
}