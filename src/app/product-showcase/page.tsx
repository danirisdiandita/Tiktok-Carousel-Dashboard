"use client"
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
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

  // State for create modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  // State for tracking the currently edited item
  const [editingItem, setEditingItem] = useState<ProductShowcase | null>(null)
  // State for image modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  // State for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | number | null>(null)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [productCategoryId, setProductCategoryId] = useState<number | undefined>(undefined)
  const uploader = useUpload()

  // Function to reset form
  const resetForm = () => {
    setName('')
    setDescription('')
    setImageFile(null)
    setImagePreview(null)
    setProductCategoryId(undefined)
    setEditingItem(null)
  }

  // Function to handle edit
  const handleEdit = (item: ProductShowcase) => {
    setName(item.name)
    setDescription(item.description)
    setImagePreview(item.imageUrl)
    setProductCategoryId(item.productCategoryId)
    setEditingItem(item)
    setIsEditModalOpen(true)
  }

  // Function to handle delete
  const handleDelete = (id: string | number) => {
    setItemToDelete(id)
    setIsDeleteModalOpen(true)
  }
  
  // Function to confirm deletion
  const confirmDelete = async () => {
    try {
      if (!itemToDelete) return
      
      await productShowcase.deleteProductShowcase(itemToDelete)
      toast.success("Product Showcase Deleted")
      setIsDeleteModalOpen(false)
      setItemToDelete(null)
    } catch (error) {
      console.error("Error deleting product showcase:", error)
      toast.error("Failed to delete product showcase")
    }
  }

  // Function to handle create
  const handleCreate = async () => {
    try {
      if (!name.trim()) {
        toast.error("Name is required")
        return
      }

      if (imageFile) {
        const imageUrl = (await uploader.uploadImageOnlyUrl(imageFile)).url
        const productShowcase_ = await productShowcase.createProductShowcase(name, description, productCategoryId, imageUrl)
        if (productShowcase_) {
          toast.success("Product Showcase Created")
          resetForm()
          setIsCreateModalOpen(false)
        } else {
          toast.error("Error Creating Product Showcase")
        }
      } else {
        toast.error("Image is required")
      }
    } catch (error) {
      console.error("Error creating product showcase:", error)
      toast.error("Failed to create product showcase")
    }
  }

  // Function to handle save edit
  const handleSaveEdit = async () => {
    try {
      if (!editingItem) return
      if (!name.trim()) {
        toast.error("Name is required")
        return
      }
      
      // If there's a new image uploaded, update the image URL
      let imageUrl = editingItem.imageUrl
      if (imageFile) {
        imageUrl = (await uploader.uploadImageOnlyUrl(imageFile)).url
      }

      const result = await productShowcase.updateProductShowcase(
        editingItem.id, 
        name, 
        description, 
        productCategoryId, 
        imageUrl
      )

      if (result) {
        toast.success("Product Showcase Updated")
        resetForm()
        setIsEditModalOpen(false)
      } else {
        toast.error("Error Updating Product Showcase")
      }
    } catch (error) {
      console.error("Error updating product showcase:", error)
      toast.error("Failed to update product showcase")
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Product Showcase</h1>
        </div>
        <Button onClick={() => {
          resetForm()
          setIsCreateModalOpen(true)
        }}>
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
          {productShowCaseStore.productShowcases.map((showcase) => (
            <Card key={showcase.id} className="overflow-hidden">
              {
                productCategoryStore.productCategories.find((cat) => cat.id === showcase.productCategoryId)?.name ? (
                  <Badge className="ml-2 top-2 left-2 bg-[#FF8C00] text-white">
                    {
                      productCategoryStore.productCategories.find((cat) => cat.id === showcase.productCategoryId)?.name
                    }
                  </Badge>
                ) : (
                  <></>
                )
              }
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-1/4">
                  <div className="h-48 md:h-full bg-muted flex items-center justify-center">
                    {showcase.imageUrl && (
                      <img
                        src={showcase.imageUrl}
                        alt={showcase.name}
                        className="h-[100px] w-auto object-contain cursor-pointer"
                        onClick={() => {
                          setSelectedImage(showcase.imageUrl)
                          setIsImageModalOpen(true)
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
                      <DropdownMenuItem onClick={() => handleEdit(showcase)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(showcase.id)} className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <h3 className="text-lg font-semibold pr-8">{showcase.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{showcase.description}</p>
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

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Product Showcase</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="create-name" className="text-sm font-medium">Name</label>
              <Input
                id="create-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="create-description" className="text-sm font-medium">Description</label>
              <Textarea
                id="create-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="create-product-category" className="text-sm font-medium">
                Product Category
              </label>
              <Select
                value={productCategoryId?.toString() || "all"}
                onValueChange={(value) => setProductCategoryId(value !== "all" ? Number(value) : undefined)}
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
              <label htmlFor="create-image" className="text-sm font-medium">Image</label>
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
                    id="create-image"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setImageFile(file)
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                      e.target.value = ""
                    }}
                  />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('create-image')?.click()}>
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
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product Showcase</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-name" className="text-sm font-medium">Name</label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-product-category" className="text-sm font-medium">
                Product Category
              </label>
              <Select
                value={productCategoryId?.toString() || "all"}
                onValueChange={(value) => setProductCategoryId(value !== "all" ? Number(value) : undefined)}
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
              <label htmlFor="edit-image" className="text-sm font-medium">Image</label>
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
                    id="edit-image"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setImageFile(file)
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                      e.target.value = ""
                    }}
                  />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('edit-image')?.click()}>
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
            <Button onClick={handleSaveEdit}>Update</Button>
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

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product Showcase</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this product showcase? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  )
}

export default ProductShowcasePage
