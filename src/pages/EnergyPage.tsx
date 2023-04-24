import { Widgets } from '../components/Widgets/Widgets';
import { Widget } from '../components/Widgets/Widget';
import { Grid } from '../components/Grid/Grid';
import EntityConfig from '../config.json';

export function EnergyPage() {
    return (
        <Widgets>
            <Widget width={600}>
                <Grid export={EntityConfig.energy.grid.export} import={EntityConfig.energy.grid.import}/>
            </Widget>
        </Widgets>
    )
}