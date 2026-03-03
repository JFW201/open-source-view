import React from "react";
import {
  Radar,
  Shield,
  Building2,
  Globe2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useMapStore } from "../../../store/mapStore";
import { useSettingsStore } from "../../../store/settingsStore";
import { LAYER_CATEGORIES } from "../../../constants/layers";
import clsx from "clsx";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  tracking: <Radar size={14} />,
  military: <Shield size={14} />,
  infrastructure: <Building2 size={14} />,
  geopolitical: <Globe2 size={14} />,
};

export const LayerPanel: React.FC = () => {
  const layers = useMapStore((s) => s.layers);
  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const hasApiKey = useSettingsStore((s) => s.hasApiKey);
  const [expandedCategories, setExpandedCategories] = React.useState<
    Set<string>
  >(new Set(LAYER_CATEGORIES.map((c) => c.id)));

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="px-3 py-2 text-xs font-semibold text-waldorf-text-dim uppercase tracking-wider">
        Map Layers
      </div>

      {LAYER_CATEGORIES.map((cat) => {
        const catLayers = layers.filter((l) => l.category === cat.id);
        const expanded = expandedCategories.has(cat.id);
        const activeCount = catLayers.filter((l) => l.visible).length;

        return (
          <div key={cat.id}>
            <button
              onClick={() => toggleCategory(cat.id)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-waldorf-surface-bright transition-colors"
            >
              {expanded ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
              <span className="text-waldorf-text-dim">
                {CATEGORY_ICONS[cat.id]}
              </span>
              <span className="flex-1 text-left">{cat.label}</span>
              {activeCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-waldorf-accent/20 text-waldorf-accent">
                  {activeCount}
                </span>
              )}
            </button>

            {expanded && (
              <div className="ml-4">
                {catLayers.map((layer) => {
                  const needsKey = layer.requiresApiKey;
                  const hasKey = needsKey ? hasApiKey(needsKey) : true;
                  const disabled = !hasKey;

                  return (
                    <button
                      key={layer.id}
                      onClick={() => !disabled && toggleLayer(layer.id)}
                      disabled={disabled}
                      className={clsx(
                        "w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors",
                        disabled
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-waldorf-surface-bright cursor-pointer"
                      )}
                      title={
                        disabled
                          ? `Requires ${needsKey} API key — configure in Settings`
                          : layer.description
                      }
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: `rgb(${layer.color.join(",")})`,
                          opacity: layer.visible ? 1 : 0.3,
                        }}
                      />
                      <span
                        className={clsx(
                          "flex-1 text-left",
                          layer.visible
                            ? "text-waldorf-text"
                            : "text-waldorf-text-dim"
                        )}
                      >
                        {layer.name}
                      </span>
                      {!disabled &&
                        (layer.visible ? (
                          <Eye size={13} className="text-waldorf-accent" />
                        ) : (
                          <EyeOff
                            size={13}
                            className="text-waldorf-text-dim"
                          />
                        ))}
                      {disabled && (
                        <span className="text-[9px] text-waldorf-warning">
                          KEY
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
