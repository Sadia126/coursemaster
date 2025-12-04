/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import registerAnimation from "../../assets/Login.json";
import Lottie from "lottie-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, password, confirmPassword, avatar } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // Upload avatar to imgbb
      let avatarUrl = "";
      if (avatar) {
        const imageData = new FormData();
        imageData.append("image", avatar);
        const imgbbRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMGBB_KEY
          }`,
          imageData
        );
        avatarUrl = imgbbRes.data.data.url;
      }

      const userData = {
        name,
        email,
        phone,
        passwordHash: password,
        avatarUrl,
        roles: "user",
        status: "active",
        createdAt: new Date().toISOString(),
      };

      const res = await register(userData);

      if (res?.status === 200 || res?.status === 201) {
        toast.success("Registration successful!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          avatar: null,
        });
        navigate("/login");
      }
    } catch (err) {
      toast.error("Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-0">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center rounded-2xl p-6 md:p-12">
        <div>
          <Lottie animationData={registerAnimation} loop />
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-6 shadow rounded-lg space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-[#638efb]">
            Register To Course Master
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={formData.name}
            required
            className="input input-bordered w-full"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
            className="input input-bordered w-full"
          />
          <input
            type="number"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            value={formData.phone}
            required
            className="input input-bordered w-full"
          />

          <input
            type="file"
            name="avatar"
            onChange={handleChange}
            accept="image/*"
            className="file-input file-input-bordered w-full"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            required
            className="input input-bordered w-full"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            value={formData.confirmPassword}
            required
            className="input input-bordered w-full"
          />

          <button
            type="submit"
            className="btn py-2 cursor-pointer text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] outline-none border-none w-full"
          >
            Register
          </button>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link className="text-[#638efb] font-bold" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
