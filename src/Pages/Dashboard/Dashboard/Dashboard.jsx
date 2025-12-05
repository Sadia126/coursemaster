import { Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../shared/Loading/Loading";
import Navbar from "../../../shared/Navbar/Navbar";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar></Navbar>

      {/* Page content */}
      <main className="flex-1 p-6 bg-base-100">
        
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
