import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-hot-toast";
import axiosPublic from "../../utils/axiosPublic";
import useAuth from "../../hooks/useAuth";
import Loading from "../../shared/Loading/Loading";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Check if user already purchased this course
  const isEnrolled = user?.purchasedCourses?.some(
    (course) => course.courseId.toString() === id
  );

  // Fetch course by ID
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await axiosPublic.get(`/api/courses/${id}`);
        setCourse(data.course);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load course");
        navigate("/courseListing");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isEnrolled) {
      toast("You are already enrolled in this course!");
      return;
    }

    try {
      const res = await axiosPublic.post("/api/create-checkout-session", {
        courseId: course._id,
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to start payment");
      }
    } catch (err) {
      console.error("Checkout error", err);
      toast.error(err.response?.data?.message || "Payment error");
    }
  };

  if (loading) return <Loading />;
  if (!course) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Course Header */}
      <div
        className="bg-linear-to-r from-[#638efb] via-[#4f76e5]
       to-[#1b59ba] rounded-xl shadow-lg p-8 text-white"
      >
        <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
        <p className="text-lg">Instructor: {course.instructor}</p>
      </div>

      {/* Course Image */}
      {course.image && (
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-72 object-cover rounded-xl shadow-md"
        />
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-2">Course Description</h2>
            <p className="text-gray-700">{course.description}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-4">Syllabus</h2>
            <p className="text-gray-700">{course.syllabus}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center">
            <p className="text-gray-600 mb-2">Price</p>
            <p className="text-3xl font-bold text-[#4f76e5] mb-4">
              ${course.price}
            </p>
            <button
              onClick={handleEnroll}
              disabled={isEnrolled}
              className={`btn w-full text-white ${
                isEnrolled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] hover:scale-105 transition transform"
              }`}
            >
              {isEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-bold mb-2">Category & Tags</h3>
            <div className="flex flex-wrap gap-2">
              {course.category && (
                <span className="badge badge-outline badge-primary">
                  {course.category}
                </span>
              )}
              {(course.tags || []).map((tag, idx) => (
                <span key={idx} className="badge badge-outline badge-secondary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
