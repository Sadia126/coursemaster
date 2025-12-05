import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosPublic from "../../../utils/axiosPublic";
import Loading from "../../../shared/Loading/Loading";

const SubmittedAssignmentsAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [marks, setMarks] = useState({});
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    const fetchAllCourses = async () => {
      setLoading(true);
      try {
        const res = await axiosPublic.get("/api/assignments/all-courses");
        setCourses(res.data.courses || []);

        const initialMarks = {};
        const initialFeedback = {};
        res.data.courses?.forEach((course) => {
          course.submissions.forEach((s) => {
            const key = `${course.courseId}_${s.milestoneIndex}_${s.moduleIndex}_${s.studentEmail}`;
            initialMarks[key] = s.mark || 0;
            initialFeedback[key] = s.feedback || "";
          });
        });
        setMarks(initialMarks);
        setFeedback(initialFeedback);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch courses and submissions");
      }
      setLoading(false);
    };

    fetchAllCourses();
  }, []);

  const handleMarkChange = (key, value) =>
    setMarks((prev) => ({ ...prev, [key]: Number(value) }));
  const handleFeedbackChange = (key, value) =>
    setFeedback((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (submission) => {
    const key = `${submission.courseId}_${submission.milestoneIndex}_${submission.moduleIndex}_${submission.studentEmail}`;
    try {
      await axiosPublic.patch(
        `/api/users/${submission.studentEmail}/assignment-mark`,
        {
          courseId: submission.courseId,
          milestoneIndex: submission.milestoneIndex,
          moduleIndex: submission.moduleIndex,
          mark: marks[key],
        }
      );
      toast.success("Mark updated successfully");
      setSelectedSubmission(null); // close modal
    } catch (err) {
      console.error(err);
      toast.error("Failed to update submission");
    }
  };

  if (loading) return <Loading></Loading>;
  if (courses.length === 0)
    return <div className="text-center mt-10">No courses found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">All Courses Submissions</h2>

      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Course</th>
           
            <th className="border p-2">Email</th>
            <th className="border p-2">Milestone</th>
            <th className="border p-2">Module</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) =>
            course.submissions.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50">
                <td className="border p-2">{course.courseTitle}</td>
               
                <td className="border p-2">{s.studentEmail}</td>
                <td className="border p-2">{s.milestoneIndex}</td>
                <td className="border p-2">{s.moduleIndex}</td>
                <td className="border p-2">
                  <button
                    className="text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba]  px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() =>
                      setSelectedSubmission({ ...s, courseId: course.courseId })
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-[#638efb1f] bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedSubmission(null)}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-2">
              {selectedSubmission.studentName}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {selectedSubmission.studentEmail}
            </p>
            <p className="mb-4">{selectedSubmission.submissionText}</p>

            <div className="flex flex-col gap-3">
              <input
                type="number"
                min={0}
                max={100}
                placeholder="Mark"
                value={
                  marks[
                    `${selectedSubmission.courseId}_${selectedSubmission.milestoneIndex}_${selectedSubmission.moduleIndex}_${selectedSubmission.studentEmail}`
                  ] || 0
                }
                onChange={(e) =>
                  handleMarkChange(
                    `${selectedSubmission.courseId}_${selectedSubmission.milestoneIndex}_${selectedSubmission.moduleIndex}_${selectedSubmission.studentEmail}`,
                    e.target.value
                  )
                }
                className="border p-2 rounded w-full"
              />
              <textarea
                placeholder="Feedback"
                value={
                  feedback[
                    `${selectedSubmission.courseId}_${selectedSubmission.milestoneIndex}_${selectedSubmission.moduleIndex}_${selectedSubmission.studentEmail}`
                  ] || ""
                }
                onChange={(e) =>
                  handleFeedbackChange(
                    `${selectedSubmission.courseId}_${selectedSubmission.milestoneIndex}_${selectedSubmission.moduleIndex}_${selectedSubmission.studentEmail}`,
                    e.target.value
                  )
                }
                className="border p-2 rounded w-full"
              />
              <button
                onClick={() => handleSave(selectedSubmission)}
                className="text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba]   px-3 py-1 rounded "
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmittedAssignmentsAdmin;
