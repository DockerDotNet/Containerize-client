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

export interface ParamsType {
  pageSize?: number;
  current?: number;
  keyword?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type SortOrder = 'ascend' | 'descend';

export interface RequestResponse<T> {
  data: T[];
  success: boolean;
  total: number;
}