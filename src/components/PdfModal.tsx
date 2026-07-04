import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

export function PdfModal({ open, onClose, pdfUrl , icon: Icon, className  }: { open: boolean; onClose: Dispatch<SetStateAction<boolean>>; pdfUrl: string ; icon: React.ElementType; className?: string}) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogTrigger>
                <Icon className={cn('w-6 h-6 text-white cursor-pointer', className)}/>
            </DialogTrigger>
            <DialogContent className="w-3/4 w-md-6xl h-[90vh] p-0" classNameClose="-top-5 -right-5 bg-white rounded-full">
                <iframe
                    src={pdfUrl}
                    width="100%"
                    height="100%"
                    className="rounded-lg"
                    title="PDF Viewer"
                />
            </DialogContent>
        </Dialog>
    );
}