import { bind } from "astal";
import { Box, Label, Image } from "astal/gtk4/widget";
import Battery from "gi://AstalBattery";

export default function Power() {
    const battery = Battery.get_default();
    return (
        <Box cssName="battery">
            {bind(battery, "is_battery").as((is_bat) => {
                if (is_bat) {
                    return (
                        <Box>
                            <Box cssClasses={["module"]}>
                                {bind(battery, "percentage").as((p) => {
                                    return `${Math.floor(p * 100)}`;
                                })}
                                <Image icon_name={bind(battery, "icon_name")} />
                            </Box>
                            <Box cssClasses={["module"]}>
                                {bind(battery, "energy_rate").as(
                                    (er) => `${Math.round(er)}W`,
                                )}
                            </Box>
                        </Box>
                    );
                } else return <Label> label="No Battery"</Label>;
            })}
        </Box>
    );
}
