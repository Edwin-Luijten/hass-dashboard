import { styled } from '@mui/material/styles';
import { Button, Toolbar } from '@mui/material';

const HeaderToolbar = styled(Toolbar)(({theme}) => ({
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    boxShadow: 'none'
}));

const NavButton = styled(Button)(({theme}) => ({
    borderRadius: 16,
}));

export {
    HeaderToolbar,
    NavButton,
}
