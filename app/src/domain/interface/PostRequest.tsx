import ConnectionConfig from "../impl/ConnectionConfig";

/**
 * ポストすsる情報を定義した型
 */
export type PostRequest = {
    postId: string
    title: string
    url: string
    description: string
    connectionConfig: ConnectionConfig
};