'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useChartGenerator } from '@/hooks/use-chart-generator';
import { ColorPicker } from './color-picker';
import type { ChartType, ChartOrientation, ColorTheme } from '@/lib/types/chart-generator';

export function ChartConfigPanel() {
  const { chartConfig, setChartType, setOrientation, setColorTheme } = useChartGenerator();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chart Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart Type */}
        <div className="space-y-2">
          <Label htmlFor="chart-type">Chart Type</Label>
          <Select
            value={chartConfig.chartType}
            onValueChange={(value: ChartType) => setChartType(value)}
          >
            <SelectTrigger id="chart-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="stacked-bar">Stacked Bar Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orientation (only for bar charts) */}
        {chartConfig.chartType !== 'pie' && (
          <div className="space-y-3">
            <Label>Orientation</Label>
            <RadioGroup
              value={chartConfig.orientation}
              onValueChange={(value: ChartOrientation) => setOrientation(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vertical" id="vertical" />
                <Label htmlFor="vertical" className="font-normal cursor-pointer">
                  Vertical
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="horizontal" id="horizontal" />
                <Label htmlFor="horizontal" className="font-normal cursor-pointer">
                  Horizontal
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Color Theme */}
        <div className="space-y-3">
          <Label>Color Theme</Label>
          <RadioGroup
            value={chartConfig.colorTheme}
            onValueChange={(value: ColorTheme) => setColorTheme(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="default-theme" />
              <Label htmlFor="default-theme" className="font-normal cursor-pointer">
                Default (Professional Palette)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom-theme" />
              <Label htmlFor="custom-theme" className="font-normal cursor-pointer">
                Custom Colors
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Custom Color Picker */}
        <ColorPicker />
      </CardContent>
    </Card>
  );
}
