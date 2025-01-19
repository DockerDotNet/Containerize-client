
export async function getContainers() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/containers?all=true`, {
        cache: 'no-store',
    });
    return await res.json();
}