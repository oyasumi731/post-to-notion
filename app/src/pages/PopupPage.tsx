import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import PageInfoComboBox from '../components/PageInfoComboBox';
import PageInfo from '../domain/impl/PageInfo';

const PopupPage: React.FC = () => {
    const [pageInfo, setPageInfo] = useState<PageInfo>();
    const [pageInfos, setPageInfos] = useState<Array<PageInfo>>([]);

    const handleFetchPageInfos = useCallback(
        () => {
            (async () => {
                const response = await chrome.runtime.sendMessage({ type: "get-writable-page-list" });
                console.log(response)

                setPageInfos(response.body);
            })();
        }, []);

    const handleUpdateSelectedBy = useCallback(
        (newPageInfo: PageInfo) => {
            setPageInfo(newPageInfo);
        }, []);

    const handleClick = () => {
        chrome.runtime.sendMessage({ type: "save-page-info", body: pageInfo })
    };

    // 初回レンダリング時に書き込み可能なページ情報の一覧と前回保存したページ情報を取得する
    useEffect(() => {
        // 書き込み可能なページ情報の一覧を取得する
        handleFetchPageInfos();
    }, []);

    return (
        <>
            <div className='container mx-auto my-4 w-2/3'>
                <h2 className="font-medium text-base">ポスト先のページ</h2>
                <div className='my-2'>
                    <div className='mb-2'>
                        <PageInfoComboBox fetchPageInfos={handleFetchPageInfos} updateSelectedBy={handleUpdateSelectedBy} selectedPageInfo={pageInfo} pageInfos={pageInfos} />
                    </div>

                    <div className='flex flex-row-reverse'>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm" onClick={handleClick}>
                            保存
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
}

export default PopupPage;