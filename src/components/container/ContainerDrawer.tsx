/* eslint-disable react-hooks/exhaustive-deps */
import { getContainer } from '@/app/containers/api';
import { Button, Col, Drawer, message, Row, Space, Table, Tabs, Tag, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { DefaultTags } from '../Tags';
import { VscDebugPause, VscDebugRestart, VscDebugStart, VscDebugStop, VscEdit, VscRefresh, VscTrash } from 'react-icons/vsc';
import { PiBomb } from 'react-icons/pi';
import useContainerActions from '@/hooks/useContainerActions';

const { Title } = Typography;

interface ContainerDrawerProps {
  open: boolean;
  onClose: () => void;
  containerId: string; // Pass the container ID to fetch data
}

const ContainerDrawer: React.FC<ContainerDrawerProps> = ({ open, onClose, containerId }) => {
  const router = useRouter()

  const {
    isLoading,
    loadingAction,
    handleStart,
    handleStop,
    handleRestart,
    handleKill,
    // handlePause,
    // handleResume,
    // handleRemove,
    // handleRecreate,
    // handleEdit,
    isStartDisabled,
    isStopDisabled,
    isRestartDisabled,
    isKillDisabled,
    isPauseDisabled,
    isResumeDisabled,
    isRemoveDisabled,
    isRecreateDisabled,
    isEditDisabled,
    containerState,
    setContainerState,
  } = useContainerActions(containerId, () => {
    // Refresh container data after a successful action
    getContainer(containerId).then(setContainerState);
  });

  useEffect(() => {
    const fetchData = async () => {
      if (open && containerId) {
        try {
          const data = await getContainer(containerId);
          setContainerState(data);
        } catch (err) {
          console.error('Failed to fetch container data:', err);
        }
      } else {
        setContainerState(null);
      }
    };

    fetchData();
  }, [open, containerId]);

  const handleAction = async (action: string) => {
    message.open({
      content: `${action} action triggered.`,
      type: 'loading',
    });
  };

  if (!containerState) return null;

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

  const environmentData = containerState.Config?.Env?.map((envVar) => {
    const [key, ...valueParts] = envVar.split('=');
    return { key, value: valueParts.join('=') };
  }) || [];

  const networkItems = Object.entries(containerState.NetworkSettings?.Networks || {}).map(([networkName, network]) => ({
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
                key: 'Status', value: <Tag color={containerState.State?.Status === 'running' ? 'green' : 'red'}>
                  {containerState.State?.Status}
                </Tag>
              },
              { key: 'Image', value: containerState.Config?.Image },
              { key: 'Command', value: `${containerState.Path} ${containerState.Args?.join(' ')}` },
              { key: 'Created', value: new Date(containerState.Created).toLocaleString() },
              { key: 'Started', value: new Date(containerState.State.StartedAt).toLocaleString() },
              ...(containerState?.State?.Status !== "running"
                ? [
                  {
                    key: 'Finished',
                    value:
                      containerState.State.FinishedAt !== "0001-01-01T00:00:00Z"
                        ? new Date(containerState.State.FinishedAt).toLocaleString()
                        : "N/A",
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
              <Title level={5} style={{ marginBottom: 12 }}>Ports</Title>
              <Table
                dataSource={Object.entries(containerState.NetworkSettings?.Ports || {}).map(([port, bindings]) => ({
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
        <div>
          <Title level={5}>All Environment Variables</Title>
          <Table
            dataSource={environmentData}
            columns={environmentColumns}
            pagination={false}
            bordered
            scroll={{ x: '50%' }}
            className='scrollbar-thin'
          />
        </div>
      ),
    },
    {
      key: 'labels',
      label: 'Labels',
      children: (
        <div>
          <Title level={5} style={{ marginTop: 24 }}>All Labels</Title>
          <Table
            dataSource={Object.entries(containerState.Config.Labels).map(([key, value]) => ({
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
          onClick={() => handleAction('pause')}
          disabled={isPauseDisabled}
          size='small'
        >
          Pause
        </Button>

        <Button
          color='green'
          variant='dashed'
          icon={<VscDebugStart />}
          onClick={() => handleAction('resume')}
          size='small'
          disabled={isResumeDisabled}
        >
          Resume
        </Button>

        <Button
          color='red'
          variant="dashed"
          icon={<VscTrash />}
          onClick={() => handleAction('remove')}
          size='small'
          disabled={isRemoveDisabled}
        >
          Remove
        </Button>
        <Button
          color='red'
          variant="dashed"
          icon={<VscRefresh />}
          onClick={() => handleAction('recreate')}
          size='small'
          disabled={isRecreateDisabled}
        >
          Recreate
        </Button>
        <Button
          icon={<VscEdit />}
          onClick={() => handleAction('edit')}
          danger
          size='small'
          disabled={isEditDisabled}
          type="dashed"
        >
        </Button>
      </Space>

      <Tabs defaultActiveKey="general" items={tabItems} />
    </Drawer>
  );
};

export default ContainerDrawer;
