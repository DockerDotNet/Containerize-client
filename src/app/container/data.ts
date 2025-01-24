

export async function getContainers(filters?: Record<string, string[]>) {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_HOST}/api/containers`);
    url.searchParams.set('all', 'true');

    if (filters) {
        url.searchParams.set('filters', JSON.stringify(filters));
    }

    const res = await fetch(url.toString(), {
        cache: 'no-store',
    });
    return await res.json();
}
