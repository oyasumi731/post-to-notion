/**
 * Notionの接続設定
 */
export default class ConnectionConfig {
    token: string

    constructor(token: string) {
        this.token = token;
    }
}