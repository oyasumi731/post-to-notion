import { Client } from "@notionhq/client";
import { SearchResponse } from "@notionhq/client/build/src/api-endpoints";
import ConnectionConfig from "../../domain/impl/ConnectionConfig";
import PageInfo from "../../domain/impl/PageInfo";
import IPostService from "../../domain/interface/IPostService";
import IPreservingService from "../../services/interface/IPreservingService";

/**
 * サービスを取得する
 */
export default class ServiceFactory {
    preservingService: IPreservingService
    postService: IPostService

    constructor() {
        this.preservingService = {
            save: (key: string, setting) => {
                console.log("save");
                chrome.storage.local.set({ [key]: setting }, () => { console.log("success") });
            },
            load: async (key: string) => {
                switch (key) {
                    case ConnectionConfig.name:
                        return { token: process.env.NOTION_TOKEN };
                    default:
                        let data = await chrome.storage.local.get([key]);
                        return data[key];
                }
            }
        };
        this.postService = {
            post: async (request) => {
                const client = new Client({
                    auth: request.connectionConfig.token,
                });

                // notionにpostする
                const response = client.blocks.children.append({
                    block_id: request.postId,
                    children: [
                        {
                            "paragraph": {
                                "rich_text": [
                                    {
                                        "text": {
                                            "content": request.title,
                                            "link": {
                                                "url": request.url,
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "quote": {
                                "rich_text": [{
                                    "text": {
                                        "content": request.description ?? "",
                                    },
                                }],
                                "color": "default"
                            }
                        }

                    ],
                });

                return response.then((_) => {
                    return { isSuccess: true, exception: "" };
                }).catch((err) => {
                    return { isSuccess: false, exception: err };
                })
            },
            canConnectBy: async (config) => {
                const client = new Client({
                    auth: config.token,
                });

                // 試しにユーザの取得APIを叩く
                return client.users.list({ page_size: 1 }).then((_) => {
                    return true;
                }).catch((err) => {
                    console.log(err);
                    return false;
                });
            },
            WritablePageList: async (config) => {
                const client = new Client({
                    auth: config.token,
                });

                const response = client.search({});

                return response.then((data: SearchResponse) => {
                    let result: Array<PageInfo> = [];

                    // reponseからPageInfoに合うようにデータを整形する
                    data.results.map((item) => {
                        if ("properties" in item && "title" in item.properties.title) {
                            const pageTitle = item.properties.title.title.at(0)?.plain_text;

                            const pageInfo = new PageInfo(pageTitle ?? "Untitled", item.id);
                            result.push(pageInfo);
                        }
                    })

                    return result;
                }).catch((err) => {
                    return [];
                });
            }
        }
    }
}