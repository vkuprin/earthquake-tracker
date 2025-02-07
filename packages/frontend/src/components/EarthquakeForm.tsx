'use client';

import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import type {
  Earthquake,
  FormData,
  EarthquakeMutationResponse,
  UpdateEarthquakeMutationResponse,
} from '@/lib/types';

const CREATE_EARTHQUAKE = gql`
  mutation CreateEarthquake($input: EarthquakeInput!) {
    createEarthquake(input: $input) {
      id
      location
      magnitude
      date
    }
  }
`;

const UPDATE_EARTHQUAKE = gql`
  mutation UpdateEarthquake($id: ID!, $input: UpdateEarthquakeInput!) {
    updateEarthquake(id: $id, input: $input) {
      id
      location
      magnitude
      date
    }
  }
`;

interface EarthquakeFormProps {
  earthquake?: Earthquake;
  onClose: () => void;
  onSuccess: () => void;
}

export const EarthquakeForm = ({
  earthquake,
  onClose,
  onSuccess,
}: EarthquakeFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    location: earthquake?.location || '',
    magnitude: earthquake?.magnitude || 0,
    date: earthquake?.date
      ? new Date(earthquake.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  });

  const [error, setError] = useState<string>('');

  const [createEarthquake] = useMutation<EarthquakeMutationResponse>(
    CREATE_EARTHQUAKE,
    {
      onCompleted: () => {
        onSuccess();
        onClose();
      },
      onError: (error) => {
        setError(error.message);
      },
    }
  );

  const [updateEarthquake] = useMutation<UpdateEarthquakeMutationResponse>(
    UPDATE_EARTHQUAKE,
    {
      onCompleted: () => {
        onSuccess();
        onClose();
      },
      onError: (error) => {
        setError(error.message);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (earthquake?.id) {
        await updateEarthquake({
          variables: {
            id: earthquake.id,
            input: formData,
          },
        });
      } else {
        await createEarthquake({
          variables: {
            input: formData,
          },
        });
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Magnitude</label>
        <input
          type="number"
          value={formData.magnitude}
          onChange={(e) =>
            setFormData({ ...formData, magnitude: parseFloat(e.target.value) })
          }
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          step="0.1"
          min="0"
          max="10"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {earthquake ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};
