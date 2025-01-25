import { BadgeStatus } from '@/types/common';
import { Badge, Tooltip } from 'antd';

interface ContainerBadgeProps {
  state: string;
  statusText: string;
}

const statusColors: Record<string, BadgeStatus> = {
  running: 'success',
  paused: 'warning',
  exited: 'error',
  dead: 'error',
  stopped: 'default',
  restarting: 'processing',
};

export const ContainerBadge = ({ state, statusText }: ContainerBadgeProps) => (
  <div className="flex gap-2">
    <Tooltip title={state}>
      <Badge status={statusColors[state] || 'default'} />
    </Tooltip>
    <div>{statusText}</div>
  </div>
);