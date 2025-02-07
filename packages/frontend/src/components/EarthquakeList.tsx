'use client';

import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Modal } from './Modal';
import { EarthquakeForm } from './EarthquakeForm';
import { Earthquake, EarthquakesResponse, FilterState } from '@/lib/types';

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
  filters: FilterState;
}

export const EarthquakeList = ({ filters }: EarthquakeListProps) => {
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEarthquake, setSelectedEarthquake] = useState<
    Earthquake | undefined
  >();
  const pageSize = 10;

  const { loading, error, data, refetch } = useQuery<EarthquakesResponse>(
    GET_EARTHQUAKES,
    {
      variables: {
        filter: filters,
        pagination: {
          skip: page * pageSize,
          take: pageSize,
        },
      },
    }
  );

  const handleOpenModal = (earthquake?: Earthquake) => {
    setSelectedEarthquake(earthquake);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEarthquake(undefined);
    setIsModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold text-gray-900">Earthquakes</h2>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Earthquake
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Magnitude
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.earthquakes.edges.map((earthquake) => (
                <tr key={earthquake.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {earthquake.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {earthquake.magnitude.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(earthquake.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleOpenModal(earthquake)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page + 1} of{' '}
            {Math.ceil(data?.earthquakes.pageInfo.totalCount || 0 / pageSize)}
          </span>
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={!data?.earthquakes.pageInfo.hasNextPage}
          >
            Next
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedEarthquake ? 'Edit Earthquake' : 'Add New Earthquake'}
      >
        <EarthquakeForm
          earthquake={selectedEarthquake}
          onClose={handleCloseModal}
          onSuccess={() => {
            refetch();
          }}
        />
      </Modal>
    </>
  );
};
