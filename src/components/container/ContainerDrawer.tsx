import { Drawer } from 'antd';
import { ProDescriptions, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { Container } from '@/app/container/types';



interface ContainerDrawerProps {
  open: boolean;
  onClose: () => void;
  currentRow?: Container;
  columns: ProDescriptionsItemProps<Container>[];
}

export const ContainerDrawer = ({ open, onClose, currentRow, columns }: ContainerDrawerProps) => (
  <Drawer width={600} open={open} onClose={onClose} closable={false}>
    {currentRow?.Names && (
      <ProDescriptions<Container>
        column={2}
        title={currentRow.Names[0].substring(1)}
        dataSource={currentRow}
        columns={columns}
      />
    )}
  </Drawer>
);