import LiveMap from "@/components/LiveMap";
import RightPanel from "@/components/RightPanel";

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "#050511" }}>
      <LiveMap />
      <div className="fixed top-20 right-6 z-40 w-80 space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto cyber-scrollbar">
        <RightPanel />
      </div>
    </div>
  );
};

export default Home;
