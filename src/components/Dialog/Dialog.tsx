import {
    Box,
    Card,
    CardActions,
    CardContent,
    ClickAwayListener, Modal,
    Slide,
    Typography
} from '@mui/material';
import { CircularButton } from '../Buttons/CirclularButton';
import { CloseSharp } from '@mui/icons-material';
import { MouseEvent as ReactMouseEvent } from 'react';

const defaultStyle = {
    position: 'absolute',
    bottom: '0',
    width: '100%',
    backgroundColor: 'rgba(18, 19, 36, .8)',
    backdropFilter: 'blur(6px)',
    boxShadow: 24,
    border: 'none',
    outline: 'none',
    height: 700,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    paddingLeft: 6,
    paddingRight: 6,
    overflow: 'hidden',
    paddingTop: 5,
};

export type DialogProps = {
    children: JSX.Element | JSX.Element[] | string;
    title?: string;
    subTitle?: string;
    actions?: JSX.Element | JSX.Element[] | string;
    open: boolean;
    onClose: (event: MouseEvent | TouchEvent | ReactMouseEvent<HTMLElement>) => void;
    style?: object,
};

export function Dialog({children, title, subTitle, actions, open, onClose, style}: DialogProps) {
    const dialogStyle = {...defaultStyle, ...style};

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            hideBackdrop={true}
        >
            <Slide direction="up" in={open}>
                <Box sx={dialogStyle}>
                    <ClickAwayListener onClickAway={onClose}>
                        <Card sx={{backgroundColor: 'transparent', backgroundImage: 'none', boxShadow: 'none'}}>
                            <CircularButton sx={{float: 'right'}} onClick={onClose}><CloseSharp/></CircularButton>
                            {title &&
                                <Typography variant="h2">
                                    {title}
                                </Typography>
                            }

                            {subTitle &&
                                <Typography variant="h3">
                                    <b>{subTitle}</b>
                                </Typography>
                            }

                            <CardContent>
                                {children}
                            </CardContent>

                            {actions &&
                                <CardActions>
                                    {actions}
                                </CardActions>
                            }
                        </Card>
                    </ClickAwayListener>
                </Box>
            </Slide>
        </Modal>
    )
}