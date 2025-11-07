#!/bin/sh
set -e
HOSTNAME_DISPLAY=${HOSTNAME_DISPLAY:-localhost}
PORT_DISPLAY=${PORT_DISPLAY:-3000}

cat <<EOF
====================================================
 Frontend container started
 Open your browser: http://${HOSTNAME_DISPLAY}:${PORT_DISPLAY}
 Nginx serving static build from /usr/share/nginx/html
====================================================
EOF

exec nginx -g 'daemon off;'