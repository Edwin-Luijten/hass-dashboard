import { Box, Paper, TableContainer, Table, TableHead, TableCell, TableRow, TableBody } from '@mui/material';
import { useCallback, useState } from 'react';
import { useHomeAssistant } from '../hooks/useHomeAssistant';
import { useEffectOnce } from '../hooks/useEffectOnce';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Amsterdam');

type LogEntry = {
    name: string;
    level: 'WARNING' | 'ERROR' | 'INFO';
    timestamp: number;
    message: Array<string>;
}

export function LogsPage() {
    const {sendMessage} = useHomeAssistant();
    const [logs, setLogs] = useState<Array<LogEntry>>([]);
    const getStats = useCallback(() => {
        sendMessage<Array<LogEntry>>({
            type: 'system_log/list',
        }).then((d) => {
            setLogs(d);
        });
    }, [sendMessage, setLogs]);

    useEffectOnce(() => {
        getStats();
    });

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Level</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Message</TableCell>
                            <TableCell align="right">Timestamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((row) => (
                            <TableRow>
                                <TableCell component="th" scope="row">{row.level}</TableCell>
                                <TableCell align="right">{row.name}</TableCell>
                                <TableCell align="right">{row.message.join(' ')}</TableCell>
                                <TableCell align="right">{dayjs.unix(row.timestamp).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}