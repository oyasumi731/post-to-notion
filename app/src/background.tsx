import ConnectionConfig from "./domain/impl/ConnectionConfig";
import PageInfo from "./domain/impl/PageInfo";
import IPostService from "./domain/interface/IPostService";
import ServiceFactory from "./infrastructure/impl/ServiceFactory";
import IPreservingService from "./services/interface/IPreservingService";

/**
 * Notionへの接続設定
 */
let connectionConfig: ConnectionConfig;

/**
 * ポスト先のNotionのページ設定
 */
let pageConfig: PageInfo;

/**
 * サービス
 */
let preservingService: IPreservingService;
let postService: IPostService;

/**
 * スタートアップ時の処理
 */
const applicationStartup = async () => {
    // サービスのロード
    const factory = new ServiceFactory();
    preservingService = factory.preservingService;
    postService = factory.postService;

    // 設定のロード
    connectionConfig = (await preservingService.load(ConnectionConfig.name)) as ConnectionConfig;
    pageConfig = (await preservingService.load(PageInfo.name)) as PageInfo;

    // 接続の確認
    const isConnect = await postService.canConnectBy(connectionConfig);
    if (isConnect === false) {
        throw new Error("トークンが誤っている、または有効期限が切れています。");
    }

    // ハンドラの定義
    const handlePost = (info: any, tab: any) => {
        if (info.menuItemId !== "post") return;

        chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => {
            let activeTab = tabs[0];
            factory.postService.post({
                postId: pageConfig.pageId,
                title: activeTab.title!,
                url: info.pageUrl,
                description: info.selectionText,
                connectionConfig: connectionConfig
            });
        });
    };

    // コンテキストメニューの登録
    const menuId = chrome.contextMenus.create({
        id: "post",
        title: "Notionに送信",
        type: "normal",
        contexts: ["all"],
    });

    // ハンドラの登録
    chrome.contextMenus.onClicked.addListener(handlePost);
}

/**
 * 拡張機能インストール時のイベント登録
 */
chrome.runtime.onInstalled.addListener(async () => {
    await applicationStartup();

    console.log("OnInstalled process is success!");
});

/**
 * スタートアップ時の処理
 * コンテキストメニューへの登録を行う
 */
chrome.runtime.onStartup.addListener(async () => {
    await applicationStartup();

    console.log("OnStartup process is success!");
});

/**
 * ページ情報の保存
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type === "save-page-info") {
            preservingService.save(PageInfo.name, request.body)
            pageConfig = request.body as PageInfo;
        }

        return true;
    }
)

/**
 * 最後に保存されたページ情報の取得
 */
chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        if (request.type === "last-time-page-info") {
            const body = await preservingService.load(PageInfo.name);

            sendResponse({
                body: body
            });
        }

        return true;
    }
)

/**
 * 書き込み可能なページ情報の一覧の取得
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type === "get-writable-page-list") {
            postService.WritablePageList(connectionConfig).then(
                (pageInfos) => {
                    sendResponse({
                        body: pageInfos
                    });
                }
            )
        }

        return true;
    }
)