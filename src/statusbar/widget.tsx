import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { bind, Variable } from "astal";
import GLib from "gi://GLib?version=2.0";
import Battery from "gi://AstalBattery";
import Hyprland from "gi://AstalHyprland?version=0.1";

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
        <menubutton hexpand halign={Gtk.Align.CENTER}>
            <label label={time()} />
            <popover cssName="calender">
                <Gtk.Calendar />
            </popover>
        </menubutton>
    );
}

function Power() {
    const battery = Battery.get_default();
    return (
        <menubutton cssName="time" hexpand halign={Gtk.Align.END}>
            <label
                label={bind(battery, "percentage").as(
                    (p) => `${Math.floor(p * 100)} %`,
                )}
            />
        </menubutton>
    );
}

function Workspaces() {
    const hyprland = Hyprland.get_default();
    return (
        <box hexpand halign={Gtk.Align.START} cssName={"workspaces"}>
            {bind(hyprland, "workspaces").as((workspaces) =>
                workspaces
                    .sort((a, b) => a.id - b.id)
                    .map((workspace) => (
                        <button
                            cssClasses={bind(hyprland, "focused_workspace").as(
                                (focused) =>
                                    focused == workspace
                                        ? ["focused"]
                                        : ["unfocused"], // @cafetestrest on dc helped troubleshoot
                            )}
                        >
                            {workspace.id}
                        </button>
                    )),
            )}
        </box>
    );
}
