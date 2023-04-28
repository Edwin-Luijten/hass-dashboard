server {
    listen 8099 default_server;

    include /etc/nginx/includes/server_params.conf;
    include /etc/nginx/includes/proxy_params.conf;
    proxy_set_header X-External-Path {{ .entry }};

    allow   172.30.32.2;
    deny    all;

    location / {
        proxy_pass http://127.0.0.1:80;

        root    /var/www/html;
        index   index.html;
    }
}