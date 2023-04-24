import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

const MediaPlayerWidget = styled('div')(({theme}) => ({
    position: 'relative',
    width: 400,
    borderRadius: 15,
    background: 'radial-gradient(circle, rgba(94,99,134,1) 0%, rgba(32,44,77,1) 76%)',
    boxShadow: 'rgb(0, 0, 0, .3) 0px 20px 30px -10px',
}));

const MediaPlayerImageWrapper = styled('div')(({theme}) => ({
    width: 400,
    height: 400,
}));

const MediaPlayerImage = styled('img')(({theme}) => ({
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
}));

const MediaPlayerInfo = styled('div')(({theme}) => ({
    padding: 15,
}));

const TinyText = styled(Typography)({
    fontSize: '0.75rem',
    opacity: 0.38,
    fontWeight: 500,
    letterSpacing: 0.2,
});

export {
    MediaPlayerWidget,
    MediaPlayerImageWrapper,
    MediaPlayerImage,
    MediaPlayerInfo,
    TinyText,
}