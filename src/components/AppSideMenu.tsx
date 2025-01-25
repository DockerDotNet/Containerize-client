"use client";

import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useState } from 'react';

const AppSideMenu = () => {
    const pathname = usePathname();
    const [selectedLink, setSelectedLink] = useState([""]);

    useLayoutEffect(() => {
        if(pathname.startsWith("/containers")){
            setSelectedLink(["2"])
        }else{
            setSelectedLink(["1"])
        }
    }, [pathname]);


    const menuItems = [
        {label: <Link href="/">Dashboard</Link>, key: 1 },
        {label: <Link href="/containers">Containers</Link>, key: 2 },
    ]
    return (
        <Menu mode="inline" items={menuItems} selectedKeys={selectedLink} />
    );
};

export default AppSideMenu;