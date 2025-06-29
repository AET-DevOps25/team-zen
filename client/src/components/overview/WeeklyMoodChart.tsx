import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';
import { getMoodEmoji } from '../../constants/moods';
import type { ChartConfig } from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface WeeklyMoodChartProps {
  weeklyMoodData: Array<{ day: string; mood: number; hasEntry: boolean }>;
}

const WeeklyMoodChart = ({ weeklyMoodData }: WeeklyMoodChartProps) => {
  const chartConfig: ChartConfig = {
    mood: {
      label: 'Mood',
      color: 'hsl(142.1 76.2% 36.3%)',
    },
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Weekly Mood Trend</CardTitle>
        <CardDescription>Your mood journey this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={weeklyMoodData}
            margin={{
              left: 12,
              right: 12,
              top: 30,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => [
                    typeof value === 'number' && value > 0
                      ? `${value.toFixed(1)}/5`
                      : 'No entry',
                  ]}
                />
              }
            />
            <Line
              dataKey="mood"
              type="monotone"
              stroke="var(--color-mood)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-mood)', strokeWidth: 2, r: 4 }}
              connectNulls={false}
            >
              <LabelList
                position="top"
                offset={8}
                className="fill-foreground"
                fontSize={16}
                formatter={(value) =>
                  typeof value === 'number' && value > 0
                    ? getMoodEmoji(value)
                    : ''
                }
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default WeeklyMoodChart;
