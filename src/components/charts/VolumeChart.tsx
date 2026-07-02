import { BarChart } from '@tremor/react';
import { formatCurrency } from '../../utils/formatters';
import { clsx } from 'clsx';

interface VolumeChartProps {
    data?: Array<{ date: string; Volume: number }>;
    className?: string;
}

export function VolumeChart({ data = [], className }: VolumeChartProps) {
    return (
        <BarChart
            className={clsx('h-48', className)}
            data={data}
            index="date"
            categories={['Volume']}
            colors={['brand']}
            valueFormatter={(v) => formatCurrency(v * 100)}
            showLegend={false}
            showAnimation
        />
    );
}
