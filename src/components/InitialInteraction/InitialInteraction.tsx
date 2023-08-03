import { TouchApp } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useRecoilState } from 'recoil';
import { initialInteraction } from '../../state';

export function InitialInteraction() {
    const [interacted, setInteracted] = useRecoilState<boolean>(initialInteraction);

    if (interacted) {
        return null;
    }

    return (
        <Button variant="text" sx={{position: 'fixed', bottom: 10, left: 0}}
                onClick={() => setInteracted(true)}><TouchApp/></Button>
    );
}