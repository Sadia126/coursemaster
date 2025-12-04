import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/Login.json";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    adminKey: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await login(formData.email, formData.password);

    if (res?.status === 200) {
      toast.success("Login successful!");

      const userRole = res.data?.user?.roles; // "admin" or "student"
      console.log(userRole)
      // --- LOGIN RULES ---
      if (!isAdminLogin) {
        // Student mode → Everyone goes to student dashboard
        navigate("/");
      } else {
        // Admin mode → Only admins can access
        if (userRole === "admin") {
          navigate("/adminDashboard");
        } else {
          toast.error("You are not an admin!");
        }
      }
    }
  } catch (err) {
    toast.error("Invalid email or password");
    console.log(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-0">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center rounded-2xl p-6 md:p-12">
        <div className="hidden md:block">
          <Lottie animationData={loginAnimation} loop />
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-6 shadow rounded-lg space-y-4 bg-base-100"
        >
          <h2 className="text-2xl font-bold text-center text-[#638efb]">
            {isAdminLogin ? "Admin Login" : "Student Login"}
          </h2>

          {/* Toggle */}
          <div className="flex justify-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => setIsAdminLogin(false)}
              className={`px-4 py-2 rounded-lg ${
                !isAdminLogin ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Student
            </button>

            <button
              type="button"
              onClick={() => setIsAdminLogin(true)}
              className={`px-4 py-2 rounded-lg ${
                isAdminLogin ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Admin
            </button>
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            value={formData.email}
            required
            className="input input-bordered w-full"
          />

          {/* Field changes based on login type */}
          {!isAdminLogin ? (
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              required
              className="input input-bordered w-full"
            />
          ) : (
            <input
              type="password"
              name="password"
              placeholder="Admin Secret Key"
              onChange={handleChange}
              value={formData.password}
              required
              className="input input-bordered w-full"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] outline-none border-none w-full"
          >
            {loading
              ? "Logging in..."
              : isAdminLogin
              ? "Login as Admin"
              : "Login"}
          </button>

          <div className="text-center mt-4">
            <p>
              Don’t have an account?{" "}
              <Link to="/register" className="text-[#638efb] font-bold">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
