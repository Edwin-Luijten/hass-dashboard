import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const WidgetsWrapper = styled(Box)(({theme}) => ({
    display: 'flex',
    minHeight: 'calc(100vh - 128px)',
    paddingLeft: 200,
    overflowX: 'visible',
    overflowY: 'hidden',
}));

export {
    WidgetsWrapper,
}