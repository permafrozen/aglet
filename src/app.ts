import { App } from "astal/gtk4";
import Statusbar from "./statusbar/widget";
import style from "./statusbar/default.scss";
import colors from "./statusbar/colors.css";

App.start({
    css: style + colors, // colors -> that sass can't handle
    main() {
        App.get_monitors().map(Statusbar);
    },
});
