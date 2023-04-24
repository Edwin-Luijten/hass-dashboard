type BrowserModCommand = {
    command: string;
    media_content_id: string;
    media_type: string;
    announce: true;
    extra: { [key: string]: any };
};

export type {
    BrowserModCommand,
}