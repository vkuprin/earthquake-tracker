'use client';

import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';

const GET_EARTHQUAKES = gql`
  query GetEarthquakes(
    $filter: EarthquakeFilter
    $pagination: PaginationInput
  ) {
    earthquakes(filter: $filter, pagination: $pagination) {
      edges {
        id
        location
        magnitude
        date
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalCount
      }
    }
  }
`;

interface EarthquakeListProps {
  filters: {
    minMagnitude: number;
    maxMagnitude: number;
    fromDate: string;
    toDate: string;
    location: string;
  };
}

export function EarthquakeList({ filters }: EarthquakeListProps) {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { loading, error, data } = useQuery(GET_EARTHQUAKES, {
    variables: {
      filter: filters,
      pagination: {
        skip: page * pageSize,
        take: pageSize,
      },
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Magnitude</th>
              <th className="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.earthquakes.edges.map((earthquake: any) => (
              <tr key={earthquake.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{earthquake.location}</td>
                <td className="px-6 py-4">{earthquake.magnitude.toFixed(1)}</td>
                <td className="px-6 py-4">
                  {new Date(earthquake.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>
          Page {page + 1} of{' '}
          {Math.ceil(data.earthquakes.pageInfo.totalCount / pageSize)}
        </span>
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={!data.earthquakes.pageInfo.hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}
