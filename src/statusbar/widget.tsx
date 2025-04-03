import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { bind, Binding, timeout, Variable } from "astal";
import GLib from "gi://GLib?version=2.0";
import Battery from "gi://AstalBattery";
import Network from "gi://AstalNetwork";
import Hyprland from "gi://AstalHyprland?version=0.1";
import { Box, Button, Image, Label, Revealer } from "astal/gtk4/widget";

export default function Statusbar(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor;

    return (
        <window
            visible
            cssClasses={["statusbar"]}
            gdkmonitor={gdkmonitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={TOP | LEFT | RIGHT}
            application={App}
        >
            <centerbox cssName="centerbox">
                <Box cssName="hypr">
                    <Workspaces />
                </Box>
                <Box cssName="meta">
                    <Time />
                </Box>
                <Box cssName="info">
                    <Power />
                    <SysInfo />
                </Box>
            </centerbox>
        </window>
    );
}

function Time() {
    const time = Variable("").poll(
        1000,
        () => GLib.DateTime.new_now_local().format("%H:%M")!,
    );

    return (
        <Box>
            <Label label={time()} />
        </Box>
    );
}

function SysInfo() {
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

function Power() {
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

function Workspaces() {
    const hypr = Hyprland.get_default();
    const show = Variable(false);

    // Reveal after 400 ms
    timeout(400, () => show.set(true));

    return (
        <Revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
            reveal_child={bind(show).as(Boolean)}
        >
            <Box cssName="workspaces">
                {bind(hypr, "workspaces").as((wss) => {
                    const buttons = [];
                    wss.sort((a, b) => a.id - b.id);
                    for (const key in wss) {
                        const show = false;

                        buttons.push(
                            <Revealer
                                transition_duration={300}
                                transition_type={
                                    Gtk.RevealerTransitionType.SLIDE_RIGHT
                                }
                                reveal_child={bind(
                                    hypr,
                                    "focused_workspace",
                                ).as((fws) => {
                                    if (
                                        fws == wss[key] ||
                                        wss[key].last_client != null
                                    ) {
                                        return true;
                                    }
                                    return false;
                                })}
                            >
                                <Button
                                    cssClasses={bind(
                                        hypr,
                                        "focused_workspace",
                                    ).as((fws) =>
                                        fws == wss[key]
                                            ? ["focused"]
                                            : ["unfocused"],
                                    )}
                                >
                                    {wss[key].id}
                                </Button>
                            </Revealer>,
                        );
                    }
                    return buttons;
                })}
            </Box>
        </Revealer>
    );
}
