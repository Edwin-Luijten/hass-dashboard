import { styled } from '@mui/material/styles';

export const LightWidget = styled('div')(({theme}) => ({
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 100,
    height: '100%',
    position: 'relative',
    display: 'block',
    boxShadow: 'rgb(0, 0, 0, .3) 0px 20px 30px -10px',
}));