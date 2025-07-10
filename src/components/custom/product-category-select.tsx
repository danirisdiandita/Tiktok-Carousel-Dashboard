import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select"
import { useProductCategory } from "@/hooks/useProductCategory"
import { useProductCategoryStore } from "@/stores/product-category"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useCarouselStore } from "@/stores/carousel-store"

export function ProductCategorySelect() {
    const { isLoading } = useProductCategory()
    const productCategoryStore = useProductCategoryStore()
    const [value, setValue] = useState('')
    const carouselStore = useCarouselStore()
    
    useEffect(() => {
        if (value) {
            carouselStore.changeProductCategoryId(Number(value))
            } else {
                carouselStore.changeProductCategoryId(undefined)
            }
    }, [value])
    return (
        <Select value={value} onValueChange={setValue} disabled={isLoading}
        >
            <SelectTrigger className="w-full min-w-[240px]">
                <SelectValue placeholder="Select Product Category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={"all"}>All</SelectItem>
                {productCategoryStore.productCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                    </SelectItem>
                ))}
                <SelectSeparator />
                <div className="p-1">
                    <NewProductCategoryDialog />
                </div>
            </SelectContent>
        </Select>
    )
}


export function NewProductCategoryDialog() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const { createProductCategory } = useProductCategory()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create new Product Category
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new Product Category</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Input
                            placeholder="Product Category name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            placeholder="Product Category description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={() => createProductCategory(name, description)}>Save changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
