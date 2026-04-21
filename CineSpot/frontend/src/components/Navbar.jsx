import { useState, useRef, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-[#0f0f0f] text-white px-6 py-4 fixed top-0 left-0 z-50 shadow-md">

      <div className="flex items-center justify-between">

        {/* 🔥 Logo */}
        <div className="text-2xl font-bold tracking-wide">
          Cine<span className="text-red-500">Spot</span>
        </div>

        {/* 🧭 Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="/" className="hover:text-red-500 transition">Home</a>
          <a href="/movies" className="hover:text-red-500 transition">Movies</a>
          <a href="/tv" className="hover:text-red-500 transition">TV Shows</a>

          <a href="/new" className="relative hover:text-red-500 transition">
            Mood
            <span className="absolute -top-2 -right-4 text-[10px] bg-red-500 px-1 rounded">
              NEW
            </span>
          </a>
        </div>

        {/* 🔍 Search + Buttons */}
        <div className="hidden md:flex items-center gap-4">

          {/* Search */}
          <div className="flex items-center bg-[#1c1c1c] px-3 py-1 rounded-lg">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search movies..."
              className="bg-transparent outline-none px-2 text-sm"
            />
          </div>

          {/* AI Button */}
          <button className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg text-sm font-semibold">
            AI Recommend
          </button>

          {/* 👤 Profile Section */}
          <div className="relative" ref={profileRef}>

            {/* Avatar */}
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-9 h-9 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center font-bold cursor-pointer hover:scale-110 transition shadow-lg"
            >
              C
            </div>

            {/* Dropdown */}
            <div
              className={`absolute right-0 top-12 w-52 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden transition-all duration-200 ${
                profileOpen
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-3 invisible"
              }`}
            >
              <ul className="text-sm text-gray-300">

                <li className="px-4 py-3 hover:bg-white/10 cursor-pointer">
                  👤 Profile
                </li>

                <li className="px-4 py-3 hover:bg-white/10 cursor-pointer">
                  ❤️ Bookmarks
                </li>

                <li className="px-4 py-3 hover:bg-white/10 cursor-pointer">
                  🎬 Watch History
                </li>

                <li className="px-4 py-3 hover:bg-red-500/20 text-red-400 cursor-pointer border-t border-white/10">
                  🚪 Logout
                </li>

              </ul>
            </div>

          </div>

        </div>

        {/* 📱 Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

      </div>

     {/* 📱 Mobile Menu */}
     {isOpen && (
  <div className="md:hidden mt-4 flex flex-col gap-4 bg-[#1a1a1a] p-4 rounded-lg">

    {/* Navigation */}
    <a href="/" className="hover:text-red-500">Home</a>
    <a href="/movies" className="hover:text-red-500">Movies</a>
    <a href="/tv" className="hover:text-red-500">TV Shows</a>

    <div className="flex items-center gap-2">
      <span>Mood</span>
      <span className="text-[10px] bg-red-500 px-1 rounded">NEW</span>
    </div>

    {/* Search */}
    <div className="flex items-center bg-[#2a2a2a] px-3 py-2 rounded-lg">
      <Search size={18} className="text-gray-400" />
      <input
        type="text"
        placeholder="Search..."
        className="bg-transparent outline-none px-2 text-sm w-full"
      />
    </div>

    <button className="bg-red-500 py-2 rounded-lg">
      AI Recommend
    </button>

    {/* 🔥 PROFILE SECTION (NEW ADD) */}
    <div className="border-t border-white/10 pt-3 mt-2">

      {/* Profile */}
      <div className="flex items-center gap-3 px-2 py-2 hover:bg-white/10 rounded-lg cursor-pointer">
        <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center font-bold">
          C
        </div>
        <span>My Profile</span>
      </div>

      {/* Bookmarks */}
      <div className="px-2 py-2 hover:bg-white/10 rounded-lg cursor-pointer">
        ❤️ Bookmarks
      </div>

      {/* Watch History */}
      <div className="px-2 py-2 hover:bg-white/10 rounded-lg cursor-pointer">
        🎬 Watch History
      </div>

      {/* Logout */}
      <div className="px-2 py-2 text-red-400 hover:bg-red-500/20 rounded-lg cursor-pointer border-t border-white/10 mt-2">
        🚪 Logout
      </div>

    </div>

  </div>
      )}

    </nav>
  );
};

export default Navbar;