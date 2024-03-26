
import { useCallback, useState } from 'react';

const useSearchOriginData = () => {
    const [searchResults, setSearchResults] = useState([]);

    const searchOriginData = useCallback((originData:any[], filterKeys:string[], filterValues:string[], targetAttributes:string[]) => {
        const filteredData = originData.filter(item =>
            filterKeys.every((key, index) => item[key] === filterValues[index])
        );

        const resultData:any = filteredData.map(item => {
            const resultItem:any = {};
            targetAttributes.forEach(attr => {
                resultItem[attr] = item[attr];
            });
            return resultItem;
        });

        setSearchResults(resultData);
    }, []);

    return { searchResults, searchOriginData };
};

export default useSearchOriginData;
