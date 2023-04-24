import { Box } from '@mui/material';

type WidgetProps = {
    width: number;
    children?: JSX.Element | JSX.Element[] | string | number;
}

export function Widget(props: WidgetProps) {
    return (
        <Box className="widget"
             sx={{width: props.width, minWidth: props.width, position: 'sticky', left: 10, marginRight: 2}}>
            {props.children}
        </Box>
    )
}