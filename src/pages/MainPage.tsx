import Grid from '@mui/material/Unstable_Grid2';
import { MediaPlayer } from '../components/MediaPlayer/MediaPlayer';
import { Weather } from '../components/Weather/Weather';
import { Light } from '../components/Light/Light';
import { Temperature } from '../components/Temperature/Temperature';
import { Car } from '../components/Car/Car';
import EntityConfig from '../config.json';
import { Vacuum } from '../components/Vacuum/Vacuum';
import { Widgets } from '../components/Widgets/Widgets';
import { Widget } from '../components/Widgets/Widget';

export function MainPage() {
    return (
        <Widgets>
            <Widget width={450}>
                <Weather weather={EntityConfig.main.weather} sun="sun.sun"/>
            </Widget>
            <Widget width={400}>
                <MediaPlayer player={EntityConfig.main.media}/>
            </Widget>
            <Widget width={280}>
                <Grid container spacing={0}>
                    <Grid xs={12} sx={{height: 300}}>
                        <Light light={EntityConfig.main.light}/>
                    </Grid>
                    <Grid xs={12} sx={{height: 300}}>
                        <Temperature climate={EntityConfig.main.climate}/>
                    </Grid>
                </Grid>
            </Widget>
            <Widget width={600}>
                <Car {...EntityConfig.main.car}/>
            </Widget>
            <Widget width={600}>
                <Vacuum id={EntityConfig.main.vacuum}/>
            </Widget>
        </Widgets>
    )
}