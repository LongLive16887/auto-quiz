import api from "@/api/axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { useQuizStore } from "@/store/quiz";
import { useWishlistStore } from "@/store/wishlist";
import { Answer, Question } from "@/types";
import { Bookmark, Loader2, FileVideo } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";
import {
  useBlocker,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Button } from "../ui/button";
import Tabs from "./Tabs";

function timeFormat(sec: number): string {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

const AppQuiz = () => {
  const { id } = useParams();
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const TypeParam = new URLSearchParams(location.search).get("type");
  // const VideoId = new URLSearchParams(location.search).get("video_id");
  const videos = JSON.parse(localStorage.getItem("fan_test_video") || "[]");

  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    userAnswers,
    submitAnswer,
    correctCount,
    incorrectCount,
    reset,
    quiz,
    showNext,
    setShowNext,
  } = useQuizStore();

  const { wishlist, toggleWishlist } = useWishlistStore();

  // States
  const [openShowImageModal, setopenShowImageModal] = useState<boolean>(false);
  const [selectedImg, setSelectedImg] = useState<string | null>("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [timer, setTimer] = useState(120);
  const [currentVideo, setCurrentVideo] = useState<string | null>("");
  const [shuffleQuiz, setShuffleQuiz] = useState<Answer[]>([]);
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(
    undefined
  );

  const blocker = useBlocker(
    () => Object.keys(userAnswers).length < quiz.length
  );
  const currentQuestion = quiz[currentQuestionIndex];
  const isWishlisted = wishlist.some((q) => q.id === currentQuestion?.id);

  function openVideoModal(videoId: string | null) {
    setCurrentVideo(videoId);
    setShowVideo(true);
  }
  const shuffle = () => {
    if (
      currentQuestion &&
      currentQuestion.answers &&
      currentQuestion.answers.length > 0
    ) {
      const shuffled = [...currentQuestion.answers];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffleQuiz(shuffled);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timer]);

  // Effects

  useEffect(() => {
    if (quiz.length > 0) {
      setCurrentQuestionIndex(0);
      reset();
    }
  }, [quiz]);
  useEffect(() => {
    shuffle();
  }, [currentQuestion]);
  useEffect(() => {
    setOpenAccordion(undefined);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowExitConfirm(true);
      blocker.reset();
    }
  }, [blocker.state]);

  useEffect(() => {
    if (timer === 0) {
      handleFinishTest();
    }
  }, [timer]);

  useEffect(() => {
    if (quiz.length <= 20) {
      setTimer(1500);
    } else if (quiz.length <= 50) {
      setTimer(2700);
    } else if (quiz.length <= 100) {
      setTimer(6000);
    } else {
      setTimer(6000);
    }
  }, [quiz]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(userAnswers).length < quiz.length) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userAnswers, quiz.length]);

  // Helper Functions
  const getTranslationHTML = (
    prefix: "question" | "question_description" | "answer",
    obj: Question | Answer
  ) => {
    const langKey = `${prefix}_${i18n.language}` as keyof typeof obj;
    const text = obj[langKey] || "";
    return { __html: text };
  };

  const handleAnswerSelect = (answer: Answer) => {
    if (!currentQuestion || userAnswers[currentQuestion.id]) return;

    submitAnswer(currentQuestion.id, answer.id, answer.is_correct);
    if (showNext) {
      setTimeout(() => {
        if (currentQuestionIndex + 1 < quiz.length) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setShowConfirm(true);
        }
      }, 1500);
    }
  };

  const submitQuizData = async () => {
    let type = 102;

    if (TypeParam === "test") {
      type = 105;
    } else if (TypeParam === "theme") {
      type = 100;
    }
    const requestData = {
      type,
      external_id: id,
      correct_answer: correctCount,
      wrong_answer: incorrectCount,
      skipped_answer: quiz.length - Object.keys(userAnswers).length,
    };

    await api.post("/api/v1/user/statistics", requestData).then((res) => {
      navigate("/results", { state: { data: res.data.data } });
    });
  };

  const handleFinishTest = () => {
    reset(true);
    submitQuizData();
    localStorage.removeItem("fan_test_video");
  };

  const handleExitConfirm = (confirmed: boolean) => {
    setShowExitConfirm(false);
    if (confirmed) {
      reset(true);
      submitQuizData();
    }
  };
  function next() {
    if (quiz.length != currentQuestionIndex + 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    if (quiz.length == currentQuestionIndex + 1) {
      setShowConfirm(true);
    }
  }
  function prev() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }
  const handlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
    trackTouch: true,
  });
  const handlersAnswer = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
    trackTouch: true,
  });
  function openImageModal(imgUrl: string | null) {
    setSelectedImg(imgUrl);
    setopenShowImageModal(true);
  }
  // Loading State
  if (!currentQuestion)
    return (
      <Loader2
        color="white"
        size={70}
        className="animate-spin h-[calc(100vh-150px)] mx-auto"
      />
    );

  return (
    <div className="flex flex-col h-[calc(100vh-110px)] gap-3.5">
      {/* Header */}
      {/* <video src="https://backend.avtotest-begzod.uz/api/v1/file/download/video/7a440435-df72-49ed-a5f1-ae72552a0bd0" width="720px" height="480px" controls preload="auto"></video> */}

      <div className="flex items-center max-md:flex-col max-md:items-start px-3.5 justify-between flex-wrap">
        {!TypeParam ? (
          <div className="flex items-center gap-3">
            <p className="text-2xl font-semibold text-white">
              {id}-{t("bilet")}
            </p>
            <p className="hidden md:block text-2xl font-semibold text-white">
              Id: {currentQuestion.id}
            </p>
          </div>
        ) : null}
        <div className="flex items-center gap-3.5 ml-auto max-md:mt-1 max-md:w-full">
          <div className="bg-white w-full md:min-w-[100px] text-center text-gray-800 px-2 py-1 rounded-md mr-1.5">
            {timeFormat(timer)}
          </div>
          <div className="flex items-center gap-1.5">
            <p className="text-white whitespace-nowrap hidden md:block">
              Avto o'tkazgich
            </p>
            <Switch checked={showNext} onCheckedChange={setShowNext} />
          </div>
          <Button
            size={"icon"}
            onClick={() => currentQuestion && toggleWishlist(currentQuestion)}>
            <Bookmark
              fill={isWishlisted ? "yellow" : "none"}
              color="yellow"
              size={50}
            />
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setShowConfirm(true);
            }}>
            {t("finish")}
          </Button>
        </div>
      </div>

      {/* Navigation and Timer */}
      <div className="hidden items-center justify-center gap-4 mt-auto mb-3 max-md:flex">
        <Tabs quantity={quiz.length} onTabChange={setCurrentQuestionIndex} />
      </div>

      {/* Question */}
      <div className="bg-white/10  backdrop-blur-md border p-3.5 rounded-lg">
        <div
          className="w-full text-white text-center"
          dangerouslySetInnerHTML={getTranslationHTML(
            "question",
            currentQuestion
          )}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-wrap gap-3.5 items-start max-md:flex-nowrap max-md:flex-col">
        {/* Media */}
        <div
          {...handlers}
          className="flex-1 rounded-lg flex min-h-[250px] overflow-hidden max-h-[550px] max-md:max-h-[200px] max-md:min-h-[200px] max-md:justify-center max-md:w-full">
          {currentQuestion.mobile_media?.trim() ? (
            <img
              onContextMenu={(e) => e.preventDefault()}
              onClick={() => {
                openImageModal(currentQuestion.mobile_media);
              }}
              src={`https://backend.avtotest-begzod.uz/api/v1/file/download/${currentQuestion.mobile_media}`}
              alt="Question media"
              className="max-w-full mx-auto object-contain"
            />
          ) : (
            <img
              className="rounded-full w-full mx-auto object-contain max-md:max-h-[200px]"
              src="/logo.png"
            />
          )}
        </div>

        {/* Answers */}
        <div className="w-[500px] px-3.5 rounded-lg flex flex-col max-md:w-full">
          <RadioGroup {...handlersAnswer}>
            {shuffleQuiz.map((answer, i) => {
              const isSelected =
                userAnswers[currentQuestion.id]?.answerId === answer.id;
              const isAnswered = !!userAnswers[currentQuestion.id];
              const isCorrectAnswer = answer.is_correct;
              const isUserWrongAnswer =
                isSelected && !isCorrectAnswer && isAnswered;
              const isCorrectHighlight = isCorrectAnswer && isAnswered;

              return (
                <div
                  key={answer.id}
                  className={`flex items-stretch space-x-4 text-white rounded cursor-pointer bg-white/20 backdrop-blur-md
					${!isAnswered ? "hover:bg-primary" : ""} 
				`}
                  onClick={() => handleAnswerSelect(answer)}>
                  <p
                    className={`font-semibold leading-6 text-center mr-0 p-4 w-fit flex-shrink-0 h-full flex items-center justify-center
						${isUserWrongAnswer ? "bg-red-500" : ""} 
						${isCorrectHighlight ? "bg-green-400" : ""}`}>
                    F{i + 1}
                  </p>
                  <Label className="flex-1 px-2 py-4 break-words">
                    <div
                      dangerouslySetInnerHTML={getTranslationHTML(
                        "answer",
                        answer
                      )}
                    />
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
          {currentQuestion.audio_id && (
            <div className="my-5">
              <audio
                controlsList="nodownload"
                src={`https://backend.avtotest-begzod.uz/api/v1/file/download/audio/${currentQuestion.audio_id}`}
                controls
              />
            </div>
          )}
          {/* Question Description */}
          <Accordion
            type="single"
            value={openAccordion}
            onValueChange={setOpenAccordion}
            disabled={!userAnswers[currentQuestion.id]}
            collapsible
            className="w-full mt-auto text-white">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                {i18n.language === "ru" && "Описание"}
                {i18n.language === "uz" && "Тавсиф"}
                {i18n.language === "la" && "Tavsif"}
              </AccordionTrigger>
              {userAnswers[currentQuestion.id] && (
                <AccordionContent className="" key={currentQuestion.id}>
                  <div
                    className="text-xs ans-description max-h-[200px] overflow-y-auto"
                    dangerouslySetInnerHTML={getTranslationHTML(
                      "question_description",
                      currentQuestion
                    )}
                  />
                </AccordionContent>
              )}
            </AccordionItem>
          </Accordion>
          <div className="max-md:w-[100%] w-full overflow-hidden">
            <div className="flex items-center gap-2 justify-between mt-2 flex-wrap max-md:my-5">
              {
                !!videos &&
                  videos.map((video: any) => {
                    return (
                      <Button
                        key={video.id}
                        className="w-fit px-4 flex items-center gap-2  max-md:max-w-full flex-1 max-w-1/2"
                        size={"icon"}
                        onClick={() => openVideoModal(video.video_id)}>
                        <FileVideo className="text-white overflow-hidden" />
                        <p className="line-clamp-1 whitespace-normal overflow-hidden">
                          {video.title_la}
                        </p>
                      </Button>
                    );
                  })
                // <Button
                //   className="w-fit px-4"
                //   size={"icon"}
                //   onClick={() => setShowVideo(true)}>
                //   <FileVideo className="text-white" />
                //   video ko'rish
                // </Button>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Timer */}
      <div className="flex items-center justify-center gap-4 mt-auto mb-3 max-md:hidden">
        <Tabs quantity={quiz.length} onTabChange={setCurrentQuestionIndex} />
      </div>

      {/* Finish Confirmation Modal */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("finish_test")}?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-2">
            <Button onClick={handleFinishTest}>{t("yes")}</Button>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              {t("no")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent>
          <div className="overflow-hidden rounded-lg py-4">
            <video
              controlsList="nodownload"
              className="max-h-[80dvh] object-contain h-full w-full"
              controls
              src={`https://backend.avtotest-begzod.uz/api/v1/file/download/video/${currentVideo}`}></video>
          </div>
        </DialogContent>
      </Dialog>

      {/* Выход из теста */}
      <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("finish_test")}?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-2">
            <Button onClick={() => handleExitConfirm(true)}>{t("yes")}</Button>
            <Button variant="outline" onClick={() => handleExitConfirm(false)}>
              {t("no")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openShowImageModal} onOpenChange={setopenShowImageModal}>
        <DialogContent className="max-w-4xl bg-transparent border-none shadow-none p-4">
          <div className="flex items-center space-x-2 h-full">
            <img
              onContextMenu={(e) => e.preventDefault()}
              src={`https://backend.avtotest-begzod.uz/api/v1/file/download/${selectedImg}`}
              alt="Question media"
              className="max-w-full object-cover"
            />
          </div>
          {/* <DialogFooter className='flex justify-center gap-2'>
						<Button onClick={() => setopenShowImageModal(true)}>{t('yes')}</Button>
						<Button variant='outline' onClick={() => setopenShowImageModal(false)}>
							{t('no')}
						</Button>
					</DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppQuiz;
