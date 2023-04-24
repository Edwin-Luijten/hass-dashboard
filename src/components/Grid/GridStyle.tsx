import { styled } from '@mui/material/styles';

const GridWidget = styled('div')(({theme}) => ({
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

export {
    GridWidget,
}