'use client';

import React, { useState } from 'react';
import { ProTable, ProColumns, ProDescriptions, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { Badge, Drawer, Spin, Tooltip } from 'antd';
import { FaExternalLinkAlt } from "react-icons/fa";
import { getContainers } from "@/app/container/data";
import { classNames } from "@/utils";

interface Container {
    Id: string;
    Names: string[];
    Image: string;
    State: string;
    Status: string;
    Ports: {
        IP: string;
        PrivatePort: number;
        PublicPort: number;
        Type: string;
    }[];
}

const ContainerTable = () => {
    const [loading, setLoading] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [currentRow, setCurrentRow] = useState<Container>();
    const [localData, setLocalData] = useState<Container[]>([]);

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
            render: (_, record) => (
                <a className={classNames(!showDetail && "hover:underline")}
                    onClick={() => { setCurrentRow(record); setShowDetail(true); }}>
                    {record.Names?.[0]?.substring(1) || 'N/A'}
                </a>
            ),
            search: {
                transform: (value) => ({ name: [value] })
            }
        },
        {
            title: 'Image',
            dataIndex: 'Image',
            key: 'Image',
            sorter: (a, b) => a.Image.localeCompare(b.Image),
            search: {
                transform: (value) => ({ ancestor: [value] })
            }
        },
        {
            title: 'Ports',
            dataIndex: 'Ports',
            key: 'Ports',
            search: false,
            render: (_, record) => (
                record.Ports?.map((port, index) => (
                    port.PublicPort ? (
                        <div key={index}>
                            <a href={`http://${port.IP}:${port.PublicPort}`}
                                className='flex items-center gap-1 hover:underline'
                                target="_blank"
                                rel="noopener noreferrer">
                                <FaExternalLinkAlt />
                                {`${port.PublicPort}:${port.PrivatePort}`}
                            </a>
                        </div>
                    ) : '-'
                )) || 'N/A'
            ),
        },
        {
            title: 'Status',
            dataIndex: 'State',
            key: 'State',
            sorter: (a, b) => a.State.localeCompare(b.State),
            render: (_, record) => {
                const statusColors = {
                    running: 'success',
                    paused: 'warning',
                    exited: 'error',
                    dead: 'error',
                    stopped: 'default',
                    restarting: 'processing'
                };

                return (
                    <div className="flex gap-2">
                        <Tooltip title={record.State}>
                            <Badge status={statusColors[record.State as keyof typeof statusColors] || 'default'} />
                        </Tooltip>
                        <div>{record.Status}</div>
                    </div>
                );
            },
            filters: true,
            valueEnum: {
                running: { text: 'Running' },
                exited: { text: 'Exited' },
                paused: { text: 'Paused' },
                dead: { text: 'Dead' },
                stopped: { text: 'Stopped' },
                restarting: { text: 'Restarting' }
            },
            filterSearch: true,
        },
    ];

    const handleRequest = async (params: any) => {
        setLoading(true);
        try {
            // Server-side filtering
            const apiFilters: Record<string, string[]> = {};

            if (params.name) apiFilters.name = [params.name];
            if (params.ancestor) apiFilters.ancestor = [params.ancestor];
            if (params.State) apiFilters.status = Array.isArray(params.State) ? params.State : [params.State];

            // Fetch filtered data from server
            const filteredData = await getContainers(apiFilters);

            // Client-side sorting
            const sortedData = [...filteredData].sort((a, b) => {
                const sortKeyMap: Record<string, keyof Container> = {
                    Names: 'Names',
                    Image: 'Image',
                    State: 'State'
                };

                const sortKey = sortKeyMap[params.sortField] || 'Names';
                const order = params.sortOrder === 'ascend' ? 1 : -1;

                const aValue = sortKey === 'Names' ? a.Names[0] : a[sortKey];
                const bValue = sortKey === 'Names' ? b.Names[0] : b[sortKey];

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
                    pageSize: 10,
                    showSizeChanger: false,
                }}
                search={{
                    filterType: 'light',
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

            <Drawer
                width={600}
                open={showDetail}
                onClose={() => {
                    setCurrentRow(undefined);
                    setShowDetail(false);
                }}
                closable={false}
            >
                {currentRow?.Names && (
                    <ProDescriptions<Container>
                        column={2}
                        title={currentRow.Names[0].substring(1)}
                        dataSource={currentRow}
                        columns={columns as ProDescriptionsItemProps<Container>[]}
                    />
                )}
            </Drawer>
        </div>
    );
};

export default ContainerTable;