import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProductCategory } from "@/hooks/useProductCategory"
import { useProductCategoryStore } from "@/stores/product-category"

export function ProductCategorySelect() {
    const { isLoading } = useProductCategory()
    const productCategoryStore = useProductCategoryStore()
    const [value, setValue] = useState('')
    return (
        <Select value={value} onValueChange={setValue} disabled={isLoading}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
                {productCategoryStore.productCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
