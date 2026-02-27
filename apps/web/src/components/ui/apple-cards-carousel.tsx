/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
/** biome-ignore-all lint/nursery/noShadow: <explanation> */
"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image, { type ImageProps } from "next/image";
import { useTranslations } from "next-intl";
import React, {
  createContext,
  type JSX,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { cn } from "@/lib/cn";

type CarouselProps = {
  items: JSX.Element[];
  initialScroll?: number;
};

type Card = {
  src: string;
  title: string;
  category: string;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useTranslations("AppleCardsCarousel");

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth pb-10 [scrollbar-width:none] md:pb-20"
          onScroll={checkScrollability}
          ref={carouselRef}
        >
          <div
            className={cn(
              "absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l"
            )}
          />

          <div
            className={cn(
              "flex flex-row justify-start gap-4 pl-4",
              "mx-auto max-w-7xl" // remove max-w-4xl if you want the carousel to span the full width of its container
            )}
          >
            {items.map((item, index) => (
              <motion.div
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                  },
                }}
                className="rounded-3xl"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                key={`card-${index + 1}`}
                viewport={{ once: true }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-10 flex justify-end gap-2">
          <button
            aria-label={t("back_aria")}
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            disabled={!canScrollLeft}
            onClick={scrollLeft}
            type="button"
          >
            <ArrowLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            aria-label={t("forward_aria")}
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            disabled={!canScrollRight}
            onClick={scrollRight}
            type="button"
          >
            <ArrowRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  const t = useTranslations("AppleCardsCarousel");
  return (
    <Image
      alt={alt ? alt : t("background_alt")}
      blurDataURL={typeof src === "string" ? src : undefined}
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      decoding="async"
      height={height}
      loading="lazy"
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      {...rest}
    />
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  const handleClose = useCallback(() => {
    setOpen(false);
    onCardClose(index);
  }, [onCardClose, index]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useOutsideClick(containerRef as React.RefObject<HTMLDivElement>, () =>
    handleClose()
  );

  return (
    <motion.div
      className="relative z-10 flex h-[400px] w-[300px] flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[30rem] md:w-96 dark:bg-neutral-900"
      layoutId={layout ? `card-${card.title}` : undefined}
    >
      <div className="pointer-events-none absolute inset-0 z-30 bg-black/30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-linear-to-b from-black/60 via-transparent to-transparent" />
      <div className="relative z-40 p-8">
        <motion.p
          className="body_one text-left font-bold text-yellow"
          layoutId={layout ? `category-${card.category}` : undefined}
        >
          {card.category}
        </motion.p>
        <motion.p
          className="mt-2 max-w-xs text-left font-sans font-semibold text-white text-xl [text-wrap:balance] md:text-3xl"
          layoutId={layout ? `title-${card.title}` : undefined}
        >
          {card.title}
        </motion.p>
      </div>
      <BlurImage
        alt={card.title}
        className="absolute inset-0 z-10 object-cover"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        src={card.src}
      />
    </motion.div>
  );
};
