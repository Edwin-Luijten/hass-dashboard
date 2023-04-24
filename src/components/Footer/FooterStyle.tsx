import { styled } from '@mui/material/styles';
import { Toolbar } from '@mui/material';

export const FooterToolbar = styled(Toolbar)(({theme}) => ({
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    boxShadow: 'none'
}));
