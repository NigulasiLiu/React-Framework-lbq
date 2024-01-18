import React from 'react';
import { Input, Select,Row } from 'antd';

const { Option } = Select;

interface SearchComponentState {
    searchQuery: string;
    selectedSearchField: string;
}

interface SearchComponentProps {
    columns: {
        dataIndex: string;
        title: string;
    }[];
    onSearch: (query: string, selectedField: string) => void;
}


class SearchComponent extends React.Component<SearchComponentProps,SearchComponentState> {
    state = {
        searchQuery: '',
        selectedSearchField: '',
    };

    handleSearchFieldChange = (selectedField:string) => {
        this.setState({ selectedSearchField: selectedField });
    };

    handleSearch = (query:string) => {
        this.setState({ searchQuery: query });
        this.props.onSearch(query, this.state.selectedSearchField);
    };

    render() {
        const { columns } = this.props;
        return (
            <div>
                <Row>
                    <Select style={{ width: '200px', marginRight: '8px', color: 'black', backgroundColor: 'white' }}
                        placeholder="选择搜索字段"
                        onChange={this.handleSearchFieldChange}
                        >
                        {columns?.map((column, index) => (
                            <Option style={{ color: 'black' }} key={index} value={column.title}>
                                {column.title}
                            </Option>
                        ))}
                    </Select>
                    <Input.Search
                        placeholder="搜索已选字段"
                        onSearch={this.handleSearch}
                        style={{ width: '77%' }}
                    />
                </Row>
            </div>
        );
    }
}
export default SearchComponent;