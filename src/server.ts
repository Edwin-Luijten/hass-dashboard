import http from 'http';
import https from 'https';
import fs from 'fs';
import express from 'express';

const app = express();
app.use(express.static(__dirname));

const port = process.env.PORT || 3000;

const isSsl = fs.existsSync(process.env.SSL_PATH_CERT || 'fullchain.pem');
if (isSsl) {
    https
        .createServer(
            {
                cert: fs
                    .readFileSync(process.env.SSL_PATH_CERT || 'fullchain.pem')
                    .toString(),
                key: fs
                    .readFileSync(process.env.SSL_PATH_KEY || 'privkey.pem')
                    .toString(),
            },
            app
        )
        .listen(port);
} else {
    http.createServer(app).listen(port);
}
