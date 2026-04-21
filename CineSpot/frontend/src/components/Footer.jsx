import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-[#0f0f0f] text-gray-300 mt-16 border-t border-white/10">

      {/* TOP GRID */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">

        {/* 🎬 CineSpot */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Cine<span className="text-red-500">Spot</span>
          </h2>
          <p className="text-sm leading-relaxed">
            CineSpot is your ultimate movie discovery platform where you can explore trending films,
            watch trailers, and get personalized recommendations powered by AI.
          </p>
        </div>

        {/* 🔗 Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-red-500">Home</a></li>
            <li><a href="/movies" className="hover:text-red-500">Movies</a></li>
            <li><a href="/tv" className="hover:text-red-500">TV Shows</a></li>
            <li><a href="/new" className="hover:text-red-500">New & Trending</a></li>
          </ul>
        </div>

        {/* ℹ️ About */}
        <div>
          <h3 className="text-white font-semibold mb-3">About</h3>
          <p className="text-sm leading-relaxed">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>

         <div className="flex gap-4 mt-4">
         <FaFacebook className="cursor-pointer hover:text-red-500" />
         <FaInstagram className="cursor-pointer hover:text-red-500" />
         <FaTwitter className="cursor-pointer hover:text-red-500" />
         <FaYoutube className="cursor-pointer hover:text-red-500" />
</div>
        </div>

        {/* 🤖 Smart Feature */}
        <div>
          <h3 className="text-white font-semibold mb-3">Smart Features</h3>

          <p className="text-sm leading-relaxed mb-4">
            CineSpot includes a unique mood detection system that analyzes your expressions
            and recommends movies based on your current mood.
          </p>

          {/* <Link to="/mood"> */}
            <button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-5 py-2 rounded-lg text-sm font-semibold shadow-lg transition">
              Try Mood Detection 🎭
            </button>
          {/* </Link> */}
        </div>
      </div>

      {/* 🔻 BOTTOM BAR (OUTSIDE GRID) */}
      <div className="text-center text-xs text-gray-500 py-4 border-t border-white/10">
        © {new Date().getFullYear()} CineSpot. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;