import React, { useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  Square,
  Circle,
  SkipBack,
  SkipForward,
  Trash2,
  FastForward,
} from "lucide-react";
import { usePlaybackStore } from "../../../store/playbackStore";
import { useMapStore } from "../../../store/mapStore";
import { format } from "date-fns";
import clsx from "clsx";

export const PlaybackControl: React.FC = () => {
  const {
    isRecording,
    isPlaying,
    snapshots,
    currentIndex,
    playbackSpeed,
    startRecording,
    stopRecording,
    addSnapshot,
    play,
    pause,
    stop,
    setCurrentIndex,
    setPlaybackSpeed,
    clearHistory,
  } = usePlaybackStore();

  const aircraft = useMapStore((s) => s.aircraft);
  const vessels = useMapStore((s) => s.vessels);
  const setAircraft = useMapStore((s) => s.setAircraft);
  const setVessels = useMapStore((s) => s.setVessels);

  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const liveAircraftRef = useRef(aircraft);
  const liveVesselsRef = useRef(vessels);

  // Keep refs updated with live data
  useEffect(() => {
    if (!isPlaying) {
      liveAircraftRef.current = aircraft;
      liveVesselsRef.current = vessels;
    }
  }, [aircraft, vessels, isPlaying]);

  // Recording: snapshot every 60 seconds
  useEffect(() => {
    if (isRecording) {
      // Take immediate snapshot
      addSnapshot({
        timestamp: Date.now(),
        aircraft: [...liveAircraftRef.current],
        vessels: [...liveVesselsRef.current],
      });

      recordIntervalRef.current = setInterval(() => {
        addSnapshot({
          timestamp: Date.now(),
          aircraft: [...liveAircraftRef.current],
          vessels: [...liveVesselsRef.current],
        });
      }, 60000);
    }

    return () => {
      if (recordIntervalRef.current) {
        clearInterval(recordIntervalRef.current);
        recordIntervalRef.current = null;
      }
    };
  }, [isRecording, addSnapshot]);

  // Playback
  useEffect(() => {
    if (isPlaying && snapshots.length > 1) {
      const interval = Math.max(500, 2000 / playbackSpeed);
      playIntervalRef.current = setInterval(() => {
        const { currentIndex, snapshots } = usePlaybackStore.getState();
        if (currentIndex < snapshots.length - 1) {
          const next = currentIndex + 1;
          setCurrentIndex(next);
          setAircraft(snapshots[next].aircraft);
          setVessels(snapshots[next].vessels);
        } else {
          pause();
        }
      }, interval);
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    };
  }, [
    isPlaying,
    playbackSpeed,
    snapshots.length,
    setCurrentIndex,
    setAircraft,
    setVessels,
    pause,
  ]);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const idx = Number(e.target.value);
      setCurrentIndex(idx);
      if (snapshots[idx]) {
        setAircraft(snapshots[idx].aircraft);
        setVessels(snapshots[idx].vessels);
      }
    },
    [snapshots, setCurrentIndex, setAircraft, setVessels]
  );

  const handleStop = useCallback(() => {
    stop();
    // Restore live data
    setAircraft(liveAircraftRef.current);
    setVessels(liveVesselsRef.current);
  }, [stop, setAircraft, setVessels]);

  const cycleSpeed = useCallback(() => {
    const speeds = [1, 2, 4, 8];
    const idx = speeds.indexOf(playbackSpeed);
    setPlaybackSpeed(speeds[(idx + 1) % speeds.length]);
  }, [playbackSpeed, setPlaybackSpeed]);

  if (snapshots.length === 0 && !isRecording) {
    return (
      <div className="bg-waldorf-surface/90 backdrop-blur-sm border border-waldorf-border rounded-lg px-3 py-2 flex items-center gap-2">
        <button
          onClick={startRecording}
          className="flex items-center gap-1.5 text-[10px] text-waldorf-text-dim hover:text-waldorf-danger transition-colors"
          title="Start recording positions"
        >
          <Circle size={10} className="text-waldorf-danger" />
          Record
        </button>
      </div>
    );
  }

  const currentSnapshot = snapshots[currentIndex];
  const timeLabel = currentSnapshot
    ? format(new Date(currentSnapshot.timestamp), "HH:mm:ss")
    : "--:--:--";
  const startLabel =
    snapshots.length > 0
      ? format(new Date(snapshots[0].timestamp), "HH:mm")
      : "";
  const endLabel =
    snapshots.length > 0
      ? format(
          new Date(snapshots[snapshots.length - 1].timestamp),
          "HH:mm"
        )
      : "";

  return (
    <div className="bg-waldorf-surface/90 backdrop-blur-sm border border-waldorf-border rounded-lg px-3 py-2 space-y-1.5 min-w-[280px]">
      {/* Controls row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Record toggle */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={clsx(
              "p-1 rounded transition-colors",
              isRecording
                ? "text-waldorf-danger animate-pulse"
                : "text-waldorf-text-dim hover:text-waldorf-danger"
            )}
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            <Circle size={12} fill={isRecording ? "currentColor" : "none"} />
          </button>

          <span className="text-waldorf-border">|</span>

          {/* Playback controls */}
          <button
            onClick={() => {
              if (currentIndex > 0) {
                const prev = currentIndex - 1;
                setCurrentIndex(prev);
                if (snapshots[prev]) {
                  setAircraft(snapshots[prev].aircraft);
                  setVessels(snapshots[prev].vessels);
                }
              }
            }}
            disabled={currentIndex === 0}
            className="p-1 rounded text-waldorf-text-dim hover:text-waldorf-text disabled:opacity-30 transition-colors"
          >
            <SkipBack size={12} />
          </button>

          {isPlaying ? (
            <button
              onClick={pause}
              className="p-1 rounded text-waldorf-accent hover:text-waldorf-accent-bright transition-colors"
            >
              <Pause size={14} />
            </button>
          ) : (
            <button
              onClick={play}
              disabled={snapshots.length < 2}
              className="p-1 rounded text-waldorf-accent hover:text-waldorf-accent-bright disabled:opacity-30 transition-colors"
            >
              <Play size={14} />
            </button>
          )}

          <button
            onClick={handleStop}
            className="p-1 rounded text-waldorf-text-dim hover:text-waldorf-text transition-colors"
          >
            <Square size={12} />
          </button>

          <button
            onClick={() => {
              if (currentIndex < snapshots.length - 1) {
                const next = currentIndex + 1;
                setCurrentIndex(next);
                if (snapshots[next]) {
                  setAircraft(snapshots[next].aircraft);
                  setVessels(snapshots[next].vessels);
                }
              }
            }}
            disabled={currentIndex >= snapshots.length - 1}
            className="p-1 rounded text-waldorf-text-dim hover:text-waldorf-text disabled:opacity-30 transition-colors"
          >
            <SkipForward size={12} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={cycleSpeed}
            className="text-[10px] font-mono text-waldorf-text-dim hover:text-waldorf-accent transition-colors flex items-center gap-0.5"
            title="Playback speed"
          >
            <FastForward size={10} />
            {playbackSpeed}x
          </button>
          <button
            onClick={clearHistory}
            className="p-1 rounded text-waldorf-text-dim hover:text-waldorf-danger transition-colors"
            title="Clear history"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* Timeline slider */}
      <div className="space-y-0.5">
        <input
          type="range"
          min={0}
          max={Math.max(0, snapshots.length - 1)}
          value={currentIndex}
          onChange={handleSliderChange}
          className="w-full h-1 accent-waldorf-accent cursor-pointer"
        />
        <div className="flex justify-between text-[9px] text-waldorf-text-dim font-mono">
          <span>{startLabel}</span>
          <span className="text-waldorf-accent font-semibold">{timeLabel}</span>
          <span>{endLabel}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-[9px] text-waldorf-text-dim">
        <span>{snapshots.length} snapshots</span>
        {currentSnapshot && (
          <>
            <span>{currentSnapshot.aircraft.length} aircraft</span>
            <span>{currentSnapshot.vessels.length} vessels</span>
          </>
        )}
      </div>
    </div>
  );
};
