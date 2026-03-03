import React, { useState, useCallback } from "react";
import {
  MapPin,
  Pentagon,
  CircleDot,
  Ruler,
  X,
  Trash2,
  Check,
} from "lucide-react";
import { useAnnotationStore } from "../../../store/annotationStore";
import type { AnnotationType } from "../../../types";
import clsx from "clsx";

const ANNOTATION_COLORS: { name: string; color: [number, number, number] }[] = [
  { name: "Blue", color: [59, 130, 246] },
  { name: "Red", color: [239, 68, 68] },
  { name: "Green", color: [34, 197, 94] },
  { name: "Orange", color: [245, 158, 11] },
  { name: "Purple", color: [168, 85, 247] },
  { name: "Cyan", color: [6, 182, 212] },
];

export const MapToolbar: React.FC = () => {
  const {
    activeMode,
    setActiveMode,
    annotations,
    measurements,
    pendingPolygonPoints,
    pendingMeasurePoints,
    finishPolygon,
    finishMeasurement,
    cancelPending,
    clearAnnotations,
    clearMeasurements,
  } = useAnnotationStore();

  const [showNameDialog, setShowNameDialog] = useState(false);
  const [annotationName, setAnnotationName] = useState("");
  const [annotationDesc, setAnnotationDesc] = useState("");
  const [annotationColor, setAnnotationColor] = useState<
    [number, number, number]
  >([59, 130, 246]);
  const [circleRadius, setCircleRadius] = useState(50);

  const handleModeSelect = useCallback(
    (mode: "marker" | "polygon" | "circle" | "measure") => {
      if (activeMode === mode) {
        cancelPending();
      } else {
        setActiveMode(mode);
      }
    },
    [activeMode, setActiveMode, cancelPending]
  );

  const handleFinishPolygon = useCallback(() => {
    if (pendingPolygonPoints.length >= 3) {
      setShowNameDialog(true);
    }
  }, [pendingPolygonPoints]);

  const handleConfirmPolygon = useCallback(() => {
    finishPolygon(
      annotationName || "Untitled Region",
      annotationDesc,
      annotationColor
    );
    setShowNameDialog(false);
    setAnnotationName("");
    setAnnotationDesc("");
  }, [
    annotationName,
    annotationDesc,
    annotationColor,
    finishPolygon,
  ]);

  const handleFinishMeasure = useCallback(() => {
    if (pendingMeasurePoints.length >= 2) {
      finishMeasurement();
    }
  }, [pendingMeasurePoints, finishMeasurement]);

  // Calculate pending measurement distance
  let pendingDistance = 0;
  for (let i = 1; i < pendingMeasurePoints.length; i++) {
    const R = 6371;
    const dLat =
      ((pendingMeasurePoints[i].latitude -
        pendingMeasurePoints[i - 1].latitude) *
        Math.PI) /
      180;
    const dLon =
      ((pendingMeasurePoints[i].longitude -
        pendingMeasurePoints[i - 1].longitude) *
        Math.PI) /
      180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pendingMeasurePoints[i - 1].latitude * Math.PI) / 180) *
        Math.cos((pendingMeasurePoints[i].latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    pendingDistance += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  return (
    <div className="flex flex-col gap-1.5">
      {/* Tool buttons */}
      <div className="bg-waldorf-surface/90 backdrop-blur-sm border border-waldorf-border rounded-lg overflow-hidden">
        <button
          onClick={() => handleModeSelect("marker")}
          className={clsx(
            "w-8 h-8 flex items-center justify-center transition-colors",
            activeMode === "marker"
              ? "bg-waldorf-accent text-white"
              : "text-waldorf-text-dim hover:text-waldorf-text hover:bg-waldorf-surface-bright"
          )}
          title="Place marker"
        >
          <MapPin size={14} />
        </button>
        <button
          onClick={() => handleModeSelect("polygon")}
          className={clsx(
            "w-8 h-8 flex items-center justify-center transition-colors border-t border-waldorf-border",
            activeMode === "polygon"
              ? "bg-waldorf-accent text-white"
              : "text-waldorf-text-dim hover:text-waldorf-text hover:bg-waldorf-surface-bright"
          )}
          title="Draw polygon"
        >
          <Pentagon size={14} />
        </button>
        <button
          onClick={() => handleModeSelect("circle")}
          className={clsx(
            "w-8 h-8 flex items-center justify-center transition-colors border-t border-waldorf-border",
            activeMode === "circle"
              ? "bg-waldorf-accent text-white"
              : "text-waldorf-text-dim hover:text-waldorf-text hover:bg-waldorf-surface-bright"
          )}
          title="Draw circle"
        >
          <CircleDot size={14} />
        </button>
        <button
          onClick={() => handleModeSelect("measure")}
          className={clsx(
            "w-8 h-8 flex items-center justify-center transition-colors border-t border-waldorf-border",
            activeMode === "measure"
              ? "bg-waldorf-accent text-white"
              : "text-waldorf-text-dim hover:text-waldorf-text hover:bg-waldorf-surface-bright"
          )}
          title="Measure distance"
        >
          <Ruler size={14} />
        </button>
      </div>

      {/* Active mode info */}
      {activeMode !== "none" && (
        <div className="bg-waldorf-surface/90 backdrop-blur-sm border border-waldorf-border rounded-lg p-2 min-w-[160px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-waldorf-accent uppercase">
              {activeMode === "measure" ? "Measuring" : activeMode}
            </span>
            <button
              onClick={cancelPending}
              className="p-0.5 hover:bg-waldorf-surface-bright rounded"
            >
              <X size={10} className="text-waldorf-text-dim" />
            </button>
          </div>

          {activeMode === "marker" && (
            <div className="space-y-1.5">
              <p className="text-[10px] text-waldorf-text-dim">
                Click map to place marker
              </p>
              <div className="flex gap-1">
                {ANNOTATION_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setAnnotationColor(c.color)}
                    className={clsx(
                      "w-4 h-4 rounded-full border-2 transition-colors",
                      annotationColor[0] === c.color[0] &&
                        annotationColor[1] === c.color[1]
                        ? "border-white"
                        : "border-transparent"
                    )}
                    style={{
                      backgroundColor: `rgb(${c.color[0]}, ${c.color[1]}, ${c.color[2]})`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {activeMode === "polygon" && (
            <div className="space-y-1.5">
              <p className="text-[10px] text-waldorf-text-dim">
                Click to add points ({pendingPolygonPoints.length} placed)
              </p>
              {pendingPolygonPoints.length >= 3 && (
                <button
                  onClick={handleFinishPolygon}
                  className="w-full flex items-center justify-center gap-1 text-[10px] bg-waldorf-accent text-white py-1 rounded hover:bg-waldorf-accent-bright transition-colors"
                >
                  <Check size={10} />
                  Finish ({pendingPolygonPoints.length} pts)
                </button>
              )}
            </div>
          )}

          {activeMode === "circle" && (
            <div className="space-y-1.5">
              <p className="text-[10px] text-waldorf-text-dim">
                Click map to place circle center
              </p>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-waldorf-text-dim">R:</span>
                <input
                  type="range"
                  min={5}
                  max={500}
                  value={circleRadius}
                  onChange={(e) => setCircleRadius(Number(e.target.value))}
                  className="flex-1 h-1 accent-waldorf-accent"
                />
                <span className="text-[10px] font-mono text-waldorf-text w-10 text-right">
                  {circleRadius}km
                </span>
              </div>
            </div>
          )}

          {activeMode === "measure" && (
            <div className="space-y-1">
              <p className="text-[10px] text-waldorf-text-dim">
                Click points to measure ({pendingMeasurePoints.length} placed)
              </p>
              {pendingMeasurePoints.length >= 2 && (
                <>
                  <div className="text-xs font-mono text-waldorf-accent font-semibold">
                    {pendingDistance < 1
                      ? `${(pendingDistance * 1000).toFixed(0)} m`
                      : `${pendingDistance.toFixed(2)} km`}
                    <span className="text-[10px] text-waldorf-text-dim ml-1">
                      ({(pendingDistance * 0.539957).toFixed(2)} nmi)
                    </span>
                  </div>
                  <button
                    onClick={handleFinishMeasure}
                    className="w-full flex items-center justify-center gap-1 text-[10px] bg-waldorf-accent text-white py-1 rounded hover:bg-waldorf-accent-bright transition-colors"
                  >
                    <Check size={10} />
                    Save Measurement
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Annotations/measurements count */}
      {(annotations.length > 0 || measurements.length > 0) && (
        <div className="bg-waldorf-surface/90 backdrop-blur-sm border border-waldorf-border rounded-lg p-2 space-y-1">
          {annotations.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-waldorf-text-dim">
                {annotations.length} annotation{annotations.length !== 1 && "s"}
              </span>
              <button
                onClick={clearAnnotations}
                className="p-0.5 hover:bg-waldorf-surface-bright rounded"
                title="Clear annotations"
              >
                <Trash2
                  size={8}
                  className="text-waldorf-text-dim hover:text-waldorf-danger"
                />
              </button>
            </div>
          )}
          {measurements.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-waldorf-text-dim">
                {measurements.length} measurement{measurements.length !== 1 && "s"}
              </span>
              <button
                onClick={clearMeasurements}
                className="p-0.5 hover:bg-waldorf-surface-bright rounded"
                title="Clear measurements"
              >
                <Trash2
                  size={8}
                  className="text-waldorf-text-dim hover:text-waldorf-danger"
                />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Name dialog for polygon */}
      {showNameDialog && (
        <div className="bg-waldorf-surface/95 backdrop-blur-sm border border-waldorf-border rounded-lg p-3 space-y-2 min-w-[200px]">
          <div className="text-[10px] font-semibold text-waldorf-accent">
            Name Region
          </div>
          <input
            type="text"
            placeholder="Region name..."
            value={annotationName}
            onChange={(e) => setAnnotationName(e.target.value)}
            className="w-full bg-waldorf-bg border border-waldorf-border rounded px-2 py-1 text-xs text-waldorf-text placeholder:text-waldorf-text-dim focus:outline-none focus:border-waldorf-accent"
            autoFocus
          />
          <input
            type="text"
            placeholder="Description (optional)..."
            value={annotationDesc}
            onChange={(e) => setAnnotationDesc(e.target.value)}
            className="w-full bg-waldorf-bg border border-waldorf-border rounded px-2 py-1 text-xs text-waldorf-text placeholder:text-waldorf-text-dim focus:outline-none focus:border-waldorf-accent"
          />
          <div className="flex gap-1">
            {ANNOTATION_COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => setAnnotationColor(c.color)}
                className={clsx(
                  "w-5 h-5 rounded-full border-2 transition-colors",
                  annotationColor[0] === c.color[0] &&
                    annotationColor[1] === c.color[1]
                    ? "border-white"
                    : "border-transparent"
                )}
                style={{
                  backgroundColor: `rgb(${c.color[0]}, ${c.color[1]}, ${c.color[2]})`,
                }}
              />
            ))}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={handleConfirmPolygon}
              className="flex-1 bg-waldorf-accent text-white text-[10px] py-1 rounded hover:bg-waldorf-accent-bright transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setShowNameDialog(false)}
              className="px-2 bg-waldorf-surface-bright text-waldorf-text-dim text-[10px] py-1 rounded hover:bg-waldorf-border transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
