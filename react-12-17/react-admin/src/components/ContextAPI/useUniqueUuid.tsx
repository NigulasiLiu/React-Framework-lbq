import { useEffect, useState } from 'react';

const useUniqueUUIDCounts = (agentOriginData: any) => {
    const [hostCount, setHostCount] = useState(0);

    useEffect(() => {
        if (agentOriginData) {
            const uniqueUUIDs = new Set();

            const agentDataArray = Array.isArray(agentOriginData) ? agentOriginData : [agentOriginData];
            agentDataArray.forEach(item => {
                uniqueUUIDs.add(item.uuid);
            });

            setHostCount(uniqueUUIDs.size);
        }
    }, [agentOriginData]);

    return hostCount;
};

export default useUniqueUUIDCounts;
