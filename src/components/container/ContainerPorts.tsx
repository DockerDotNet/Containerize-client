import { Container } from '@/app/container/types';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface ContainerPortsProps {
  ports: Container['Ports'];
}

export const ContainerPorts = ({ ports }: ContainerPortsProps) => {
  if (!ports || ports.length === 0) return 'N/A';

  return (
    <>
      {ports.map((port, index) =>
        port.PublicPort ? (
          <div key={index}>
            <a
              href={`http://${port.IP}:${port.PublicPort}`}
              className="flex items-center gap-1 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaExternalLinkAlt />
              {`${port.PublicPort}:${port.PrivatePort}`}
            </a>
          </div>
        ) : (
          '-'
        )
      )}
    </>
  );
};