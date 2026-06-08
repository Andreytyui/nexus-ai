"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [viewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) newState[parseInt(key)] = false;
      });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulse: Record<number, boolean> = {};
        relatedItems.forEach((relId) => { newPulse[relId] = true; });
        setPulseEffect(newPulse);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (autoRotate && viewMode === "orbital") {
      timer = setInterval(() => {
        setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
      }, 50);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (!nodeRefs.current[nodeId]) return;
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const targetAngle = (nodeIndex / timelineData.length) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const item = timelineData.find((i) => i.id === itemId);
    return item ? item.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":   return "border-[#3af0c8] bg-[#3af0c8]/20 text-[#3af0c8]";
      case "in-progress": return "border-[#4d8fff] bg-[#4d8fff]/20 text-[#4d8fff]";
      case "pending":     return "border-white/30 bg-white/5 text-white/50";
      default:            return "border-white/30 bg-white/5 text-white/50";
    }
  };

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#080c18" }}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Header */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-50 pointer-events-none">
        <p
          className="text-xs font-mono tracking-[0.3em] uppercase mb-1"
          style={{ color: "#3af0c8" }}
        >
          Andrey Nonardo
        </p>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce6f5" }}
        >
          Jornada & Projetos
        </h1>
      </div>

      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Center orb — neon gradient */}
          <div
            className="absolute w-16 h-16 rounded-full flex items-center justify-center z-10 animate-pulse"
            style={{ background: "linear-gradient(135deg, #3af0c8, #4d8fff)" }}
          >
            <div
              className="absolute w-20 h-20 rounded-full border animate-ping opacity-70"
              style={{ borderColor: "rgba(58,240,200,0.3)" }}
            />
            <div
              className="absolute w-24 h-24 rounded-full border animate-ping opacity-40"
              style={{ borderColor: "rgba(77,143,255,0.2)", animationDelay: "0.5s" }}
            />
            <div
              className="w-8 h-8 rounded-full"
              style={{ background: "rgba(220,230,245,0.9)", backdropFilter: "blur(8px)" }}
            />
          </div>

          {/* Orbit ring */}
          <div
            className="absolute w-96 h-96 rounded-full"
            style={{ border: "1px solid rgba(58,240,200,0.12)" }}
          />

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isExpanded ? 200 : position.zIndex,
                  opacity: isExpanded ? 1 : position.opacity,
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {/* Glow aura */}
                <div
                  className={`absolute rounded-full ${isPulsing ? "animate-pulse" : ""}`}
                  style={{
                    background: "radial-gradient(circle, rgba(58,240,200,0.15) 0%, rgba(58,240,200,0) 70%)",
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                />

                {/* Node icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isExpanded ? "scale-150" : ""} ${isRelated ? "animate-pulse" : ""}`}
                  style={{
                    background: isExpanded
                      ? "linear-gradient(135deg, #3af0c8, #4d8fff)"
                      : isRelated
                      ? "rgba(58,240,200,0.2)"
                      : "rgba(8,12,24,0.9)",
                    borderColor: isExpanded
                      ? "#3af0c8"
                      : isRelated
                      ? "#3af0c8"
                      : "rgba(255,255,255,0.2)",
                    boxShadow: isExpanded ? "0 0 20px rgba(58,240,200,0.4)" : "none",
                    color: isExpanded ? "#080c18" : "#dce6f5",
                  }}
                >
                  <Icon size={16} />
                </div>

                {/* Label */}
                <div
                  className={`absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300 ${isExpanded ? "scale-125" : ""}`}
                  style={{
                    color: isExpanded ? "#3af0c8" : "rgba(220,230,245,0.6)",
                    fontFamily: "'Space Mono', monospace",
                    left: "50%",
                    transform: `translateX(-50%) ${isExpanded ? "scale(1.25)" : ""}`,
                  }}
                >
                  {item.title}
                </div>

                {/* Expanded card */}
                {isExpanded && (
                  <Card
                    className="absolute top-20 left-1/2 -translate-x-1/2 w-72 overflow-visible"
                    style={{
                      background: "rgba(13,18,38,0.95)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(58,240,200,0.25)",
                      boxShadow: "0 0 40px rgba(58,240,200,0.1), 0 20px 60px rgba(0,0,0,0.5)",
                    }}
                  >
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3"
                      style={{ background: "rgba(58,240,200,0.5)" }}
                    />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className={`px-2 text-xs border font-mono ${getStatusStyles(item.status)}`}>
                          {item.status === "completed"
                            ? "COMPLETO"
                            : item.status === "in-progress"
                            ? "ATIVO"
                            : "PENDENTE"}
                        </Badge>
                        <span className="text-xs font-mono" style={{ color: "rgba(220,230,245,0.4)" }}>
                          {item.date}
                        </span>
                      </div>
                      <CardTitle
                        className="text-sm mt-2"
                        style={{ color: "#dce6f5", fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs" style={{ color: "rgba(220,230,245,0.7)" }}>
                      <p>{item.content}</p>

                      <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="flex items-center gap-1" style={{ color: "rgba(58,240,200,0.7)" }}>
                            <Zap size={10} />
                            Nível
                          </span>
                          <span className="font-mono" style={{ color: "#3af0c8" }}>{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${item.energy}%`,
                              background: "linear-gradient(90deg, #3af0c8, #4d8fff)",
                            }}
                          />
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                          <div className="flex items-center mb-2 gap-1">
                            <Link size={10} style={{ color: "rgba(58,240,200,0.7)" }} />
                            <h4
                              className="text-xs uppercase tracking-wider font-medium font-mono"
                              style={{ color: "rgba(58,240,200,0.7)" }}
                            >
                              Conectados
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const related = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-xs rounded-sm transition-all"
                                  style={{
                                    border: "1px solid rgba(58,240,200,0.25)",
                                    background: "transparent",
                                    color: "rgba(220,230,245,0.7)",
                                    fontFamily: "'Space Mono', monospace",
                                  }}
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relatedId); }}
                                >
                                  {related?.title}
                                  <ArrowRight size={8} className="ml-1" style={{ color: "#3af0c8" }} />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
        <p
          className="text-xs font-mono tracking-widest text-center"
          style={{ color: "rgba(220,230,245,0.25)" }}
        >
          CLIQUE EM UM NÓ PARA EXPANDIR · CLIQUE NO FUNDO PARA FECHAR
        </p>
      </div>
    </div>
  );
}
