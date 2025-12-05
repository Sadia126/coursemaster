/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import axiosPublic from "../../../utils/axiosPublic";


const EnrollmentManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch all courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosPublic.get("/api/courses");
        setCourses(res.data.courses);

        // Optional: auto-select first course
        if (res.data.courses.length > 0) {
          setSelectedCourse(res.data.courses[0]);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch students when a course is selected
  useEffect(() => {
    if (!selectedCourse) {
      setStudents([]);
      setFiltered([]);
      return;
    }

    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await axiosPublic.get(
          `/api/courses/${selectedCourse._id}/students`
        );
        setStudents(res.data.students);
        setFiltered(res.data.students);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [selectedCourse]);

  // Search filter
  useEffect(() => {
    const result = students.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, students]);

  const handleCourseChange = (e) => {
    const course = courses.find((c) => c._id === e.target.value);
    setSelectedCourse(course || null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f5ff] to-[#e6ebff] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Enrollment Management
            </h1>
            <p className="text-gray-500">
              Select a course to view enrolled students.
            </p>
          </div>

          {/* Course Selector */}
          {loadingCourses ? (
            <div className="text-gray-500">Loading courses...</div>
          ) : (
            <select
              className="border p-2 rounded-lg"
              value={selectedCourse?._id || ""}
              onChange={handleCourseChange}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Student Count */}
        {selectedCourse && (
          <div className="flex items-center gap-3 bg-blue-100 px-4 py-2 rounded-lg mb-6 w-fit">
            <LuUsers className="text-blue-600" />
            <span className="font-semibold text-blue-700 text-lg">
              {filtered.length} Students
            </span>
          </div>
        )}

        {/* Search Box */}
        {selectedCourse && (
          <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex items-center gap-3">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search students by name..."
              className="w-full outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* Students Grid */}
        {loadingStudents ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="h-40 bg-gray-200 animate-pulse rounded-xl"
                ></div>
              ))}
          </div>
        ) : selectedCourse && filtered.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-20">
            No students found for this course.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((student) => (
              <div
                key={student._id}
                className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition-all"
              >
                <img
                  src={student.avatar || "https://i.ibb.co/0j1PQkR/user.png"}
                  alt={student.name}
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {student.name}
                  </h2>
                  <p className="text-gray-600 text-sm">{student.email}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Phone: {student.phone || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentManagement;
