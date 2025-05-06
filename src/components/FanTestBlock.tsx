import { useQuizStore } from "@/store/quiz";
import { BlockData, Video } from "@/types";
import { Check, CircleAlert, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function FanTestBlock({ data }: { data: BlockData }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { loadFanQuiz } = useQuizStore();
  const { t, i18n } = useTranslation();

  const getLanguageName = () => {
    switch (i18n.language) {
      case "uz":
        return data.name_uz;
      case "la":
        return data.name_la;
      case "ru":
        return data.name_ru;
      default:
        return data.name_uz;
    }
  };

  const handleStartTest = () => {
    let url = !data.videos || data.videos.length === 0
      ? `/template/${data.id}?type=theme`
      : `/template/${data.id}?type=theme&video_id=${(data.videos as Video[]).map(d => d.video_id).join(",")}`;
    localStorage.setItem("fan_test_video", JSON.stringify(data.videos));  
    if(!data.videos ||data.videos.length === 0){
      localStorage.removeItem("fan_test_video");
    }
    setOpen(false);
    loadFanQuiz(data.id);
    navigate(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex relative flex-col justify-center items-center p-2 bg-white/10 backdrop-blur-lg text-white cursor-pointer gap-4 max-w-[370px] min-h-[300px] w-full border rounded-lg hover:shadow-sm transition">
          <p
            className="text-center"
            dangerouslySetInnerHTML={{ __html: getLanguageName() }}></p>
          {data.correct_answer != 0 &&
          data.wrong_answer === 0 &&
          data.skipped_answer === 0 ? (
            <div className="flex items-center gap-1 absolute top-1 right-1">
              <Badge variant="succes">
                <Check size={15} /> {data.correct_answer}
              </Badge>
            </div>
          ) : data.correct_answer !== 0 ||
            data.wrong_answer !== 0 ||
            data.skipped_answer !== 0 ? (
            <div className="flex items-center gap-1 absolute top-1 right-1">
              {data.skipped_answer > 0 && (
                <Badge variant="warn">
                  <CircleAlert size={15} /> {data.skipped_answer}
                </Badge>
              )}
              {data.correct_answer > 0 && (
                <Badge variant="succes">
                  <Check size={15} /> {data.correct_answer}
                </Badge>
              )}
              {data.wrong_answer > 0 && (
                <Badge variant="error">
                  <X size={15} /> {data.wrong_answer}
                </Badge>
              )}
            </div>
          ) : null}
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
