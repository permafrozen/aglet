import { bind, Variable } from "astal";
import { Box, Image } from "astal/gtk4/widget";
import Network from "gi://AstalNetwork";

const network = Network.get_default();

export default function SysInfo() {
    const connection = Variable("").poll(1000, () => getConnection());
    const connection_strenght = Variable("").poll(1000, () =>
        getConnectionStrenght(),
    );
    return (
        <Box>
            <Box cssClasses={["module"]}>{connection()}</Box>
            <Box cssClasses={["module"]}>{connection_strenght()}</Box>
        </Box>
    );
}

function getConnection() {
    return network.wifi.active_access_point.get_ssid()!;
}

function getConnectionStrenght() {
    return network.wifi.active_access_point.get_strength().toString()!;
}
