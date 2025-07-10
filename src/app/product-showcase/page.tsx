
"use client"
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MoreVertical, Plus, Image as ImageIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useProductCategoryStore } from '@/stores/product-category'
import { ProductShowcase, useProductShowcaseStore } from '@/stores/product-showcase-store'


const ProductShowcasePage = () => {

  const productCategoryStore = useProductCategoryStore() 
  const productShowCaseStore = useProductShowcaseStore()
  

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  
  // Function to handle edit
  const handleEdit = (category: ProductShowcase) => {
    setEditingCategory({ ...category });
    setIsEditModalOpen(true);
  }

  // Function to handle delete
  const handleDelete = (id: string | number) => {
    // setProductCategories(prev => prev.filter(category => category.id !== id));
    console.log("delete", id)
  }

  // Function to handle save edit
  const handleSaveEdit = () => {
    if (editingCategory) {
      // setProductCategories(prev => 
      //   prev.map(category => 
      //     category.id === editingCategory.id ? editingCategory : category
      //   )
      // );
      alert("Save edit")
      setIsEditModalOpen(false);
      setEditingCategory(null);
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Product Showcase</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Product Showcase
        </Button>
      </header>
      
      <div className="p-6">
        <div className="flex flex-col space-y-4">
          {productShowCaseStore.productShowcases.map(category => (
            <Card key={category.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-1/4">
                  <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
                    Product Category
                  </Badge>
                  <div className="h-48 md:h-full bg-muted">
                    {category.imageUrl && (
                      <img 
                        src={category.imageUrl} 
                        alt={category.name} 
                        className="h-full w-full object-cover"
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
          <div className="border rounded-md overflow-hidden">
            <Button variant="ghost" className="rounded-none">
              1
            </Button>
            <Button variant="ghost" className="rounded-none">
              2
            </Button>
            <Button variant="ghost" className="rounded-none">
              3
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
                value={editingCategory?.title || ''}
                onChange={(e) => setEditingCategory(prev => prev ? {...prev, title: e.target.value} : prev)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="description" 
                value={editingCategory?.description || ''}
                onChange={(e) => setEditingCategory(prev => prev ? {...prev, description: e.target.value} : prev)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="image" className="text-sm font-medium">Image</label>
              <div className="flex items-center gap-2">
                {editingCategory?.imageUrl && (
                  <div className="h-16 w-16 overflow-hidden rounded-md">
                    <img 
                      src={editingCategory.imageUrl} 
                      alt="Preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <Button variant="outline" size="sm">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
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
    </SidebarInset>
  )
}

export default ProductShowcasePage