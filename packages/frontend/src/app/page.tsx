'use client';

import { EarthquakeList } from '@/components/EarthquakeList';
import { FilterPanel } from '@/components/FilterPanel';
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
    <main className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Earthquake Tracker
        </h1>

        {/*<div className="mb-8">*/}
        {/*  <DashboardStats />*/}
        {/*</div>*/}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-80">
            <FilterPanel filters={filters} onFilterChange={setFilters} />
          </div>

          <div className="flex-grow">
            <EarthquakeList filters={filters} />
          </div>
        </div>
      </div>
    </main>
  );
}
