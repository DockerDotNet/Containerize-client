/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { getContainers } from "@/app/containers/api";
import { ParamsType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useState } from 'react';
import { ContainerBadge } from "./ContainerBadge";

import { Container, RequestResponse } from "@/app/containers/types";
import { compareContainersByPorts } from "@/utils/containerUtils";
import ContainerDrawer from "./ContainerDrawer";
import { ContainerName } from "./ContainerName";
import { ContainerPorts } from "./ContainerPorts";


const ContainerTable = () => {
    const [loading, setLoading] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [currentRow, setCurrentRow] = useState<Container>();
    const [localData, setLocalData] = useState<Container[]>([]);
    const [pagination, setPagination] = useState({
        current: 1, // Current page number
        pageSize: 10, // Number of items per page
    });

    const handleNameClick = (record: Container) => {
        setCurrentRow(record);
        setShowDetail(true);
    }

    const columns: ProColumns<Container>[] = [
        {
            title: 'Container ID',
            dataIndex: 'Id',
            key: 'Id',
            copyable: true,
            ellipsis: true,
            width: 120,
            search: false
        },
        {
            title: 'Name',
            dataIndex: 'Names',
            key: 'Names',
            sorter: (a, b) => (a.Names?.[0] || '').localeCompare(b.Names?.[0] || ''),
            render: (_, record) => <ContainerName names={record.Names} showDetail={showDetail} onClick={() => handleNameClick(record)} />,
            search: {
                transform: (value) => ({ name: [value] })
            }
        },
        {
            title: 'Image',
            dataIndex: 'Image',
            key: 'Image',
            sorter: (a, b) => a.Image.localeCompare(b.Image),
            search: false
        },
        {
            title: 'Ports',
            dataIndex: 'Ports',
            key: 'Ports',
            search: false,
            sorter: (a, b) => compareContainersByPorts(a, b),
            render: (_, record) => <ContainerPorts ports={record.Ports} />,
        },
        {
            title: 'Status',
            dataIndex: 'State',
            key: 'State',
            sorter: (a, b) => a.State.localeCompare(b.State),
            render: (_, record) => <ContainerBadge state={record.State} statusText={record.Status} />,
            filters: true,
            valueEnum: {
                running: { text: 'Running' },
                exited: { text: 'Exited' },
                paused: { text: 'Paused' },
                dead: { text: 'Dead' },
                stopped: { text: 'Stopped' },
                restarting: { text: 'Restarting' }
            },
            search: {
                transform: (value) => ({ status: [value] })
            },
            filterSearch: true,
        },
    ];

    const handlePaginationChange = (current: number, pageSize: number) => {
        setPagination({ current, pageSize });
    };

    const handleRequest = async (
        params: ParamsType & {
            pageSize?: number;
            current?: number;
            keyword?: string;
        }, sort: any, filter: Record<string, (string | number)[] | null>
    ): Promise<RequestResponse<Container>> => {
        setLoading(true);
        try {
            // Server-side filtering
            const apiFilters: Record<string, string[]> = {};

            // Direct filter mapping
            if (params.name) apiFilters.name = [params.name];
            if (params.ancestor) apiFilters.ancestor = [params.ancestor];
            if (params.status) {
                apiFilters.status = Array.isArray(params.status)
                    ? params.status
                    : [params.status];
            }
            if (filter && filter['State']) {
                apiFilters.status = filter['State'] as string[];
            }

            // Fetch filtered data from server
            const filteredData = await getContainers(apiFilters);

            // Client-side sorting
            const sortedData = [...filteredData].sort((a, b) => {
                const sortKey = params.sortField || 'Names';
                const order = params.sort?.[sortKey] === 'ascend' ? 1 : -1;

                let aValue, bValue;

                if (sortKey === 'Names') {
                    aValue = a.Names[0];
                    bValue = b.Names[0];
                } else if (sortKey === 'Ports') {
                    return order * compareContainersByPorts(a, b);
                } else {
                    aValue = a[sortKey as keyof Container];
                    bValue = b[sortKey as keyof Container];
                }

                return order * String(aValue).localeCompare(String(bValue));
            });

            setLocalData(sortedData);

            return {
                data: sortedData,
                success: true,
                total: sortedData.length,
            };
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <ProTable<Container>
                columns={columns}
                request={handleRequest}
                rowKey="Id"
                dataSource={localData}
                pagination={{
                    current: pagination.current, // Current page number
                    pageSize: pagination.pageSize, // Number of items per page
                    showSizeChanger: true, // Enable page size changer
                    onChange: handlePaginationChange, // Handle page change
                    onShowSizeChange: handlePaginationChange, // Handle page size change
                }}
                search={{
                    filterType: 'query',
                    labelWidth: 'auto',
                }}
                options={{
                    density: false,
                    reload: async () => {
                        setLoading(true);
                        try {
                            const data = await getContainers();
                            setLocalData(data);
                        } finally {
                            setLoading(false);
                        }
                    }
                }}
                loading={loading}
                dateFormatter="string"
                headerTitle="Container Management"
            />

            <ContainerDrawer
                open={showDetail}
                onClose={() => {
                    setCurrentRow(undefined);
                    setShowDetail(false);
                }}
                containerId={currentRow?.Id || ''}
            // columns={columns as ProDescriptionsItemProps<Container>[]}
            />
        </div>
    );
};

export default ContainerTable;