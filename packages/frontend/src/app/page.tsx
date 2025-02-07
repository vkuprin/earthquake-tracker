'use client';

import { EarthquakeList } from '@/components/EarthquakeList';
import { FilterPanel } from '@/components/FilterPanel';
import { DashboardStats } from '@/components/DashboardStats';
import { useState } from 'react';

export default function HomePage() {
  const [filters, setFilters] = useState({
    minMagnitude: 0,
    maxMagnitude: 10,
    fromDate: '',
    toDate: '',
    location: '',
  });

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Earthquake Tracker</h1>

      <div className="mb-8">
        <DashboardStats />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterPanel filters={filters} onFilterChange={setFilters} />
        </div>
        <div className="lg:col-span-3">
          <EarthquakeList filters={filters} />
        </div>
      </div>
    </main>
  );
}
