"use client";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { XIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogImage,
  MorphingDialogTrigger,
} from "../ui/morphing-dialog";
import type { Photo } from "./types";

interface ImageWithLoadingState extends Photo {
  isLoaded?: boolean;
}

export function MasonryGallery({ photos }: { photos: Photo[] }) {
  const [columns, setColumns] = useState<ImageWithLoadingState[][]>([
    [],
    [],
    [],
  ]);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const getOptimalPaddingBottom = (photo: Photo) => {
    const aspectRatio = photo?.height / photo?.width;
    const maxAspectRatio = 1.1;

    if (aspectRatio > maxAspectRatio) {
      return `${maxAspectRatio * 100}%`;
    }

    return `${aspectRatio * 100}%`;
  };

  useEffect(() => {
    const distributePhotos = () => {
      let numColumns = 3;
      if (window.innerWidth < 768) {
        numColumns = 1;
      } else if (window.innerWidth < 1024) {
        numColumns = 2;
      }

      const newColumns: ImageWithLoadingState[][] = Array.from(
        { length: numColumns },
        () => []
      );

      photos?.forEach((photo) => {
        const columnHeights = newColumns?.map((col) =>
          col.reduce((sum, columnPhoto) => sum + columnPhoto?.height, 0)
        );
        const shortestColumnIndex = columnHeights?.indexOf(
          Math.min(...columnHeights)
        );

        newColumns[shortestColumnIndex]?.push({
          ...photo,
          isLoaded: loadedImages.has(photo.id),
        });
      });

      setColumns(newColumns);
    };

    distributePhotos();

    window.addEventListener("resize", distributePhotos);
    return () => window.removeEventListener("resize", distributePhotos);
  }, [photos, loadedImages]);

  const handleImageLoad = (photoId: string) => {
    setLoadedImages((prev) => new Set(prev).add(photoId));
  };

  return (
    <div className="flex w-full gap-4">
      {columns?.map((column) => (
        <div className="flex flex-1 flex-col gap-4" key={column?.[0]?.id}>
          {column?.map((columnPhoto) => (
            <MorphingDialog
              key={columnPhoto?.id}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              <MorphingDialogTrigger>
                <motion.div
                  className="relative cursor-pointer overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingBottom: getOptimalPaddingBottom(columnPhoto),
                    }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      layoutId={`photo-${columnPhoto?.id}`}
                    >
                      <MorphingDialogImage
                        alt={columnPhoto?.alt}
                        className={cn(
                          "object-cover transition-all duration-300 hover:scale-105",
                          loadedImages.has(columnPhoto.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                        loading="eager"
                        onLoad={() => handleImageLoad(columnPhoto.id)}
                        src={columnPhoto?.src}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </MorphingDialogTrigger>
              <MorphingDialogContainer>
                <MorphingDialogContent className="relative z-20">
                  <MorphingDialogImage
                    alt={columnPhoto?.alt}
                    className="h-auto w-full max-w-[90vw] rounded-[4px] object-cover lg:h-[70vh]"
                    src={columnPhoto?.src}
                  />
                  {columnPhoto?.description && (
                    <motion.div
                      animate={{ opacity: 1 }}
                      className="mt-4 w-full"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      transition={{
                        opacity: {
                          duration: 0.2,
                        },
                      }}
                    >
                      <ScrollArea
                        className="h-24 rounded-md border-0 bg-background/80 p-3 text-text"
                        type="always"
                      >
                        <p className="whitespace-pre-line">
                          {columnPhoto?.description}
                        </p>
                      </ScrollArea>
                    </motion.div>
                  )}
                </MorphingDialogContent>
                <MorphingDialogClose
                  className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1"
                  variants={{
                    initial: { opacity: 0 },
                    animate: {
                      opacity: 1,
                      transition: { delay: 0.3, duration: 0.1 },
                    },
                    exit: { opacity: 0, transition: { duration: 0 } },
                  }}
                >
                  <XIcon className="h-5 w-5 text-zinc-500" />
                </MorphingDialogClose>
              </MorphingDialogContainer>
            </MorphingDialog>
          ))}
        </div>
      ))}
    </div>
  );
}
