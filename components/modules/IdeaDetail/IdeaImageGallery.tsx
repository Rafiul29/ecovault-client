"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { createPortal } from "react-dom";

interface IdeaImageGalleryProps {
    images: string[];
    title: string;
}

export default function IdeaImageGallery({
    images,
    title,
}: IdeaImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
        null,
    );

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (selectedImageIndex !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedImageIndex]);

    if (!images || images.length === 0) return null;

    const openLightbox = (index: number) => setSelectedImageIndex(index);
    const closeLightbox = () => setSelectedImageIndex(null);

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex + 1) % images.length);
        }
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex(
                (selectedImageIndex - 1 + images.length) % images.length,
            );
        }
    };

    return (
        <>
            <div
                className={cn(
                    "grid gap-2 rounded-xl overflow-hidden border border-border group bg-muted/20",
                    images.length === 1
                        ? "grid-cols-1"
                        : images.length === 2
                            ? "grid-cols-2"
                            : "grid-cols-1 md:grid-cols-3",
                )}
            >
                {/* Gallery Grid Logic */}
                {images.length === 1 && (
                    <div
                        onClick={() => openLightbox(0)}
                        className="relative h-72 sm:h-[450px] w-full cursor-zoom-in overflow-hidden"
                    >
                        <Image
                            src={images[0]}
                            alt={title}
                            fill
                            sizes="(max-width: 640px) 100vw, 800px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Maximize2 className="text-white size-8 drop-shadow-lg" />
                        </div>
                    </div>
                )}

                {images.length === 2 && (
                    <>
                        {images.map((img, i) => (
                            <div
                                key={i}
                                onClick={() => openLightbox(i)}
                                className="relative h-48 sm:h-80 w-full cursor-zoom-in overflow-hidden group/item"
                            >
                                <Image
                                    src={img}
                                    alt={`${title} - ${i + 1}`}
                                    fill
                                    sizes="(max-width: 640px) 100vw, 400px"
                                    className="object-cover transition-transform duration-700 group-item-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <Maximize2 className="text-white size-6 drop-shadow-lg" />
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {images.length >= 3 && (
                    <>
                        <div
                            onClick={() => openLightbox(0)}
                            className="relative h-64 md:h-[400px] md:col-span-2 cursor-zoom-in overflow-hidden group/main"
                        >
                            <Image
                                src={images[0]}
                                alt={title}
                                fill
                                sizes="(max-width: 768px) 100vw, 600px"
                                className="object-cover transition-transform duration-700 group-main-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Maximize2 className="text-white size-10 drop-shadow-lg" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 h-40 md:h-[400px]">
                            {images.slice(1, 3).map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => openLightbox(i + 1)}
                                    className="relative h-full w-full cursor-zoom-in overflow-hidden border-l border-border/10 group/sub"
                                >
                                    <Image
                                        src={img}
                                        alt={`${title} - ${i + 2}`}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 300px"
                                        className="object-cover transition-all duration-700 hover:scale-110"
                                    />
                                    {i === 1 && images.length > 3 && (
                                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-white pointer-events-none">
                                            <span className="font-bold text-2xl">+{images.length - 2}</span>
                                            <span className="text-[10px] uppercase tracking-widest font-medium opacity-80">More Images</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Fullscreen Lightbox */}
            {selectedImageIndex !== null &&
                typeof document !== "undefined" &&
                createPortal(
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex flex-col lg:flex-row items-stretch overflow-hidden"
                            onClick={closeLightbox}
                        >
                            {/* Close Button Mobile */}
                            <button
                                className="absolute top-4 right-4 z-[1010] bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors lg:hidden"
                                onClick={closeLightbox}
                            >
                                <X className="size-6" />
                            </button>

                            {/* Main Image Area */}
                            <div className="relative flex-1 flex items-center justify-center p-2 lg:p-6 h-full min-h-0 overflow-hidden">
                                <button
                                    className="absolute left-4 lg:left-8 z-[1001] bg-white/5 hover:bg-white/20 p-3 lg:p-4 rounded-full text-white transition-all hover:scale-110 active:scale-90"
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                >
                                    <ChevronLeft className="size-6 lg:size-10" />
                                </button>
                                <button
                                    className="absolute right-4 lg:right-8 z-[1001] bg-white/5 hover:bg-white/20 p-3 lg:p-4 rounded-full text-white transition-all hover:scale-110 active:scale-90"
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                >
                                    <ChevronRight className="size-6 lg:size-10" />
                                </button>

                                <motion.div
                                    key={selectedImageIndex}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                                    className="relative w-full h-full flex items-center justify-center p-1 lg:p-2"
                                >
                                    <Image
                                        src={images[selectedImageIndex]}
                                        alt={`${title} fullscreen`}
                                        fill
                                        className="object-contain shadow-2xl rounded-sm sm:rounded-lg"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </motion.div>
                            </div>

                            {/* Sidebar Thumbnails (Desktop) / Bottom Strip (Mobile) */}
                            <div
                                className="w-full lg:w-80 h-auto lg:h-full bg-white/5 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-white/10 p-4 lg:p-6 flex flex-col gap-4 overflow-hidden pointer-events-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="hidden lg:flex items-center justify-between mb-2">
                                    <h3 className="text-white font-bold text-lg">Project Gallery</h3>
                                    <button
                                        onClick={closeLightbox}
                                        className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                                    >
                                        <X className="size-5" />
                                    </button>
                                </div>

                                <p className="hidden lg:block text-white/40 text-xs font-medium uppercase tracking-tight mb-2">
                                    All Images ({images.length})
                                </p>

                                <div
                                    className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 hide-scrollbar scroll-smooth"
                                >
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImageIndex(i)}
                                            className={cn(
                                                "relative shrink-0 w-20 h-14 lg:w-full lg:h-40 rounded-xl overflow-hidden border-2 transition-all duration-300",
                                                selectedImageIndex === i
                                                    ? "border-primary scale-95 shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                                                    : "border-transparent opacity-40 hover:opacity-100"
                                            )}
                                        >
                                            <Image
                                                src={img}
                                                alt={`Thumbnail ${i + 1}`}
                                                fill
                                                sizes="(max-width: 1024px) 80px, 300px"
                                                className="object-cover"
                                            />
                                            {selectedImageIndex === i && (
                                                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                                    <div className="size-2 bg-primary rounded-full animate-pulse" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-auto hidden lg:block pt-6 border-t border-white/5">
                                    <h4 className="text-white font-medium text-sm line-clamp-2">{title}</h4>
                                    <p className="text-white/40 text-[10px] mt-1 italic">EcoVault Innovation Hub</p>
                                </div>

                                <div className="lg:hidden text-center text-white/40 text-xs mt-2 italic">
                                    {selectedImageIndex + 1} of {images.length}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>,
                    document.body,
                )}
        </>
    );
}
