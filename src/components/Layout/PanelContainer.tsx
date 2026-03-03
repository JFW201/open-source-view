import React from "react";
import { usePanelStore } from "../../store/panelStore";
import { NewsFeed } from "../Panels/NewsFeed";
import { CountryDetail } from "../Panels/CountryDetail";
import { MarketData } from "../Panels/MarketData";
import { PredictionMarkets } from "../Panels/PredictionMarkets";
import { TwitterFeed } from "../Panels/TwitterFeed";
import { AISummary } from "../Panels/AISummary";
import { Settings } from "../Panels/Settings";
import { AlertsPanel } from "../Panels/AlertsPanel";
import { TimelinePanel } from "../Panels/TimelinePanel";
import { SignalsPanel } from "../Panels/SignalsPanel";

const PANELS: Record<string, React.FC> = {
  news: NewsFeed,
  country: CountryDetail,
  markets: MarketData,
  predictions: PredictionMarkets,
  twitter: TwitterFeed,
  ai: AISummary,
  settings: Settings,
  alerts: AlertsPanel,
  timeline: TimelinePanel,
  signals: SignalsPanel,
};

export const PanelContainer: React.FC = () => {
  const { activePanel, panelWidth } = usePanelStore();

  if (!activePanel) return null;

  const PanelComponent = PANELS[activePanel];
  if (!PanelComponent) return null;

  return (
    <div
      className="h-full bg-waldorf-surface border-l border-waldorf-border flex flex-col overflow-hidden"
      style={{ width: panelWidth }}
    >
      <PanelComponent />
    </div>
  );
};
