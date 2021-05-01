#!/bin/bash
declare -a simulators=("DAB58B7F-A719-4305-B0CD-52BA9D73D2A6" "BDF0160B-54B2-49B9-A9F5-96075F6D691C")

for i in "${simulators[@]}"
do
    xcrun instruments -w $i
    xcrun simctl install $i ~/.expo/ios-simulator-app-cache/Exponent-2.14.1.app
    xcrun simctl openurl $i exp://127.0.0.1:19000
done
