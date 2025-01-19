'use client';

import React, { useEffect, useState } from 'react';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import {Badge, Spin, Tooltip} from 'antd';
import {getContainers} from "@/app/container/data";
import {FaExternalLinkAlt} from "react-icons/fa";

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

const columns: ProColumns<Container>[] = [
    {
        title: 'Container ID',
        dataIndex: 'Id',
        key: 'Id',
        copyable: true,
        ellipsis: true,
        width: 120,
    },
    {
        title: 'Name',
        dataIndex: 'Names',
        key: 'Names',
        render: (_,record: Container): string => record.Names?.[0].substring(1) || 'N/A',
        search: false,
    },
    {
        title: 'Image',
        dataIndex: 'Image',
        key: 'Image',
        // ellipsis: true,
    },
    {
        title: 'Ports',
        dataIndex: 'Ports',
        key: 'Ports',
        render: (_, record: Container) => {
            if (!record.Ports || record.Ports.length === 0) return 'N/A';
            return record.Ports.map((port, index) => {
                const { IP, PublicPort, PrivatePort } = port;
                const url = `http://${IP}:${PublicPort}`;
                return (
                    <div key={index}>
                        {
                            PublicPort ? (<a href={url} className='flex items-center gap-1 hover:underline' target="_blank" rel="noopener noreferrer">
                                <FaExternalLinkAlt />{`${PublicPort}:${PrivatePort}`}
                            </a>) : '-'

                        }
                    </div>
                );
            });
        },
    },
    {
        title: 'Status',
        dataIndex: 'State',
        key: 'State',
        render: (_, record: Container) => {
            let color: any = 'default';
            let badgeText = '';

            // Determine badge color based on 'State'
            switch (record.State) {
                case 'running':
                    color = 'success'; // Green
                    badgeText = 'Running';
                    break;
                case 'paused':
                    color = 'warning'; // Yellow
                    badgeText = 'Paused';
                    break;
                case 'stopped':
                    color = 'default'; // Grey
                    badgeText = 'Stopped';
                    break;
                case 'exited':
                    color = 'error'; // Red
                    badgeText = 'Exited';
                    break;
                case 'dead':
                    color = 'error'; // Dark Red or Black
                    badgeText = 'Dead';
                    break;
                case 'restarting':
                    color = 'processing'; // Blue
                    badgeText = 'Restarting';
                    break;
                default:
                    color = undefined; // Light Grey
                    badgeText = 'Unknown';
            }

            return (
                <div className="flex gap-2">
                    <Tooltip title={badgeText}><Badge status={color} /></Tooltip>
                    <div>{record.Status}</div> {/* Display the Status text */}
                </div>
            );
        },
        filters: true,
        valueEnum: {
            running: { text: 'Running', status: 'running' },
            stopped: { text: 'Stopped', status: 'exited' },
            paused: { text: 'Paused', status: 'paused' },
        },
    },
];

const ContainerTable = ({ data }: { data: Container[] }) => {
    const [clientData, setClientData] = useState<Container[] | null>(null);

    // Set data in client-side state after mount
    useEffect(() => {
        if (data) {
            setClientData(data);
        }
    }, [data]);

    if (!clientData) return <div className='text-center'><Spin size={"large"} /> </div>; // Loading state

    return (
        <div style={{ padding: '20px' }}>
            <ProTable<Container>
                columns={columns}
                options={{reload: async () => {
                        setClientData( await getContainers())
                    }}}
                dataSource={clientData}
                rowKey="Id"
                pagination={{
                    pageSize: 10,
                }}
                search={{
                    labelWidth: 'auto',
                }}
                dateFormatter="string"
                headerTitle="Container Management"

            />
        </div>
    );
};

export default ContainerTable;
