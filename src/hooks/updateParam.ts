'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function useUpdateUrlParams(){
    const router = useRouter();
    const pathname = usePathname();
    const seachParams = useSearchParams();

    const updateParams = (params: Record<string, string>) => {
        const newParam = new URLSearchParams(seachParams.toString());
        Object.entries(params).forEach(([key, value]) => {
            newParam.set(key, value);
        });

        router.replace(`${pathname}?${newParam.toString()}`);
    }

    return updateParams;
}