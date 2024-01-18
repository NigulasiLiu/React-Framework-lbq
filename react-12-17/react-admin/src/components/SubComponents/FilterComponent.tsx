import React from 'react';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

interface FilterComponentProps {
    onDateRangeChange: (dateStrings: [string, string]) => void;
}
interface FilterComponentState {
    selectedDateRange: [string | null, string | null];
}

class FilterComponent extends React.Component<FilterComponentProps,FilterComponentState> {
    state: FilterComponentState = {
        selectedDateRange: [null, null], // 明确指定为两个元素的元组
    };

    onDateRangeChange = (dates:any, dateStrings:[string,string]) => {
        this.setState({ selectedDateRange: dateStrings });
        this.props.onDateRangeChange(dateStrings);
    };

    render() {
        return (
            <RangePicker onChange={this.onDateRangeChange} />
        );
    }
}
export default FilterComponent;