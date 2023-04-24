import { AppBar, IconButton, Stack, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { HeaderToolbar, NavButton } from './HeaderStyle';
import { useRecoilValue } from 'recoil';
import { entityState } from '../../state';
import dayjs from 'dayjs';
import { HassEntity } from 'home-assistant-js-websocket';
import { DashboardSharp } from '@mui/icons-material';

export type HeaderProps = {
    date: string;
}

export function Header(props: HeaderProps) {
    const date = useRecoilValue<HassEntity | null>(entityState(props.date));

    return (
        <AppBar position="static" sx={{backgroundColor: 'transparent', backgroundImage: 'none', boxShadow: 'none'}}>
            <HeaderToolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}
                >
                    <MenuIcon/>
                </IconButton>

                <Typography variant="h6">{dayjs(date?.state).format('ddd, MMM DD')}</Typography>

                <Box sx={{flexGrow: 1}}></Box>

                <Stack direction="row" spacing={1}>
                    <NavButton href={'/'} variant={'text'}><DashboardSharp/></NavButton>
                    <NavButton href={'/energy'} variant={'outlined'}>Energy</NavButton>
                </Stack>
                <Box sx={{flexGrow: 1}}></Box>
            </HeaderToolbar>
        </AppBar>
    );
}