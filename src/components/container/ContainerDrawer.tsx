import { getContainer } from '@/app/containers/data';
import { ContainerDetail } from '@/app/containers/types';
import { Button, Col, Drawer, message, Row, Space, Table, Tabs, Tag, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { DefaultTags } from '../Tags';
import { VscDebugPause, VscDebugRestart, VscDebugStart, VscDebugStop, VscTrash } from 'react-icons/vsc';
import { PiBomb } from 'react-icons/pi';

const { Title } = Typography;

interface ContainerDrawerProps {
  open: boolean;
  onClose: () => void;
  containerId: string; // Pass the container ID to fetch data
}

const ContainerDrawer: React.FC<ContainerDrawerProps> = ({ open, onClose, containerId }) => {
  const [containerData, setContainerData] = useState<ContainerDetail | null>(null);
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      if (open && containerId) {
        try {
          const data = await getContainer(containerId);
          setContainerData(data);
        } catch (err) {
          console.error('Failed to fetch container data:', err);
        }
      } else {
        setContainerData(null);
      }
    };

    fetchData();
  }, [open, containerId]);

  const handleAction = async (action: string) => {
    message.info(`${action} action triggered.`);
    // Add API integration here for the respective action (start, stop, kill, restart, etc.)
    try {
      // Example:
      // await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/containers/${containerId}/${action}`, { method: 'POST' });
    } catch (error) {
      console.error(`${action} failed:`, error);
    }
  };

  if (!containerData) return null;

  const environmentColumns = [
    {
      title: 'Variable',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value'
    },
  ];

  const environmentData = containerData.Config?.Env?.map((envVar) => {
    const [key, ...valueParts] = envVar.split('=');
    return { key, value: valueParts.join('=') };
  }) || [];

  const networkItems = Object.entries(containerData.NetworkSettings?.Networks || {}).map(([networkName, network]) => ({
    key: networkName,
    label: networkName,
    children: (
      <Table
        dataSource={[
          { key: 'IP Address', value: network.IPAddress || 'N/A' },
          { key: 'Gateway', value: network.Gateway || 'N/A' },
          { key: 'Mac Address', value: network.MacAddress || 'N/A' },
          { key: 'Network ID', value: network.NetworkID },
          { key: 'DNS Names', value: network.DNSNames && network.DNSNames.length > 0 ? <DefaultTags tags={network.DNSNames} /> : 'N/A' },
          { key: 'Aliases', value: network.Aliases && network.Aliases.length > 0 ? <DefaultTags tags={network.Aliases} /> : 'N/A' },
        ]}
        columns={[
          { title: 'Field', dataIndex: 'key', key: 'key' },
          { title: 'Value', dataIndex: 'value', key: 'value' },
        ]}
        pagination={false}
        bordered
        size="small"
      />
    ),
  }));

  const tabItems = [
    {
      key: 'general',
      label: 'General',
      children: (
        <div>
          <Title level={5}>General Information</Title>
          <Table
            dataSource={[
              { key: 'Name', value: containerData.Name.substring(1) },
              {
                key: 'Status', value: <Tag color={containerData.State?.Status === 'running' ? 'green' : 'red'}>
                  {containerData.State?.Status}
                </Tag>
              },
              { key: 'Image', value: containerData.Config?.Image },
              { key: 'Command', value: `${containerData.Path} ${containerData.Args?.join(' ')}` },
              { key: 'Created', value: new Date(containerData.Created).toLocaleString() },
            ]}
            columns={[
              { title: 'Field', dataIndex: 'key', key: 'key' },
              { title: 'Value', dataIndex: 'value', key: 'value' },
            ]}
            pagination={false}
            bordered
          />
        </div>
      ),
    },
    {
      key: 'network',
      label: 'Network',
      children: (
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Title level={5}>Network Settings</Title>
              <Table
                dataSource={[
                  { key: 'IP Address', value: containerData.NetworkSettings?.IPAddress || 'N/A' },
                  { key: 'Mac Address', value: containerData.NetworkSettings?.MacAddress || 'N/A' },
                  { key: 'Gateway', value: containerData.NetworkSettings?.Gateway || 'N/A' },
                ]}
                columns={[
                  { title: 'Field', dataIndex: 'key', key: 'key' },
                  { title: 'Value', dataIndex: 'value', key: 'value' },
                ]}
                pagination={false}
                bordered
                size="small"
              />
            </Col>
            <Col span={12}>
              <Title level={5} style={{ marginBottom: 12 }}>Ports</Title>
              <Table
                dataSource={Object.entries(containerData.NetworkSettings?.Ports || {}).map(([port, bindings]) => ({
                  key: port,
                  value: bindings?.map((b) => `${b.HostIp}:${b.HostPort}`).join(', ') || 'No bindings',
                }))}
                columns={[
                  { title: 'Port', dataIndex: 'key', key: 'key' },
                  { title: 'Bindings', dataIndex: 'value', key: 'value' },
                ]}
                pagination={false}
                bordered
                size="small"
              />
            </Col>
          </Row>

          <Title level={5} style={{ marginTop: 16 }}>Network Drivers</Title>
          <Tabs items={networkItems} size="small" />
        </div>
      ),
    },
    {
      key: 'environment',
      label: 'Environment Variables',
      children: (
        <Row>
          <Title level={5}>All Environment Variables</Title>
          <Table
            dataSource={environmentData}
            columns={environmentColumns}
            pagination={false}
            bordered
            scroll={{ x: '50%' }}
            className='scrollbar-thin'
          />
        </Row>
      ),
    },
    {
      key: 'labels',
      label: 'Labels',
      children: (
        <div>
          <Title level={5} style={{ marginTop: 24 }}>All Labels</Title>
          <Table
            dataSource={Object.entries(containerData.Config.Labels).map(([key, value]) => ({
              key,
              value
            }))}
            columns={[
              { title: 'Label', dataIndex: 'key' },
              { title: 'Value', dataIndex: 'value' }
            ]}
            pagination={false}
            bordered
            size="small"
          />
        </div>
      ),
    },
  ];

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Container Details</Title>
          <Button
            type="text"
            icon={<FaExternalLinkAlt size={16} />}
            onClick={() => router.push(`/containers/${containerId}`)} />
        </div>
      }
      width={800}
      open={open}
      onClose={onClose}
      closable
    >
      <Space style={{ width: '100%' }}>
        {/* Primary Actions Row */}
        <Space wrap>
          <Button
            type="primary"
            icon={<VscDebugStart />}
            onClick={() => handleAction('start')}
            style={{ background: '#52c41a', borderColor: '#52c41a' }}
          >
            Start
          </Button>

          <Button
            type="primary"
            danger
            icon={<VscDebugStop />}
            onClick={() => handleAction('stop')}
          >
            Stop
          </Button>

          <Button
            type="primary"
            icon={<VscDebugRestart />}
            onClick={() => handleAction('restart')}
            style={{ background: '#faad14', borderColor: '#faad14' }}
          >
            Restart
          </Button>

          <Button
            type="primary"
            danger
            icon={<PiBomb />}
            onClick={() => handleAction('kill')}
            style={{ background: '#cf1322', borderColor: '#cf1322' }}
          >
            Kill
          </Button>
        </Space>

        {/* Secondary Actions Row */}
        <Space wrap>
          <Button
            icon={<VscDebugPause />}
            onClick={() => handleAction('pause')}
            type="dashed"
          >
            Pause
          </Button>

          <Button
            icon={<VscDebugStart />}
            onClick={() => handleAction('resume')}
            type="dashed"
            style={{ color: '#52c41a', borderColor: '#52c41a' }}
          >
            Resume
          </Button>

          <Button
            icon={<VscTrash />}
            onClick={() => handleAction('remove')}
            danger
            type="dashed"
          >
            Remove
          </Button>
        </Space>
      </Space>

      <Tabs defaultActiveKey="general" items={tabItems} />
    </Drawer>
  );
};

export default ContainerDrawer;
