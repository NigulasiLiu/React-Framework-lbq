// FileIntegrityContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface DataState {
    [key: string]: any; // 这里的 any 可以根据您的数据结构进行更精确的类型定义
}
const FileIntegrityContext = createContext<any>({});

export const useFileIntegrityData = () => useContext(FileIntegrityContext);

export const FileIntegrityProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<DataState>({});

    // 从多个接口获取数据的函数
    const fetchDataFromEndpoints = (endpoints: string[]) => {
        endpoints.forEach(endpoint => {
            axios.get(endpoint)
                .then(response => {
                    setData(prevData => ({
                        ...prevData,
                        [endpoint]: response.data
                    }));
                })
                .catch(error => console.error(`Error fetching data from ${endpoint}:`, error));
        });
    };

    useEffect(() => {
        // 定义你想要获取数据的接口
        const endpoints = ['/server/FileIntegrityInfo', '/server/BaselineDetect'];
        fetchDataFromEndpoints(endpoints);
    }, []);

    return (
        <FileIntegrityContext.Provider value={data}>
            {children}
        </FileIntegrityContext.Provider>
    );
};
