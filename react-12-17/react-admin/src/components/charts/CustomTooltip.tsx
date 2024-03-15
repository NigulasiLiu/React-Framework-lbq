import React from 'react';
import { Tooltip as RechartsTooltip } from 'recharts';
import { StatusItem } from '../tableUtils';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;  // Adjust the payload type
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataItems: StatusItem[] = payload.map((item) => ({
      label: item.name,
      value: item.value,
      color: '#000000',  // Add a default color or modify as needed
    }));

    return (
      <div className="custom-tooltip">
        <p>{label}</p>
        {dataItems.map((dataItem, index) => (
          <span key={index} style={{ color: dataItem.color }}>
            {`${dataItem.label}: ${dataItem.value}`}
          </span>
        ))}
      </div>
    );
  }

  return null;
};

const Tooltip: React.FC = () => (
  <RechartsTooltip content={<CustomTooltip />} />
);

export default Tooltip;
