/**
 * 保存・読み込みを行う拡張機能のサービス
 */
export default interface IPreservingService {
    save(key: string, setting: object): void
    load(key: string): Promise<{ [key: string]: any; }>
}