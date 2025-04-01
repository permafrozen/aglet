import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { bind, Binding, timeout, Variable } from "astal";
import GLib from "gi://GLib?version=2.0";
import Battery from "gi://AstalBattery";
import Hyprland from "gi://AstalHyprland?version=0.1";
import { Box, Button, Revealer } from "astal/gtk4/widget";

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
                <Workspaces />
                <Time />
                <Power />
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
            <label label={time()} />
        </Box>
    );
}

function Power() {
    const battery = Battery.get_default();
    return (
        <Box cssName="battery">
            <label
                label={bind(battery, "percentage").as(
                    (p) => `${Math.floor(p * 100)} %`,
                )}
            />
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
