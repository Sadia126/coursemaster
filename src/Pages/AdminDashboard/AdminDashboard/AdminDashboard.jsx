import useAdmin from "../../../hooks/useAdmin";
import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../shared/Loading/Loading";
import { FaUsers } from "react-icons/fa";

const AdminDashboard = () => {
  const [isAdmin, isAdminLoading] = useAdmin();
  const { user } = useAuth();

  if (isAdminLoading) return <Loading />;

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="admin-drawer"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-4  font-bold text-lg">Admin Dashboard</div>
        </nav>

        {/* Page content */}
        <main className="flex-1 p-4">
          <div className="text-2xl text-center font-bold mb-4">Welcome, {user?.name}</div>
          <Outlet />
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>
        <div className="flex min-h-full flex-col bg-base-200 w-64">
          <div className="p-6 text-center font-bold text-xl border-b hover:text-white border-[#638efb]">
            Admin Panel
          </div>
          <ul className="menu w-full grow">
            {isAdmin && (
              <>
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded font-semibold hover:text-white hover:bg-[#638efb] ${
                        isActive ? "bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] text-white" : ""
                      }`
                    }
                  >
                    Admin Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/users"
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-2 px-3 rounded hover:text-white hover:bg-[#638efb] ${
                        isActive ? "bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] text-white" : ""
                      }`
                    }
                  >
                    <FaUsers /> All Users
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/adminDashboard/createCourse"
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-2 px-3 rounded hover:text-white hover:bg-[#638efb] ${
                        isActive ? "bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] text-white" : ""
                      }`
                    }
                  >
                    <FaUsers /> Create Course
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/adminDashboard/EnrollmentManagment"
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-2 px-3 rounded hover:text-white hover:bg-[#638efb] ${
                        isActive ? "bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] text-white" : ""
                      }`
                    }
                  >
                    <FaUsers /> Enrollment Management
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/allRentItems"
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-2 px-3 rounded hover:text-white hover:bg-[#638efb] ${
                        isActive ? "bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] text-white" : ""
                      }`
                    }
                  >
                    <FaUsers /> All Rent Items
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
