'use client';

interface FilterPanelProps {
  filters: {
    minMagnitude: number;
    maxMagnitude: number;
    fromDate: string;
    toDate: string;
    location: string;
  };
  onFilterChange: (filters: {
    minMagnitude: number;
    maxMagnitude: number;
    fromDate: string;
    toDate: string;
    location: string;
  }) => void;
  // onClearFilters: () => void;
}

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Minimum Magnitude
          </label>
          <input
            type="number"
            value={filters.minMagnitude}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                minMagnitude: parseFloat(e.target.value),
              })
            }
            className="w-full p-2 border rounded"
            min="0"
            max="10"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Maximum Magnitude
          </label>
          <input
            type="number"
            value={filters.maxMagnitude}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                maxMagnitude: parseFloat(e.target.value),
              })
            }
            className="w-full p-2 border rounded"
            min="0"
            max="10"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">From Date</label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                fromDate: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">To Date</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                toDate: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Location Search
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                location: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
            placeholder="Search location..."
          />
        </div>
      </div>
    </div>
  );
}
