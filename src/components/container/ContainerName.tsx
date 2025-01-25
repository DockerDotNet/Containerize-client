import { classNames } from "@/utils/common";

interface ContainerNameProps {
    names: string[];
    showDetail: boolean;
    onClick: () => void;
}

export const ContainerName = ({ names, showDetail, onClick }: ContainerNameProps) => {
    // Process the name inside the component
    const name = names?.[0]?.substring(1) || 'N/A';

    return (
        <a className={classNames(!showDetail && 'hover:underline')} onClick={onClick}>
            {name}
        </a>
    );
};