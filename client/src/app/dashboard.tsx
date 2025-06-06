import { testQuery } from '@/api/journal';

const Dashboard = () => {
  const { data, error, isLoading } = testQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!data) {
    return <div>No data available</div>;
  }
  return <div className="h-screen">{JSON.stringify(data)}</div>;
};

export default Dashboard;
