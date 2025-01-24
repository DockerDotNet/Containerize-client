import ContainerTable from './ContainerTable';
import { getContainers } from "@/app/container/data";

// Fetch data from the API on the server side
export default async function Page() {

    return <ContainerTable />;
}
