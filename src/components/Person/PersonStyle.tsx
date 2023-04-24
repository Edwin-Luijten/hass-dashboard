import { styled } from '@mui/material/styles';
import { Badge } from '@mui/material';

const PersonLocation = styled('div')(({theme}) => ({
    borderRadius: '50%',
    overflow: 'hidden',
    width: 900,
    height: 900,
    position: 'absolute',
    left: '20%',
    top: -50,
    maskImage: 'radial-gradient(rgba(0, 0, 0, 1) 20%, transparent 65%)',
}));

const PersonDialogImage = styled('img')(({theme}) => ({
    borderRadius: '50%',
    maxWidth: 300,
    maxHeight: 300,
}));

const AtHomeBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const AwayBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#F10000',
        color: '#F10000',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));
export {
    PersonLocation,
    PersonDialogImage,
    AtHomeBadge,
    AwayBadge
}