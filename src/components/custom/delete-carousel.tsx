import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteCarouselProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

export function DeleteCarousel({ isOpen, onClose, onDelete }: DeleteCarouselProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            onDelete();
            onClose();
        } catch (error) {
            console.error("Failed to delete carousel:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Carousel</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>Are you sure you want to delete this carousel? This action cannot be undone.</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
