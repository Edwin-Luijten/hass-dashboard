import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import {
    Box,
    CssBaseline,
    Divider,
    List,
    ListItem,
    Paper,
    SwipeableDrawer
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import EntityConfig from '../config.json';
import { Outlet } from 'react-router-dom';
import { LinkProps } from '@mui/material/Link';
import { LinkBehavior } from '../components/RouterButton/RouterButton';
import { useState } from 'react';
import { NavButton } from '../components/Header/HeaderStyle';

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
    const [openDrawer, setDrawerOpen] = useState(false);

    return (
        <ThemeProvider theme={mdTheme}>
            <CssBaseline/>
            <Wrapper>
                <Grid container spacing={0}>
                    <SwipeableDrawer
                        anchor={'left'}
                        open={openDrawer}
                        onClose={() => setDrawerOpen(false)}
                        onOpen={() => setDrawerOpen(true)}
                    >
                        <Box
                            sx={{width: 250}}
                            role="presentation"
                            onClick={() => setDrawerOpen(false)}
                            onKeyDown={() => setDrawerOpen(false)}
                        >
                            <Divider/>
                            <List>
                                <ListItem disablePadding>
                                        <NavButton href={'/logs'} variant={'text'}>Logs</NavButton>
                                </ListItem>
                            </List>
                        </Box>

                    </SwipeableDrawer>
                    <Grid xs={12}>
                        <Header setDrawerOpen={setDrawerOpen} date={EntityConfig.clock.date}/>
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