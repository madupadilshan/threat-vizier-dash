import { useEffect, useRef, useState, useCallback } from "react";
import Globe, { GlobeInstance } from "react-globe.gl";

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
}

// Mock initial attack arcs
const INITIAL_ARCS: ArcData[] = [
  { startLat: 55.75, startLng: 37.62, endLat: 38.9, endLng: -77.04, color: "#ff3333" },
  { startLat: 39.9, startLng: 116.4, endLat: 51.5, endLng: -0.12, color: "#ff4444" },
  { startLat: 35.68, startLng: 139.69, endLat: 37.57, endLng: 126.98, color: "#ff2222" },
  { startLat: -23.55, startLng: -46.63, endLat: 48.86, endLng: 2.35, color: "#ff5555" },
  { startLat: 28.61, startLng: 77.21, endLat: 40.71, endLng: -74.01, color: "#ff3333" },
  { startLat: 1.35, startLng: 103.82, endLat: -33.87, endLng: 151.21, color: "#ff4444" },
  { startLat: 52.52, startLng: 13.41, endLat: 34.05, endLng: -118.24, color: "#ff2222" },
  { startLat: 30.04, startLng: 31.24, endLat: 55.68, endLng: 12.57, color: "#ff5555" },
];

export default function LiveMap() {
  const globeRef = useRef<GlobeInstance | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [arcs, setArcs] = useState<ArcData[]>(INITIAL_ARCS);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Auto-rotate
  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableZoom = false;
    globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
  }, []);

  // Resize
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Socket.io mock - simulate new threats
  useEffect(() => {
    const interval = setInterval(() => {
      const randomArc: ArcData = {
        startLat: (Math.random() - 0.5) * 160,
        startLng: (Math.random() - 0.5) * 340,
        endLat: (Math.random() - 0.5) * 160,
        endLng: (Math.random() - 0.5) * 340,
        color: `hsl(${Math.random() * 20}, 100%, ${50 + Math.random() * 20}%)`,
      };
      setArcs((prev) => [...prev.slice(-20), randomArc]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Socket.io connection (will connect when backend is available)
  useEffect(() => {
    try {
      // import("socket.io-client").then(({ io }) => {
      //   const socket = io("http://localhost:5000");
      //   socket.on("new_threat", (data: ArcData) => {
      //     setArcs((prev) => [...prev.slice(-30), data]);
      //   });
      //   return () => { socket.disconnect(); };
      // });
    } catch {
      // Backend not available yet
    }
  }, []);

  const getArcColor = useCallback(() => (d: object) => {
    return (d as ArcData).color || "#ff3333";
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0">
      {dimensions.width > 0 && (
        <Globe
          ref={globeRef as any}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundColor="rgba(5,5,17,0)"
          atmosphereColor="hsl(185, 100%, 50%)"
          atmosphereAltitude={0.15}
          arcsData={arcs}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor={getArcColor()}
          arcDashLength={0.6}
          arcDashGap={0.3}
          arcDashAnimateTime={2000}
          arcStroke={0.5}
          showGraticules={false}
        />
      )}
    </div>
  );
}
