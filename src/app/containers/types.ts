/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Container {
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

export interface ContainerDetail {
  Id: string;
  Created: string;
  Path: string;
  Args: string[];
  State: {
    Status: string;
    Running: boolean;
    Paused: boolean;
    Restarting: boolean;
    OOMKilled: boolean;
    Dead: boolean;
    Pid: number;
    ExitCode: number;
    Error: string;
    StartedAt: string;
    FinishedAt: string;
  };
  Image: string;
  ResolvConfPath: string;
  HostnamePath: string;
  HostsPath: string;
  LogPath: string;
  Name: string;
  RestartCount: number;
  Driver: string;
  Platform: string;
  MountLabel: string;
  ProcessLabel: string;
  AppArmorProfile: string;
  ExecIDs: string[] | null;
  HostConfig: {
    NetworkMode: string;
    PortBindings: Record<string, Array<{ HostIp: string; HostPort: string }>>;
    RestartPolicy: {
      Name: string;
      MaximumRetryCount: number;
    };
    Binds?: string[];
    // Add other HostConfig properties as needed
  };
  GraphDriver: {
    Data: any;
    Name: string;
  };
  Mounts: Array<{
    Type: string;
    Source: string;
    Destination: string;
    Mode: string;
    RW: boolean;
    Propagation: string;
    Name?: string;
    Driver?: string;
  }>;
  Config: {
    Hostname: string;
    Image: string;
    Env: string[];
    Cmd: string[];
    WorkingDir: string;
    Entrypoint?: string[];
    Labels: Record<string, string>;
    StopSignal?: string;
    ExposedPorts?: Record<string, unknown>;
    User?: string;
    Volumes?: Record<string, unknown>;
    // Add other Config properties as needed
  };
  NetworkSettings: {
    Networks: Record<
      string,
      {
        DNSNames: string[];
        IPAMConfig?: unknown;
        Links?: string[];
        Aliases?: string[];
        NetworkID: string;
        EndpointID: string;
        Gateway: string;
        IPAddress: string;
        IPPrefixLen: number;
        IPv6Gateway: string;
        GlobalIPv6Address: string;
        MacAddress: string;
        DriverOpts?: unknown;
      }
    >;
    Ports: Record<string, Array<{ HostIp: string; HostPort: string }> | null>;
    Gateway: string;
    IPAddress: string;
    IPPrefixLen: number;
    MacAddress: string;
    Bridge?: string;
    SandboxID?: string;
    HairpinMode?: boolean;
    // Add other NetworkSettings properties as needed
  };
}

export interface ParamsType {
  pageSize?: number;
  current?: number;
  keyword?: string;
  [key: string]: any;
}

export type SortOrder = 'ascend' | 'descend';

export interface RequestResponse<T> {
  data: T[];
  success: boolean;
  total: number;
}