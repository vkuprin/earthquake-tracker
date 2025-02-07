'use client';

import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Modal } from './Modal';
import { EarthquakeForm } from './EarthquakeForm';
import { EarthquakesResponse, Earthquake, FilterState } from '@/lib/types';

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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Earthquakes</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add New Earthquake
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Magnitude</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.earthquakes.edges.map((earthquake) => (
              <tr key={earthquake.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{earthquake.location}</td>
                <td className="px-6 py-4">{earthquake.magnitude.toFixed(1)}</td>
                <td className="px-6 py-4">
                  {new Date(earthquake.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleOpenModal(earthquake)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
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
          {Math.ceil(data?.earthquakes.pageInfo.totalCount || 0 / pageSize)}
        </span>
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={!data?.earthquakes.pageInfo.hasNextPage}
        >
          Next
        </button>
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
    </div>
  );
};
