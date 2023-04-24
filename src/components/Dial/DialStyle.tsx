import { styled } from '@mui/material/styles';

const DialRoot = styled('figure')(({theme}) => ({
    position: 'absolute',
    width: 350,
    height: 350,
    display: 'block',
}));

const DialWrapper = styled('div')(({theme}) => ({
    position: 'absolute',
    width: 300,
    height: 300,
    left: '50%',
    top: '50%',
    marginLeft: -150,
    marginTop: -150,
    borderRadius: 300,
    boxShadow: 'inset 0px 1px 1px 0px #999, 0px 0px 0px 4px black',
}));

const Knob = styled('div')(({theme}) => ({
    position: 'absolute',
    width: 300,
    height: 300,
    top: '50%',
    left: '50%',
    marginLeft: -150,
    marginTop: -150,
    borderRadius: 300,
}));

const Handle = styled('div')(({theme}) => ({
    position: 'absolute',
    background: '#171717',
    width: 46,
    height: 46,
    left: '50%',
    top: '50%',
    marginLeft: -23,
    marginTop: -112,
    borderRadius: 46,
    boxShadow: 'inset 0px 0px 6px 4px #1a1a1a, 1px 1px 2px 0px rgba(255, 255, 255, 0.2), inset 1px 2px 4px 2px rgba(0, 0, 0, 0.4), inset -8px -8px 6px 1px #222222',
}));

const Indicator = styled('div')(({theme}) => ({
    position: 'absolute',
    width: 10,
    height: 10,
    top: 12,
    left: '50%',
    marginLeft: -6,
    borderRadius: 10,
    boxShadow: '0px 0px 4px 1px white',
}));

const Progress = styled('canvas')(({theme}) => ({
    position: 'absolute',
    width: 350,
    height: 350,
}));

const Value = styled('div')(({theme}) => ({
    position: 'absolute',
    width: 100,
    height: 100,
    left: '50%',
    top: '50%',
    border: '6px solid #fff',
    marginLeft: -56,
    marginTop: -56,
    borderRadius: 300,
    zIndex: 1,
    // boxShadow: '0px 0px 2px 2px rgba(255, 255, 255, 0.08), inset 0px 0px 10px 4px #6a6c60',
    'span': {
        position: 'relative',
        display: 'block',
        top: 10,
        textAlign: 'center',
        textShadow: '0px 1px 0px #eee',
    }
}));

export {
    DialRoot,
    DialWrapper,
    Value,
    Handle,
    Progress,
    Indicator,
    Knob,
}