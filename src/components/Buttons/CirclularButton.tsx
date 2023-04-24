import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const CircularButtonStyle = styled(Button)(({theme}) => ({
    borderRadius: '50%',
    width: 64,
    height: 64,
    '&.active': {
        backgroundColor: '#fff',
    }
}));

export function CircularButton({children, ...props}: ButtonProps) {
    return (<CircularButtonStyle {...props} variant="outlined">{children}</CircularButtonStyle>)
}