import { styled } from '@mui/material/styles';
const VacuumWidget = styled('div')(({theme}) => ({
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 100,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    background: 'radial-gradient(circle, rgba(94,99,134,1) 0%, rgba(32,44,77,1) 76%)',
    padding: 10,
    boxShadow: 'rgb(0, 0, 0, .3) 0px 20px 30px -10px',
}));

const VacuumImageWrapper = styled('div')(({theme}) => ({
    position: 'relative',
    width: '100%',
    display: 'block',
    height: 285,
}));

const CarImage = styled('img')(({theme}) => ({
    position: 'absolute',
    width: 400,
    top: '-25%',
    right: -20,
}));

const VacuumImageWrapperZoomed = styled('img')(({theme}) => ({
    position: 'absolute',
    top: '30%',
    right: '1%',
    zoom: '1.1',
}));

const BatteryBar = styled('ul')(({theme}) => ({
    margin: 'auto',
    marginBottom: 5,
    height: 10,
    width: 500,
    listStyle: 'none',
    padding: 0,
    'li': {
        display: 'block',
        float: 'left',
        width: 90,
        height: 10,
        marginRight: 10,
        boxShadow: 'inset 0px 0px 10px 1px rgba(117,182,255,0.4),0px 0px 20px rgba(117,182,255,0.1)',
    },
    'li.using': {
        background: 'rgba(255,165,0,0.9)',
        boxShadow: 'inset 0px 0px 10px 2px rgba(117,182,255,0.5), 0px 0px 20px rgba(117,182,214,0.5)',
    },
    'li.full': {
        background: 'rgba(255,255,255,0.9)',
        boxShadow: 'inset 0px 0px 10px 2px rgba(117,182,255,0.5), 0px 0px 20px rgba(117,182,214,0.5)',
    },
    'li.current': {
        animation: 'pulse 1s alternate infinite',
    },
    '@keyframes pulse': {
        '0%': {
            background: 'rgba(255,255,255,1)',
            boxShadow: 'inset 0px 0px 10px 2px rgba(117,182,255,0.5),0px 0px 40px 2px rgba(105,135,255,1)',
        },
        '100%': {
            background: 'rgba(255,255,255,0)',
            boxShadow: 'inset 0px 0px 10px 2px rgba(117,182,255,0.5),0px 0px 30px 2px rgba(105,135,255,0.3)',
        }
    }
}));

export {
    VacuumWidget,
    CarImage,
    VacuumImageWrapper,
    VacuumImageWrapperZoomed,
    BatteryBar,
}