#!/usr/bin/env bash
# inspired by @ricecracker2234 on dc

reload() {
    pkill gjs
    ags run ./src/app.ts --gtk4 &
}

ags quit
reload

while inotifywait -e close_write -r ./src; do
    reload
done
