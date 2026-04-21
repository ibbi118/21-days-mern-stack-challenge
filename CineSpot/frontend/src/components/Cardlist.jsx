import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

const movies = [
  {
    id: 1,
    title: "Interstellar",
    image: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
  },
  {
    id: 2,
    title: "Inception",
    image: "https://image.tmdb.org/t/p/w500/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
  },
  {
    id: 3,
    title: "Dark Knight",
    image: "https://image.tmdb.org/t/p/w500/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
  },
  {
    id: 4,
    title: "Avengers",
    image: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
  },
  {
    id: 5,
    title: "Joker",
    image: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
  },
  {
    id: 6,
    title: "Tenet",
    image: "https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg",
  },
];

const Cardlist = ({ title = "Trending" }) => {
  return (
    <div className="w-full px-4 md:px-10 mt-10">

      {/* 🔝 Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          {title}
        </h2>

        {/* Arrows */}
        <div className="flex gap-2">
          <button className="swiper-button-prev-custom w-9 h-9 flex items-center justify-center border border-gray-500 rounded-full hover:bg-red-500 hover:border-red-500 transition">
            <ChevronLeft size={18} />
          </button>

          <button className="swiper-button-next-custom w-9 h-9 flex items-center justify-center border border-gray-500 rounded-full hover:bg-red-500 hover:border-red-500 transition">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 🎞 Swiper */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={15}
        slidesPerView={2.2}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        breakpoints={{
          640: { slidesPerView: 3.2 },
          768: { slidesPerView: 4.2 },
          1024: { slidesPerView: 5.2 },
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            {/* 🎬 Card */}
            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden cursor-pointer group">
              <div className="overflow-hidden">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-[220px] object-cover group-hover:scale-110 transition duration-300"
                />
              </div>

              <div className="p-2">
                <h3 className="text-sm font-medium truncate">
                  {movie.title}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Cardlist;