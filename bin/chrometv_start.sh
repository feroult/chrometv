#!/bin/sh
KEY=0AiEZezeUULf3dHVwZi16dmNtTzRRWDVodHNuTnRUdXc

# prevent top messages saying last session is broken
sed -i 's/"exited_cleanly": false/"exited_cleanly": true/' ~/.config/chromium/Default/Preferences

# dextv
chromium-browser --kiosk www.dextra.com.br?key=$KEY&user=$googleUser&password=$googlePassword" &

# hide mouse pointer
unclutter &
