import React from 'react';
import {Header} from "antd/es/layout/layout";
import {DockerOutlined, RadarChartOutlined} from "@ant-design/icons";
import {Avatar} from "antd";
import {FaCircleUser, FaUser} from "react-icons/fa6";

const AppHeader = () => {
    return (
        <Header className="!bg-white border-b border-[#f1f1f1] flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <DockerOutlined className="text-3xl" />

                <div>Containerize</div>
            </div>
            <div className="flex items-center gap-2">
                <Avatar size={32} icon={<FaUser  />} />
                <div>Administrator</div>
            </div>
        </Header>
    );
};

export default AppHeader;