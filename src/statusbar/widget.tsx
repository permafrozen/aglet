import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { bind, Variable } from "astal";
import GLib from "gi://GLib?version=2.0";
import Battery from "gi://AstalBattery";

export default function Statusbar(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor;

    return (
        <window
            visible
            cssClasses={["Statusbar"]}
            gdkmonitor={gdkmonitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={TOP | LEFT | RIGHT}
            application={App}
        >
            <centerbox cssName="centerbox">
                <box />
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
        <menubutton hexpand halign={Gtk.Align.END}>
            <label
                label={bind(battery, "percentage").as(
                    (p) => `${Math.floor(p * 100)} %`,
                )}
            />
        </menubutton>
    );
}
