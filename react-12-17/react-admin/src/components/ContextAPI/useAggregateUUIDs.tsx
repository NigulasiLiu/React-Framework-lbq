import { useEffect, useState } from 'react';

const useAggregateUUIDs = (dataArrays: any[]) => {
    const [uniqueHostCount, setUniqueHostCount] = useState(0);

    useEffect(() => {
        const uuidSet = new Set();

        dataArrays.forEach(data => {
            data.typeCount.forEach((count: any, uuid: string) => {
                uuidSet.add(uuid);
            });
        });

        setUniqueHostCount(uuidSet.size);
    }, [dataArrays]);

    return uniqueHostCount;
};
export default useAggregateUUIDs;

