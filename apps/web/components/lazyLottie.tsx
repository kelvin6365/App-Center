import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { type LottieComponentProps } from "lottie-react";
import { Suspense, lazy } from "react";

const LazyLottieComponent = lazy(() => import("lottie-react"));

interface LottieProps<T extends Record<string, unknown>> {
  getAnimationData: () => Promise<T>;
  id: string;
}

export function LazyLottie<T extends Record<string, unknown>>({
  getAnimationData,
  id,
  ref,
  ...props
}: LottieProps<T> & Omit<LottieComponentProps, "animationData">) {
  const { data } = useQuery({
    queryKey: [id],
    queryFn: async () => {
      void import("lottie-react"); // Trigger the library lazy load even if the animationData is not ready
      return getAnimationData();
    },
    enabled: typeof window !== "undefined",
  });

  if (!data) {
    return (
      <Skeleton
        style={{
          width: props.width,
          height: props.height,
        }}
      />
    );
  }

  return (
    <Suspense
      fallback={
        <Skeleton
          style={{
            width: props.width,
            height: props.height,
          }}
        />
      }
    >
      <LazyLottieComponent
        style={{
          width: props.width,
          height: props.height,
        }}
        animationData={data}
        {...props}
      />
    </Suspense>
  );
}
