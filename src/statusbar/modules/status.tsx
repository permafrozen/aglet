import { GLib, Variable } from "astal";
import { Box, Label } from "astal/gtk4/widget";

export default function Time() {
    const time = Variable("").poll(
        1000,
        () => GLib.DateTime.new_now_local().format("%H:%M:%S")!,
    );

    return (
        <Box>
            <Label label={time()} />
        </Box>
    );
}
