import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function WishlistTestBlock({ data, onStartTest }: { data: {id: number} , onStartTest: (id: number) => void}) {
  const [open, setOpen] = useState(false);
  
  const { t } = useTranslation();

  const handleStartTest = () => {
    setOpen(false);
    onStartTest(data.id)
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex relative flex-col justify-center items-center p-2 bg-white/10 backdrop-blur-lg text-white cursor-pointer gap-4 max-w-[370px] min-h-[300px] w-full border rounded-lg hover:shadow-sm transition">
          <p
            className="text-center">{data.id + 1} {t("block")}
          </p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("start")}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {t("back")}
            </Button>
            <Button onClick={handleStartTest}>{t("start_test")}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
