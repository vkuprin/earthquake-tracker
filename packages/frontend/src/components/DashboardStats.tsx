'use client';

import { gql, useQuery } from '@apollo/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

const GET_EARTHQUAKE_STATS = gql`
  query GetEarthquakes($filter: EarthquakeFilter) {
    earthquakes(filter: $filter) {
      edges {
        id
        magnitude
        date
        location
      }
      pageInfo {
        totalCount
      }
    }
  }
`;

export function DashboardStats() {
  const { loading, error, data } = useQuery(GET_EARTHQUAKE_STATS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const earthquakes = data.earthquakes.edges;

  const magnitudeRanges: { [key: number]: number } = {};
  earthquakes.forEach((eq: any) => {
    const range = Math.floor(eq.magnitude);
    magnitudeRanges[range] = (magnitudeRanges[range] || 0) + 1;
  });

  const distributionData = Object.entries(magnitudeRanges).map(
    ([range, count]) => ({
      range: `${range}-${Number(range) + 1}`,
      count,
    })
  );

  const timeSeriesData = [...earthquakes]
    .sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    .map((eq: any) => ({
      date: new Date(eq.date).toLocaleDateString(),
      magnitude: eq.magnitude,
    }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Magnitude Distribution</h2>
        <div className="w-full h-[300px]">
          <BarChart width={600} height={300} data={distributionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Number of Earthquakes" />
          </BarChart>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Magnitude Over Time</h2>
        <div className="w-full h-[300px]">
          <LineChart width={600} height={300} data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="magnitude"
              stroke="#82ca9d"
              name="Magnitude"
            />
          </LineChart>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Earthquakes</h3>
          <p className="text-3xl font-bold text-blue-600">
            {data.earthquakes.pageInfo.totalCount}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Average Magnitude</h3>
          <p className="text-3xl font-bold text-green-600">
            {(
              earthquakes.reduce(
                (acc: number, eq: any) => acc + eq.magnitude,
                0
              ) / earthquakes.length
            ).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Highest Magnitude</h3>
          <p className="text-3xl font-bold text-red-600">
            {Math.max(...earthquakes.map((eq: any) => eq.magnitude)).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
