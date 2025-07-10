import useSWR from "swr"
import { useProductShowcaseStore } from "../stores/product-showcase-store"

export const useProductShowcase = () => {
    const productShowCaseStore = useProductShowcaseStore()

    const { data, error, isLoading: isLoadingData, mutate } = useSWR(`/api/product-showcase?page=${productShowCaseStore.page}&limit=${productShowCaseStore.limit}`,
        async (url) => {
            const response = await fetch(url)
            const data = await response.json()
            console.log("data", data)
            return data
        }, {
        revalidateOnFocus: false,
    }
    )

    return {
        data,
        error,
        isLoading: isLoadingData,
        mutate
    }
}
