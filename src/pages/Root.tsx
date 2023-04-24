import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import EntityConfig from '../config.json';
import { Outlet } from 'react-router-dom';
import { LinkProps } from '@mui/material/Link';
import { LinkBehavior } from '../components/RouterButton/RouterButton';

const Wrapper = styled(Paper)(({theme}) => ({
    width: '100%',
    height: '100vh',
    padding: 0,
    margin: 0,
    background: 'linear-gradient(to right, #2D1769, #12142F, #121324)'
}));

const mdTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: (themeParam) => ({
                body: {
                    margin: 0,
                },
            }),
        },
        MuiLink: {
            defaultProps: {
                component: LinkBehavior,
            } as LinkProps,
        },
        MuiButtonBase: {
            defaultProps: {
                LinkComponent: LinkBehavior,
            },
        },
    }
});

export function Root() {
    return (
        <ThemeProvider theme={mdTheme}>
            <CssBaseline/>
            <Wrapper>
                <Grid container spacing={0}>
                    <Grid xs={12}>
                        <Header date={EntityConfig.clock.date}/>
                    </Grid>
                    <Outlet/>
                    <Grid xs={12}>
                        <Footer persons={EntityConfig.persons}/>
                    </Grid>
                </Grid>
            </Wrapper>
        </ThemeProvider>
    )
}