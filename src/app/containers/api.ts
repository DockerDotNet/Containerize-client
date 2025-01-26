import { successRequest } from "@/constants";
import { Container, ContainerDetail } from "./types";

export async function getContainers(filters?: Record<string, string[]>): Promise<Container[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_HOST}/api/containers`);
  url.searchParams.set('all', 'true');

  if (filters) {
    Object.entries(filters).forEach(([key, values]) => {
      values.forEach(value => {
        url.searchParams.append(`filters[${key}][${value}]`, 'true');
      });
    });
  }

  const res = await fetch(url.toString(), { cache: 'no-store' });
  return await res.json();
}

export async function getContainer(id: string): Promise<ContainerDetail> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/containers/${id}`, { cache: 'no-store' });
  return await res.json();
}

export async function startContainer(id:string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/containers/${id}/start`, { method: 'POST' });
  return await successRequest.includes(res.status) ? true : false;
}

export async function stopContainer(id:string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/containers/${id}/stop`, { method: 'POST' });
  return await successRequest.includes(res.status) ? true : false;
}

export async function restartContainer(id:string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/containers/${id}/restart`, { method: 'POST' });
  return await successRequest.includes(res.status) ? true : false;
}

export async function killContainer(id:string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/containers/${id}/kill`, { method: 'POST' });
  return await successRequest.includes(res.status) ? true : false;
}