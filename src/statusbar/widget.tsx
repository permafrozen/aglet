import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { Box } from "astal/gtk4/widget";

// Modules
import StatusModule from "./modules/status";
import SystemModule from "./modules/connection";
import PowerModule from "./modules/power";
import WorkspaceModule from "./modules/workspaces";

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
                    <WorkspaceModule />
                </Box>
                <Box cssName="meta">
                    <StatusModule />
                </Box>
                <Box cssName="info">
                    <PowerModule />
                    <SystemModule />
                </Box>
            </centerbox>
        </window>
    );
}
