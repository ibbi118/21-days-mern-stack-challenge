import Hero from "../components/Hero";
import Cardlist from "../components/Cardlist";

const Home = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Hero />

      <Cardlist title="Trending 🔥" />
      <Cardlist title="Popular Movies" />
      <Cardlist title="Top Rated ⭐" />
    </div>
  );
};

export default Home;