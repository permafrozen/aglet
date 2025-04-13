import { bind } from "astal";
import { Box, Image } from "astal/gtk4/widget";
import Network from "gi://AstalNetwork";

export default function SysInfo() {
    const network = Network.get_default();
    return (
        <Box>
            <Box cssClasses={["module"]}>
                {bind(network, "wifi").as((wifi) =>
                    wifi.active_connection.connection
                        .get_interface_name()
                        .toString(),
                )}
            </Box>
            <Box cssClasses={["module"]}>
                {bind(network, "wifi").as(
                    (wifi) => wifi.active_access_point.ssid,
                )}
            </Box>
            <Box cssClasses={["module"]}>
                {bind(network, "wifi").as(
                    (wifi) => wifi.active_access_point.strength,
                )}
                <Image
                    icon_name={bind(network, "wifi").as((wifi) =>
                        wifi.get_icon_name(),
                    )}
                />
            </Box>
        </Box>
    );
}
