import ConnectionConfig from "../impl/ConnectionConfig";
import PageInfo from "../impl/PageInfo";
import { PostRequest } from "./PostRequest";
import { PostResult } from "./PostResult";

/**
 * Post-To-Notionのサービスのインターフェース
 */
export default interface IPostService {
    post(request: PostRequest): Promise<PostResult>
    canConnectBy(config: ConnectionConfig): Promise<boolean>
    WritablePageList(config: ConnectionConfig): Promise<Array<PageInfo>>
}