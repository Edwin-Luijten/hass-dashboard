import { Box, Button, Stack, Typography } from '@mui/material';
import VacuumImage from '../../static/images/vacuum.png';
import { useRecoilValue } from 'recoil';
import { entityState } from '../../state';
import {
    CarImage,
    VacuumWidget,
    VacuumImageWrapper,
} from './VacuumStyle';
import { useCallback, useState } from 'react';
import { Dialog } from '../Dialog/Dialog';
import { useDoubleTap } from 'use-double-tap';
import { StartSharp } from '@mui/icons-material';
import { BatteryBar, RangeStatus } from '../Car/CarStyle';

export type VacuumProps = {
    id: string;
}

const buttonStyle = {
    borderRadius: '50%',
    width: 64,
    height: 64,
}

const batteryLevelClass = function (state: string, level: number, isCharging: boolean): string | undefined {
    const currentLevel = Number(state);
    const prevLevel = level - 20;

    if (currentLevel < level && isCharging) return 'current';
    else if (currentLevel > prevLevel && currentLevel < level) return 'using'

    if (currentLevel >= level) return 'full';

    return undefined;
}

export function Vacuum(props: VacuumProps) {
    const vacuum = useRecoilValue(entityState(props.id))
    const [openDialog, setDialogToOpen] = useState(false);

    const handleClose = () => setDialogToOpen(false);

    const openVacuumDialog = useCallback(() => {
        setDialogToOpen(true);
    }, [setDialogToOpen]);

    const tap = useDoubleTap(openVacuumDialog, 300, {});

    return (
        <Box sx={{display: 'flex', alignItems: 'stretch', height: '100%'}}>
            <VacuumWidget {...tap}>
                <Typography variant="h1">Vacuum</Typography>
                <Typography variant="h2"><b>Sukkit</b></Typography>
                <Stack direction="row" spacing={2}>
                    <Button size="large" variant="outlined" sx={buttonStyle}>
                        <StartSharp sx={{fontSize: 40}}/>
                    </Button>
                </Stack>
                <VacuumImageWrapper>
                    <CarImage src={VacuumImage}/>
                </VacuumImageWrapper>

                <BatteryBar>
                    <li className={batteryLevelClass('80', 20, false)}></li>
                    <li className={batteryLevelClass('80', 40, false)}></li>
                    <li className={batteryLevelClass('80', 60, false)}></li>
                    <li className={batteryLevelClass('80', 80, false)}></li>
                    <li className={batteryLevelClass('80', 100, false)}></li>
                </BatteryBar>

                <Stack direction="row" justifyContent="space-between">
                    <RangeStatus variant="h5">
                        <b>80</b>%
                    </RangeStatus>
                    <RangeStatus variant="h5">
                        <b>80</b>%
                    </RangeStatus>
                </Stack>

            </VacuumWidget>

            <Dialog open={openDialog} onClose={handleClose} title="Vacuum" subTitle="Sukkit">
                <Box>

                </Box>
            </Dialog>
        </Box>
    )
}