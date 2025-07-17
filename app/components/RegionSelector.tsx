'use client';

import { useState, useEffect } from "react";
import regionData from "@/data/regionData";

type Props = {
  value: { province: string; city: string; district: string };
  onChange: (val: { province: string; city: string; district: string }) => void;
};

export default function RegionSelector({ value, onChange }: Props) {
  const provinces = Object.keys(regionData);
  const cities = value.province ? Object.keys(regionData[value.province]) : [];
  const districts =
    value.province && value.city
      ? regionData[value.province][value.city]
      : [];

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvince = e.target.value;
    onChange({ province: newProvince, city: "", district: "" });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    onChange({ ...value, city: newCity, district: "" });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, district: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">省份</label>
        <select
          className="w-full px-4 py-2 border rounded"
          value={value.province}
          onChange={handleProvinceChange}
        >
          <option value="">请选择省份</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">城市</label>
        <select
          className="w-full px-4 py-2 border rounded"
          value={value.city}
          onChange={handleCityChange}
          disabled={!value.province}
        >
          <option value="">请选择城市</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">区县</label>
        <select
          className="w-full px-4 py-2 border rounded"
          value={value.district}
          onChange={handleDistrictChange}
          disabled={!value.city}
        >
          <option value="">请选择区县</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
