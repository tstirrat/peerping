import * as React from 'react';
import { Cell, Pie, PieChart, PieProps, Sector } from 'recharts';
import pure from 'recompose/pure';

export interface ColorData {
  color: string;
  value: number;
}

const defaultColorData: ColorData[] = [
  {
    color: '#FF8042',
    value: 650
  },
  {
    color: '#FFBB28',
    value: 200
  },
  {
    color: '#0088FE',
    value: 100
  },
  {
    color: '#00C49F',
    value: 50
  }
];

const ActiveSectorMark: React.StatelessComponent<PieProps> = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill
}) => {
  return (
    <g>
      <Sector
        cx={cx as number}
        cy={cy as number}
        innerRadius={innerRadius as number}
        outerRadius={(outerRadius as number) * 1.05}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export interface Props {
  width?: number;
  value: number;
  colorData?: ColorData[];
}

/**
 * Gauge chart
 *
 * Taken from:
 * https://gist.github.com/emiloberg/ee549049ea0f6b83e25f1a1110947086
 */
export const GaugeChart = pure<Props>(
  ({ width = 500, value: chartValue, colorData = defaultColorData }) => {
    const activeSectorIndex = colorData
      .map((cur, index, arr) => {
        const curMax = [...arr]
          .splice(0, index + 1)
          .map(d => d.value)
          .reduce((a, b) => a + b);
        return chartValue > curMax - cur.value && chartValue <= curMax;
      })
      .findIndex(cur => cur);

    const sumValues = colorData.map(cur => cur.value).reduce((a, b) => a + b);

    const arrowData = [
      { value: chartValue },
      { value: 0 },
      { value: sumValues - chartValue }
    ];

    const pieProps: Partial<PieProps> = {
      endAngle: 0,
      // tslint:disable-next-line:object-literal-sort-keys
      cx: width / 2,
      cy: width / 2,
      startAngle: 180
    };

    const pieRadius: Partial<PieProps> = {
      innerRadius: (width / 2) * 0.3,
      outerRadius: (width / 2) * 0.4
    };

    const Arrow: React.StatelessComponent<any> = ({
      cx,
      cy,
      midAngle,
      outerRadius
    }) => {
      const RADIAN = Math.PI / 180;
      const sin = Math.sin(-RADIAN * midAngle);
      const cos = Math.cos(-RADIAN * midAngle);
      const mx = cx + (outerRadius + width * 0.03) * cos;
      const my = cy + (outerRadius + width * 0.03) * sin;
      return (
        <g>
          <circle cx={cx} cy={cy} r={width * 0.03} fill="#666" stroke="none" />
          <path
            d={`M${cx},${cy}L${mx},${my}`}
            strokeWidth="6"
            stroke="#666"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );
    };

    return (
      <PieChart width={width} height={width / 2 + 30}>
        <Pie
          activeIndex={activeSectorIndex}
          activeShape={ActiveSectorMark}
          data={colorData}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={2}
          {...pieRadius}
          {...pieProps}
        >
          {colorData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colorData[index].color}
              stroke="none"
            />
          ))}
        </Pie>
        <Pie
          stroke="none"
          activeIndex={1}
          activeShape={Arrow}
          data={arrowData}
          outerRadius={pieRadius.innerRadius}
          fill="none"
          {...pieProps}
          dataKey="value"
        />
      </PieChart>
    );
  }
);
