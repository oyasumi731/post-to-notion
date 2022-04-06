import React, { ChangeEvent, memo, useState } from 'react';
import PageInfo from '../domain/impl/PageInfo';

type Props = {
    fetchPageInfos: () => void;
    updateSelectedBy: (info: PageInfo) => void;
    selectedPageInfo?: PageInfo;
    pageInfos?: Array<PageInfo>;
}

const PageInfoComboBox: React.FC<Props> = memo(({ fetchPageInfos, updateSelectedBy, selectedPageInfo, pageInfos }) => {
    const handleClick = () => {
        // コンボボックス押下時にフェッチしなおす
        fetchPageInfos();
    }

    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const id = e.target.value;

        const newSelected = pageInfos?.find(value => value.pageId === id)!;
        updateSelectedBy(newSelected);
    }

    return (
        <>
            <label htmlFor="underline_select" className="sr-only">Underline select</label>
            <select id="underline_select" className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer" onChange={handleChange} onClick={handleClick} defaultValue={selectedPageInfo?.pageId ?? ""} >
                <option value="" disabled hidden>Choose a page</option>

                {
                    // コンボボックス展開時
                    pageInfos?.map((pageInfo) => (
                        <option key={pageInfo.pageId} value={pageInfo.pageId}>{pageInfo.pageTitle}</option>
                    ))
                }
            </select>
        </>
    );
});

export default PageInfoComboBox;