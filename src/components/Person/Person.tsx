import { Avatar } from '@mui/material';
import { Dialog } from '../Dialog/Dialog';
import { useCallback, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { entityState } from '../../state';
import Map, { MapRef, Marker } from 'react-map-gl';
import { FilterCenterFocus } from '@mui/icons-material';
import { AtHomeBadge, AwayBadge, PersonDialogImage, PersonLocation } from './PersonStyle';

export type PersonProps = {
    id: string;
}

export function Person(props: PersonProps) {
    const person = useRecoilValue(entityState(props.id));
    const [openDialog, setDialogToOpen] = useState(false);
    const mapRef = useRef<MapRef | null>(null);

    const onClick = useCallback(() => {
        console.log(person);
        setDialogToOpen(true);
    }, [setDialogToOpen, person]);

    const onMapLoad = useCallback(() => {
        if (person) {
            mapRef.current?.flyTo({
                zoom: 17,
                center: {
                    lng: person.attributes.longitude,
                    lat: person.attributes.latitude,
                }
            });
        }
    }, [person]);

    return (
        <>
            {person?.state !== 'not_home' ?
                <AtHomeBadge
                    overlap="circular"
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                    variant="dot"
                >
                    <Avatar alt={person?.attributes?.friendly_name}
                            src={`https://ironpichi.com${person?.attributes.entity_picture}`} onClick={onClick}/>
                </AtHomeBadge>
                :
                <AwayBadge
                    overlap="circular"
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                    variant="dot"
                >
                    <Avatar alt={person?.attributes?.friendly_name}
                            src={`https://ironpichi.com${person?.attributes.entity_picture}`} onClick={onClick}/>
                </AwayBadge>
            }

            <Dialog open={openDialog} onClose={() => setDialogToOpen(false)} title={person?.attributes?.friendly_name}
                    subTitle={person?.state !== 'not_home' ? person?.state : 'Away'}>
                <PersonDialogImage src={`https://ironpichi.com${person?.attributes.entity_picture}`}/>
                <PersonLocation>
                    <Map ref={mapRef} onLoad={onMapLoad}
                         mapboxAccessToken="pk.eyJ1IjoiZWR3aW5sdWlqdGVuIiwiYSI6ImNsZXpzN3VmdjAyOGszcnIyMjJrM2V3b2QifQ.zqyX_e9dDYJA5vvhWD7J0A"
                         initialViewState={{
                             // zoom: 17,
                         }}
                         style={{width: 900, height: 900}}
                         mapStyle="mapbox://styles/edwinluijten/cjztygmjy058k1cqfofn4h3rs"
                         attributionControl={false}
                    >
                        <Marker
                            anchor="bottom"
                            longitude={person?.attributes.longitude}
                            latitude={person?.attributes.latitude}>
                            <FilterCenterFocus sx={{color: '#a832a0', fontSize: 40}}/>
                        </Marker>)
                    </Map>
                </PersonLocation>
            </Dialog>
        </>
    )
}