import { Container } from "./types";

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