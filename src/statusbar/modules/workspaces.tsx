import { bind, Binding, timeout, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import { Box, Button, Image, Label, Revealer } from "astal/gtk4/widget";
import Hyprland from "gi://AstalHyprland?version=0.1";

export default function Workspaces() {
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
