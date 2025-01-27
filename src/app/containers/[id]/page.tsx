/* eslint-disable react-hooks/exhaustive-deps */
'use client' // Required for client-side hooks

import { getContainer } from '@/app/containers/api';
import { DefaultTags } from '@/components/Tags';
import useContainerActions from '@/hooks/useContainerActions';
import { Button, Col, message, Row, Space, Table, Tabs, Tag, Typography } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PiBomb } from 'react-icons/pi';
import { VscDebugPause, VscDebugRestart, VscDebugStart, VscDebugStop, VscEdit, VscRefresh, VscTrash } from 'react-icons/vsc';

const { Title } = Typography;

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const containerId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [containerState, setContainerState] = useState<any>(null);

  const {
    isLoading,
    loadingAction,
    handleStart,
    handleStop,
    handleRestart,
    handleKill,
    isStartDisabled,
    isStopDisabled,
    isRestartDisabled,
    isKillDisabled,
    isPauseDisabled,
    isResumeDisabled,
    isRemoveDisabled,
    isRecreateDisabled,
    isEditDisabled,
  } = useContainerActions(containerId, () => {
    getContainer(containerId).then(setContainerState);
  });

  useEffect(() => {
    const fetchData = async () => {
      debugger
      try {
        const data = await getContainer(containerId);
        setContainerState(data);
      } catch (err) {
        console.error('Failed to fetch container data:', err);
        message.error('Failed to load container details');
      } finally {
        setLoading(false);
      }
    };

    if (containerId) fetchData();
  }, [containerId]);

  if (loading) return <div>Loading...</div>;
  if (!containerState) return <div>Container not found</div>;

  const environmentColumns = [
    {
      title: 'Variable',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const environmentData =
    containerState.Config?.Env?.map((envVar: string) => {
      const [key, ...valueParts] = envVar.split('=');
      return { key, value: valueParts.join('=') };
    }) || [];

  const networkItems = Object.entries(containerState.NetworkSettings?.Networks || {}).map(([networkName, network]: [string, any]) => ({
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
              { key: 'Name', value: containerState.Name.substring(1) },
              {
                key: 'Status',
                value: (
                  <Tag color={containerState.State?.Status === 'running' ? 'green' : 'red'}>
                    {containerState.State?.Status}
                  </Tag>
                ),
              },
              { key: 'Image', value: containerState.Config?.Image },
              { key: 'Command', value: `${containerState.Path} ${containerState.Args?.join(' ')}` },
              { key: 'Created', value: new Date(containerState.Created).toLocaleString() },
              { key: 'Started', value: new Date(containerState.State.StartedAt).toLocaleString() },
              ...(containerState?.State?.Status !== 'running'
                ? [
                  {
                    key: 'Finished',
                    value:
                      containerState.State.FinishedAt !== '0001-01-01T00:00:00Z'
                        ? new Date(containerState.State.FinishedAt).toLocaleString()
                        : 'N/A',
                  },
                ]
                : []),
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
                  { key: 'IP Address', value: containerState.NetworkSettings?.IPAddress || 'N/A' },
                  { key: 'Mac Address', value: containerState.NetworkSettings?.MacAddress || 'N/A' },
                  { key: 'Gateway', value: containerState.NetworkSettings?.Gateway || 'N/A' },
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
              <Title level={5} style={{ marginBottom: 12 }}>
                Ports
              </Title>
              <Table
                dataSource={Object.entries(containerState.NetworkSettings?.Ports || {}).map(([port, bindings]: [string, any]) => ({
                  key: port,
                  value: bindings?.map((b: any) => `${b.HostIp}:${b.HostPort}`).join(', ') || 'No bindings',
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

          <Title level={5} style={{ marginTop: 16 }}>
            Network Drivers
          </Title>
          <Tabs items={networkItems} size="small" />
        </div>
      ),
    },
    {
      key: 'environment',
      label: 'Environment Variables',
      children: (
        <div>
          <Title level={5}>All Environment Variables</Title>
          <Table
            dataSource={environmentData}
            columns={environmentColumns}
            pagination={false}
            bordered
            scroll={{ x: '50%' }}
            className="scrollbar-thin"
          />
        </div>
      ),
    },
    {
      key: 'labels',
      label: 'Labels',
      children: (
        <div>
          <Title level={5} style={{ marginTop: 24 }}>
            All Labels
          </Title>
          <Table
            dataSource={Object.entries(containerState.Config.Labels).map(([key, value]) => ({
              key,
              value
            }))}
            columns={[
              { title: 'Label', dataIndex: 'key' },
              { title: 'Value', dataIndex: 'value' },
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
    <div className="p-6">
      <div className="flex items-center justify-start space-x-3 mb-2">
        <Title level={2} style={{ margin: 0 }}>Container Details</Title>
        <VscRefresh className="text-3xl" onClick={() => getContainer(containerId).then(setContainerState)} />
      </div>


      <Space style={{ width: '100%' }} size='small' wrap>
        <Button
          color='green'
          variant='solid'
          icon={<VscDebugStart />}
          onClick={handleStart}
          size='small'
          loading={loadingAction == 'Start' && isLoading}
          disabled={isStartDisabled}
        >
          Start
        </Button>

        <Button
          type="primary"
          danger
          icon={<VscDebugStop />}
          size='small'
          onClick={handleStop}
          disabled={isStopDisabled}
          loading={loadingAction == 'Stop' ? isLoading : false}
        >
          Stop
        </Button>

        <Button
          color='orange'
          variant='solid'
          icon={<VscDebugRestart />}
          onClick={handleRestart}
          loading={loadingAction == 'Restart' ? isLoading : false}
          size='small'
          disabled={isRestartDisabled}
        >
          Restart
        </Button>

        <Button
          color='red'
          variant='solid'
          icon={<PiBomb />}
          onClick={handleKill}
          loading={loadingAction == 'Kill' ? isLoading : false}
          size='small'
          disabled={isKillDisabled}
        >
          Kill
        </Button>
        <Button
          color='red'
          variant="dashed"
          icon={<VscDebugPause />}
          // onClick={() => handleAction('pause')}
          disabled={isPauseDisabled}
          size='small'
        >
          Pause
        </Button>

        <Button
          color='green'
          variant='dashed'
          icon={<VscDebugStart />}
          // onClick={() => handleAction('resume')}
          size='small'
          disabled={isResumeDisabled}
        >
          Resume
        </Button>

        <Button
          color='red'
          variant="dashed"
          icon={<VscTrash />}
          // onClick={() => handleAction('remove')}
          size='small'
          disabled={isRemoveDisabled}
        >
          Remove
        </Button>
        <Button
          color='red'
          variant="dashed"
          icon={<VscRefresh />}
          // onClick={() => handleAction('recreate')}
          size='small'
          disabled={isRecreateDisabled}
        >
          Recreate
        </Button>
        <Button
          icon={<VscEdit />}
          // onClick={() => handleAction('edit')}
          danger
          size='small'
          disabled={isEditDisabled}
          type="dashed"
        >
        </Button>
      </Space>

      <Tabs defaultActiveKey="general" items={tabItems} />
    </div>
  );
}