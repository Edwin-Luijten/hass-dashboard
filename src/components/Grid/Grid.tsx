import { Box, Typography } from '@mui/material';
import {
    GridWidget,
} from './GridStyle';
import { useCallback, useState } from 'react';
import { Dialog } from '../Dialog/Dialog';
import { useDoubleTap } from 'use-double-tap';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useHomeAssistant } from '../../hooks/useHomeAssistant';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import Chart from 'react-apexcharts';

dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Amsterdam');
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
    start: number;
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
        categories: [
            '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00',
            '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
            '22:00', '23:00'
        ],
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

    const getStats = useCallback((config: {
        import: { t1: string, t2: string },
        export: { t1: string, t2: string }
    }) => {
        console.log('fetching stats for', (dayjs().startOf('day')).format('YYYY-MM-DDTHH:mm:ss.000Z'));
        sendMessage<GridStats>({
            type: 'recorder/statistics_during_period',
            period: 'hour',
            start_time: (dayjs().startOf('day')).format('YYYY-MM-DDTHH:mm:ss.000[Z]'),
            end_time: (dayjs().set('hour', 23)).format('YYYY-MM-DDTHH:mm:ss.000[Z]'),
            statistic_ids: [config.import.t1, config.import.t2, config.export.t1, config.export.t2],
            types: ['sum'],
            units: {
                energy: 'kWh',
                volume: 'm³',
            }
        }).then((d) => {
            console.log(d);


            let recordsImport: Array<Array<number>> = (new Array()).fill(d[config.import.t1].length);
            let recordsExport: Array<Array<number>> = (new Array()).fill(d[config.import.t1].length);

            const series: ApexAxisChartSeries = [];

            d[config.import.t1].forEach((stat, i) => {
                const t = dayjs(stat.start);
                if (t.isBetween(t.subtract(1, 'd').set('hour', 23), dayjs().set('hour', 7))) {
                    recordsImport[i] = [stat.start, stat.sum / 100];
                }
            });
            d[config.import.t2].forEach((stat, i) => {
                const t = dayjs(stat.start);
                if (t.isBetween(dayjs().set('hour', 7), dayjs().set('hour', 23))) {
                    recordsImport[i] = [stat.start, stat.sum / 100];
                }
            });
            d[config.export.t1].forEach((stat, i) => {
                const t = dayjs(stat.start);
                if (t.isBetween(t.subtract(1, 'd').set('hour', 23), dayjs().set('hour', 7))) {
                    recordsExport[i] = [stat.start, -(stat.sum / 100)];
                }
            });
            d[config.export.t2].forEach((stat, i) => {
                const t = dayjs(stat.start);
                if (t.isBetween(dayjs().set('hour', 7), dayjs().set('hour', 23))) {
                    recordsExport[i] = [stat.start, -(stat.sum / 100)];
                }
            });

            console.log(recordsImport);
            console.log(recordsExport);
            series.push({
                name: 'Import',
                data: recordsImport,
            });

            series.push({
                name: 'Export',
                data: recordsExport,
            });

            setSeries(series);

        });
    }, [sendMessage, setSeries]);

    const handleClose = () => setDialogToOpen(false);

    const openDialog = useCallback(() => {
        setDialogToOpen(true);
    }, [setDialogToOpen]);

    const tap = useDoubleTap(openDialog, 300, {});

    useEffectOnce(() => {
        getStats({
            import: {t1: props.import.t1, t2: props.import.t2},
            export: {t1: props.export.t1, t2: props.export.t2}
        });
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