import { Box, Typography } from '@mui/material';
import {
    GridWidget,
} from './GridStyle';
import { useCallback, useState } from 'react';
import { Dialog } from '../Dialog/Dialog';
import { useDoubleTap } from 'use-double-tap';
import dayjs from 'dayjs';
import { useHomeAssistant } from '../../hooks/useHomeAssistant';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import Chart from 'react-apexcharts';

export type GridProps = {
    export: {
        total: string;
        t1: string;
        t2: string;
    },
    import: {
        total: string;
        t1: string;
        t2: string;
    }
}

type Stat = {
    start: number | null;
    end: number | null;
    max: number | null;
    mean: number | null;
    min: number | null;
    state: number;
    sum: number;
}

type GridStats = {
    [key: string]: Array<Stat>
}

const chartOptions: ApexCharts.ApexOptions = {
    chart: {
        foreColor: '#fff',
        toolbar: {
            show: false,
        },
    },
    legend: {
        show: false,
    },
    yaxis: {
        forceNiceScale: true,
        labels: {
            formatter: function (value) {
                return value.toFixed(2);
            }
        },
    },
    dataLabels: {
        enabled: false,
    },
    xaxis: {
        type: 'datetime',
        labels: {
            // format: 'HH'
        },
        categories: [],
    },
    plotOptions: {
        bar: {
            colors: {
                ranges: [
                    {
                        from: -9999,
                        to: 0,
                        color: '#52B12C',
                    },
                    {
                        from: 0.1,
                        to: 9999,
                        color: '#CD363A',
                    }
                ]
            }
        }
    }
}

export function Grid(props: GridProps) {
    const {sendMessage} = useHomeAssistant();
    const [isDialogOpen, setDialogToOpen] = useState(false);
    const [series, setSeries] = useState<ApexAxisChartSeries | ApexNonAxisChartSeries | undefined>();

    const getStats = useCallback((ids: Array<string>) => {
        console.log('fetching stats for', ids);

        const now = dayjs();
        let st = now.subtract(6, 'h');

        for (let i = 0; i < 12; i++) {
            st = st.add(1, 'h');
            chartOptions.xaxis?.categories.push(st.format('YYYY-MM-DD HH:00:00'));
        }

        console.log('range', chartOptions.xaxis?.categories);

        sendMessage<GridStats>({
            type: 'recorder/statistics_during_period',
            period: 'hour',
            start_time: (dayjs().subtract(12, 'h')).toISOString(),
            end_time: (dayjs().add(6, 'h')).toISOString(),
            statistic_ids: ids,
            types: ['sum'],
            units: {
                energy: 'kWh',
                volume: 'm³',
            }
        }).then((d) => {
            const s = [];
            for (const id in d) {
                const da: Array<number> = Array(chartOptions.xaxis?.categories?.length).fill(0);
                d[id].forEach((r: Stat) => {
                    const t = dayjs(r.start);
                    const k = t.format('YYYY-MM-DD HH:00:00');
                    const i = chartOptions.xaxis?.categories?.indexOf(k);

                    if (i !== -1) {
                        da[i] = id.includes('export') ? -(r.sum / 1000) : (r.sum / 1000);
                    }
                    // da.push(id.includes('export') ? -(r.sum / 1000) : (r.sum / 1000));
                });

                s.push({name: id.includes('export') ? 'Export' : 'Import', data: da});
            }

            console.log('series', s);
            setSeries(s);
        })
    }, [sendMessage, setSeries]);

    const handleClose = () => setDialogToOpen(false);

    const openDialog = useCallback(() => {
        setDialogToOpen(true);
    }, [setDialogToOpen]);

    const tap = useDoubleTap(openDialog, 300, {});

    useEffectOnce(() => {
        getStats([props.import.t1, props.export.t1]);
    });

    return (
        <Box sx={{display: 'flex', alignItems: 'stretch', height: '100%'}}>
            <GridWidget {...tap}>
                <Typography variant="h1">Grid</Typography>

                {series &&
                    <Chart type="bar" options={chartOptions} series={series}></Chart>
                }
            </GridWidget>

            <Dialog open={isDialogOpen} onClose={handleClose} title="Grid">

            </Dialog>
        </Box>
    )
}