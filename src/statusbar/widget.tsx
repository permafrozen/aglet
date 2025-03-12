import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { Variable } from "astal";
import GLib from "gi://GLib?version=2.0";

const time = Variable("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format("%H:%M")!,
);

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
                <menubutton hexpand halign={Gtk.Align.CENTER}>
                    <label label={time()} />
                    <popover>
                        <Gtk.Calendar />
                    </popover>
                </menubutton>
            </centerbox>
        </window>
    );
}
