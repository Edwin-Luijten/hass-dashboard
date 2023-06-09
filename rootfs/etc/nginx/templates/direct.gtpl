server {
    listen 80 default_server;

    include /etc/nginx/includes/server_params.conf;
    include /etc/nginx/includes/proxy_params.conf;

    location / {
        root /var/www/html;
        index index.html
    }
}