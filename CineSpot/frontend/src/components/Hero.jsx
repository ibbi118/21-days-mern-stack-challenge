import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Bookmark, Play, X } from "lucide-react";

import "swiper/css";

const movies = [
  {
    id: 1,
    title: "Interstellar",
    image: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    trailer: "https://www.youtube.com/embed/zSWdZVtXT7E",
  },
  {
    id: 2,
    title: "The Dark Knight",
    image: "https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    trailer: "https://www.youtube.com/embed/EXeTwQWrcwY",
  },
  {
    id: 3,
    title: "Inception",
    image: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    trailer: "https://www.youtube.com/embed/YoHD9XEInc0",
  },
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [trailer, setTrailer] = useState(null);

  return (
    <div className="w-full px-3 sm:px-6 md:px-10 mt-[30px]">

      {/* HERO WRAPPER */}
      <div className="rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative min-h-[60vh]">

        {/* SWIPER */}
        <Swiper
          modules={[Autoplay]}
          loop
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh]"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <div className="w-full h-full p-2 sm:p-3 md:p-4">

                {/* IMAGE */}
                <div
                  className="w-full h-full bg-cover bg-center rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden relative"
                  style={{ backgroundImage: `url(${movie.image})` }}
                >

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent flex items-center">

                    <div className="px-4 sm:px-8 md:px-16 max-w-[90%] md:max-w-[60%]">

                      {/* TITLE (FIXED CUT ISSUE) */}
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
                        {movie.title}
                      </h1>

                      {/* BUTTONS */}
                      <div className="flex flex-wrap gap-3 mt-4">

                        {/* WATCH TRAILER */}
                        <button
                          onClick={() => setTrailer(movie.trailer)}
                          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-semibold transition"
                        >
                          <Play size={18} />
                          Watch Trailer
                        </button>

                        {/* SAVE */}
                        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2 rounded-lg border border-white/20 transition">
                          <Bookmark size={18} />
                          Save
                        </button>

                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* DOTS */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {movies.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "w-6 bg-red-500"
                  : "w-2 bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 🎬 TRAILER MODAL (FIXED + OUTSIDE CLICK CLOSE) */}
      {trailer && (
        <div
          onClick={() => setTrailer(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl aspect-video"
          >

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setTrailer(null)}
              className="absolute -top-10 right-0 text-white"
            >
              <X size={28} />
            </button>

            {/* VIDEO */}
            <iframe
              src={trailer}
              title="Trailer"
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>

        </div>
      )}

    </div>
  );
};

export default Hero;