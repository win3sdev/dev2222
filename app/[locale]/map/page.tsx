"use client";

import React, { useEffect, useState } from "react";
import * as echarts from "echarts/core";
import ReactECharts from "echarts-for-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GeoComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import { MapChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { useTranslations } from "next-intl";
import { Construction } from "lucide-react";

echarts.use([
  MapChart,
  GeoComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

export default function MapPage() {
  const t = useTranslations("map");


  return (
    <div className="min-h-screen flex items-start justify-center pt-24 px-4 bg-gradient-to-br from-muted/40 to-background text-foreground">
      <div className="bg-card/80 backdrop-blur-md border border-border rounded-2xl shadow-xl p-10 max-w-xl text-center animate-fade-in space-y-6">
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-full shadow-inner">
            <Construction className="w-10 h-10 text-yellow-600" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("description")}
        </p>
        <Link href="/">
          <Button size="lg" className="mt-4">
            ← {t("backHome")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
