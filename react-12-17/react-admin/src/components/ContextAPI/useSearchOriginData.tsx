// // src/hooks/useSearchOriginData.js
// import { useState, useEffect } from 'react';

// const useSearchOriginData = (originData:any[], filterKeys:string[], filterValues:string[], targetAttributes:string[]) => {
//   const [searchResults, setSearchResults] = useState<any[]>([]);

//   useEffect(() => {
//     if (Array.isArray(originData)) {
//       const filteredData = originData.filter(item =>
//         filterKeys.every((key, index) => item[key] === filterValues[index])
//       );

//       const results = filteredData.map(item => {
//         const resultItem:any = {};
//         targetAttributes.forEach(attr => {
//           resultItem[attr] = item[attr];
//         });
//         return resultItem;
//       });

//       setSearchResults(results);
//     }
//   }, [originData, filterKeys, filterValues, targetAttributes]);

//   return searchResults;
// };

// export default useSearchOriginData;


// useSearchOriginData.js
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
