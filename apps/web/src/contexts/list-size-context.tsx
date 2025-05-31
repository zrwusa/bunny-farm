'use client'

import {createContext, ReactNode} from 'react';

export const ListSizeContext = createContext<number | undefined>(undefined);

export const ListSizeProvider = ({listSize, children}: { listSize: number, children: ReactNode }) => {
    return <ListSizeContext.Provider value={listSize}>{children}</ListSizeContext.Provider>
}