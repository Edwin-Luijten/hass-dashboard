import { AppBar, Box, Stack } from '@mui/material';
import { FooterToolbar } from './FooterStyle';
import { Person } from '../Person/Person';

export type FooterProps = {
    persons: Array<string>;
}

export function Footer(props: FooterProps) {
    return (
        <AppBar position="static" sx={{backgroundColor: 'transparent', backgroundImage: 'none', boxShadow: 'none'}}>
            <FooterToolbar>
                <Box sx={{flexGrow: 1}}></Box>
                <Stack direction="row" spacing={2}>
                    {props.persons.map((person, i) => (
                        <Person key={i} id={person}/>
                    ))}
                </Stack>
            </FooterToolbar>
        </AppBar>
    );
}