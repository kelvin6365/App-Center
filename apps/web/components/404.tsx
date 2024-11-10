import { LazyLottie } from "@/components/lazyLottie";
import { Button } from "@repo/ui/components/ui/button";
import React from "react";

type Props = {
  title: string;
  description: string;
  backBtnText?: string;
  backBtnOnClick?: () => void;
};

const Custom404 = ({
  title,
  description,
  backBtnText,
  backBtnOnClick,
}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 bg-gray-100 rounded-md dark:bg-gray-900">
      <div className="max-w-md mx-auto text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-white">
          {title}
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
          {description}
        </p>
        <center className="my-4">
          <LazyLottie
            getAnimationData={() => import("../assets/lottie/404.json")}
            loop
            id="empty-box"
            width={300}
            height={300}
          />
        </center>
        {backBtnText && (
          <Button
            className="my-2"
            onClick={() => {
              if (backBtnOnClick) {
                backBtnOnClick();
              } else {
                window.history.back();
              }
            }}
          >
            {backBtnText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Custom404;
