import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import axiosPublic from "../../../utils/axiosPublic";
import Loading from "../../../shared/Loading/Loading";

const EnrolledCourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0); // default first module

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const { data } = await axiosPublic.get(`/api/courses/${id}`);
      const userData = await axiosPublic.get("/api/me");

      const purchasedCourse = userData.data.user.purchasedCourses.find(
        (c) => c._id === id || c.courseId === id
      );

      setCourse({
        ...data.course,
        completedModules: purchasedCourse?.completedModules || [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    // handle YouTube links
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/
    );
    if (ytMatch && ytMatch[1])
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    // handle Vimeo links (optional)
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch && vimeoMatch[1])
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url; // fallback
  };

  useEffect(() => {
    if (user) fetchCourse();
  }, [user]);

  const handleCompleteModule = async (moduleIndex) => {
    try {
      await axiosPublic.patch(`/api/users/${user.email}/completeModule`, {
        courseId: id,
        moduleIndex,
      });

      setCourse((prev) => ({
        ...prev,
        completedModules: [...prev.completedModules, moduleIndex],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !course) return <Loading />;

  const selectedModule = course.modules[selectedModuleIndex];
  const progress =
    Math.floor(
      (course.completedModules.length / course.modules.length) * 100
    ) || 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="mb-4 text-gray-600">Instructor: {course.instructor}</p>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-right text-gray-500 font-semibold mb-6">
        {progress}% Completed
      </p>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Left side: Video player */}
        <div className="flex-1 bg-gray-50 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{selectedModule.title}</h2>
          {selectedModule.content ? (
            <iframe
              width="100%"
              height="400"
              src={getEmbedUrl(selectedModule.content)}
              title={selectedModule.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <p>No video available for this module.</p>
          )}

          {!course.completedModules.includes(selectedModuleIndex) && (
            <button
              className="btn bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] text-white mt-4"
              onClick={() => handleCompleteModule(selectedModuleIndex)}
            >
              Mark as Completed
            </button>
          )}
          {course.completedModules.includes(selectedModuleIndex) && (
            <span className="text-green-600 font-semibold mt-4 block">
              Done
            </span>
          )}
        </div>

        {/* Right side: Module sidebar */}
        <div className="w-64 bg-white p-4 rounded shadow overflow-y-auto max-h-[500px]">
          <h3 className="font-semibold mb-4">Modules</h3>
          <ul className="space-y-2">
            {course.modules.map((mod, idx) => {
              const completed = course.completedModules.includes(idx);
              return (
                <li
                  key={idx}
                  className={`p-2 rounded cursor-pointer ${
                    selectedModuleIndex === idx
                      ? "bg-blue-100 font-semibold"
                      : completed
                      ? "bg-green-100"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedModuleIndex(idx)}
                >
                  {mod.title}
                  {completed && (
                    <span className="ml-2 text-green-600 font-semibold">✔</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseDetails;
