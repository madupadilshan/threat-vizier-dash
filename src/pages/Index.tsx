import LiveMap from "@/components/LiveMap";
import Branding from "@/components/Branding";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import BottomPanel from "@/components/BottomPanel";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "#050511" }}>
      <LiveMap />
      <Branding />
      <LeftPanel />
      <RightPanel />
      <BottomPanel />
    </div>
  );
};

export default Index;
