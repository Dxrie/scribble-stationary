"use client";

import React, {useState} from "react";
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const ReactQueryProvider = ({children}: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient());

    return <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={false}/> */}
        {children}
    </QueryClientProvider>
};

export default ReactQueryProvider;