"use client";

import React from "react";
import { LazyLottie } from "./lazyLottie";

const Loading = ({ fullScreen = false }) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    : "flex items-center justify-center";

  return (
    <div className={containerClasses}>
      <div className="w-48 h-48">
        <LazyLottie
          getAnimationData={() => import("@/assets/lottie/loading.json")}
          id="loading"
          loop
        />
      </div>
    </div>
  );
};

export default Loading;
