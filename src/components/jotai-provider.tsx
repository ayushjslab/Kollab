"use client";

import { Provider } from "jotai";

interface JotaiPrviderProps {
    children: React.ReactNode
}

export const JotaiProvider = ({children}:JotaiPrviderProps) => {
    return (
        <Provider>
            {children}
        </Provider>
    )
}