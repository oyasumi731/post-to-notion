/**
 * Post先を示す情報
 */
export default class PageInfo {
    pageTitle: string
    pageId: string

    constructor(pageTitle: string, pageId: string) {
        this.pageTitle = pageTitle;
        this.pageId = pageId;
    }
}