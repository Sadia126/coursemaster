import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import axiosPublic from "../../../utils/axiosPublic";
import Loading from "../../../shared/Loading/Loading";
import { useNavigate } from "react-router-dom";

const EnrolledCourse = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axiosPublic.get("/api/me");
      const purchasedCourses = data.user.purchasedCourses || [];

      if (purchasedCourses.length === 0) {
        setEnrolledCourses([]);
        return;
      }

      const courses = await Promise.all(
        purchasedCourses.map(async (c) => {
          const res = await axiosPublic.get(`/api/courses/${c.courseId}`);
          const course = res.data.course;
          return {
            ...course,
            completedModules: c.completedModules || [],
          };
        })
      );

      setEnrolledCourses(courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  console.log(enrolledCourses);

  useEffect(() => {
    if (user) fetchEnrolledCourses();
  }, [user]);

  if (loading) return <Loading />;

  if (!enrolledCourses.length)
    return (
      <div className="text-center mt-20 text-xl font-semibold">
        You have not enrolled in any courses yet.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        My Enrolled Courses
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {enrolledCourses.map((course) => {
          // calculate total modules dynamically
          const totalModules =
            course.milestones?.reduce(
              (count, m) => count + (m.modules?.length || 0),
              0
            ) || 0;

          const completed = course.completedModules?.length || 0;

          const progress = totalModules
            ? Math.floor((completed / totalModules) * 100)
            : 0;

          return (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4">
                Instructor: {course.instructor}
              </p>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="h-4 rounded-full bg-blue-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-right text-gray-500 font-semibold mb-4">
                {progress}% Completed
              </p>

              <button
                className="btn bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] text-white w-full"
                onClick={() =>
                  navigate(`/dashboard/enrolled-course/${course._id}`)
                }
              >
                Go to Course Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnrolledCourse;
