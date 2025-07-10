"use client"
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MoreVertical, Plus, Image as ImageIcon, Search } from 'lucide-react'
import React, { useState } from 'react'
import { useProductCategoryStore } from '@/stores/product-category'
import { ProductShowcase, useProductShowcaseStore } from '@/stores/product-showcase-store'
import { useUpload } from '@/hooks/use-upload'
import { ProductCategorySelect } from '@/components/custom/product-category-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { useProductShowcase } from '@/hooks/useProductShowcase'

const ProductShowcasePage = () => {
  const productCategoryStore = useProductCategoryStore()
  const productShowCaseStore = useProductShowcaseStore()

  const productShowcase = useProductShowcase()
  const [searchQuery, setSearchQuery] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // State for image modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [productCategoryId, setProductCategoryId] = useState<number | undefined>(undefined)
  const uploader = useUpload()

  // Function to handle edit
  const handleEdit = (category: ProductShowcase) => {
    setName(category.name)
    setDescription(category.description)
    setImagePreview(category.imageUrl)
    setIsEditModalOpen(true);
  }

  // Function to handle delete
  const handleDelete = (id: string | number) => {
    // setProductCategories(prev => prev.filter(category => category.id !== id));
    console.log("delete", id)
  }

  // Function to handle save edit
  const handleSaveEdit = async () => {
    // console.log("save edit", name, description, imageFile)
    if (imageFile) {
      const imageUrl = (await uploader.uploadImageOnlyUrl(imageFile)).url
      const productShowcase_ = await productShowcase.createProductShowcase(name, description, productCategoryId, imageUrl)
      if (productShowcase_) {
        toast.success("Product Showcase Created")
      } else {
        toast.error("Error Creating Product Showcase")
      }
    } else {
      toast.error("Error Upload Image")
    }
    setIsEditModalOpen(false);
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Product Showcase</h1>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Product Showcase
        </Button>
      </header>

      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Product Showcase..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <ProductCategorySelect />
          </div>
        </div>
        <div className="flex flex-col space-y-4 mt-4">
          {productShowCaseStore.productShowcases.map(category => (
            <Card key={category.id} className="overflow-hidden">
              {
                productCategoryStore.productCategories.find((cat) => cat.id === category.productCategoryId)?.name ? (
                  <Badge className="ml-2 top-2 left-2 bg-[#FF8C00] text-white">
                    {
                      productCategoryStore.productCategories.find((cat) => cat.id === category.productCategoryId)?.name
                    }
                  </Badge>
                ) : (
                  <></>
                )
              }
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-1/4">

                  <div className="h-48 md:h-full bg-muted flex items-center justify-center">
                    {category.imageUrl && (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="h-[100px] w-auto object-contain cursor-pointer"
                        onClick={() => {
                          setSelectedImage(category.imageUrl);
                          setIsImageModalOpen(true);
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="flex-1 p-4 relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(category)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(category.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <h3 className="text-lg font-semibold pr-8">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              className="rounded-md"
              onClick={() => productShowCaseStore.setPage(Math.max(1, productShowCaseStore.page - 1))}
              disabled={productShowCaseStore.page <= 1}
            >
              Previous
            </Button>

            <div className="border rounded-md overflow-hidden">
              {Array.from({ length: Math.ceil(productShowCaseStore.totalCount / productShowCaseStore.limit) || 1 }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={productShowCaseStore.page === i + 1 ? "default" : "ghost"}
                  className="rounded-none"
                  onClick={() => productShowCaseStore.setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="ghost"
              className="rounded-md"
              onClick={() => productShowCaseStore.setPage(productShowCaseStore.page + 1)}
              disabled={productShowCaseStore.page >= Math.ceil(productShowCaseStore.totalCount / productShowCaseStore.limit)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="carousel-product-category" className="text-sm font-medium">
                Product Category
              </label>
              <Select
                value={productCategoryId?.toString() || "all"}
                onValueChange={(value) => setProductCategoryId(value ? Number(value) : undefined)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Product Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">None</SelectItem>
                  {productCategoryStore.productCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
            <div className="grid gap-2">
              <label htmlFor="image" className="text-sm font-medium">Image</label>
              <div className="flex items-center gap-2">
                {imagePreview && (
                  <div className="h-16 w-16 overflow-hidden rounded-md">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="cursor-pointer">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                      e.target.value = "";
                    }}
                  />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('image')?.click()}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-screen-xl w-[95vw] h-[90vh] p-4">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-full p-2">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Preview"
                className="max-h-[calc(90vh-8rem)] max-w-full object-contain"
              />
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  )
}

export default ProductShowcasePage