/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import axiosPublic from "../../../utils/axiosPublic";
import Loading from "../../../shared/Loading/Loading";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import toast from "react-hot-toast";

const EnrolledCourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openMilestone, setOpenMilestone] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  const [assignmentText, setAssignmentText] = useState("");
  const [assignmentSubmitting, setAssignmentSubmitting] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);

  const [mcqAnswers, setMcqAnswers] = useState({});
  const [mcqSubmitted, setMcqSubmitted] = useState(false);
  const [mcqResults, setMcqResults] = useState([]);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoreSummary, setScoreSummary] = useState({ correct: 0, total: 0 });

  // Fetch course + user data
  const fetchCourse = async () => {
    try {
      setLoading(true);
      const { data } = await axiosPublic.get(`/api/courses/${id}`);
      const me = await axiosPublic.get("/api/me");

      const userMcqResults = me.data.user?.mcqResults || [];
      const userAssignments = me.data.user?.assignmentSubmissions || [];

      setCourse({
        ...data.course,
        userMcqResults,
        userAssignments,
      });
    } catch (err) {
      console.error("Fetch course error:", err);
      toast.error("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCourse();
  }, [user]);

  // Flatten modules helper
  const flattenModules = (milestones) => {
    if (!milestones) return [];
    const flat = [];
    milestones.forEach((ms, mi) => {
      (ms.modules || []).forEach((mod, zi) => {
        flat.push({ ...mod, milestoneIndex: mi, moduleIndex: zi });
      });
    });
    return flat.map((m, i) => ({ ...m, globalIndex: i }));
  };

  // Open module
  const openModule = async (milestoneIndex, moduleIndex) => {
    if (!course) return;
    const mod = course.milestones?.[milestoneIndex]?.modules?.[moduleIndex];
    if (!mod) return;

    const flat = flattenModules(course.milestones);
    const globalIndex = flat.findIndex(
      (f) => f.milestoneIndex === milestoneIndex && f.moduleIndex === moduleIndex
    );

    const moduleWithIndex = {
      ...mod,
      milestoneIndex,
      moduleIndex,
      globalIndex,
    };

    setSelectedModule(moduleWithIndex);
    setMcqAnswers({});
    setMcqSubmitted(false);
    setMcqResults([]);
    setScoreSummary({ correct: 0, total: 0 });
    setShowScoreModal(false);
    setExistingSubmission(null);
    setAssignmentText("");

    if (moduleWithIndex.moduleType === "assignment") {
      try {
        const res = await axiosPublic.get("/api/assignments/submission", {
          params: { courseId: id, milestoneIndex, moduleIndex },
        });
        if (res.data.submission) {
          setExistingSubmission(res.data.submission);
          setAssignmentText(res.data.submission.submissionText || "");
        }
      } catch (err) {
        console.warn("assignment fetch err:", err?.response?.data || err);
      }
    }
  };

  // Embed video URL
  const getEmbedUrl = (url) => {
    if (!url) return "";
    try {
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1].split(/[?&]/)[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes("watch?v=")) {
        const videoId = url.split("watch?v=")[1].split(/[?&]/)[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url;
    } catch (err) {
      return url;
    }
  };

  // Assignment submit
  const submitAssignment = async () => {
    if (!selectedModule) return;
    if (!assignmentText.trim()) {
      toast.error("Please write something before submitting.");
      return;
    }
    setAssignmentSubmitting(true);
    try {
      const payload = {
        courseId: id,
        milestoneIndex: selectedModule.milestoneIndex,
        moduleIndex: selectedModule.moduleIndex,
        submissionText: assignmentText,
      };
      const res = await axiosPublic.post("/api/assignments/submit", payload);
      toast.success("Assignment submitted");

      setExistingSubmission({
        ...payload,
        studentEmail: user.email,
        studentName: user.name,
        submittedAt: new Date().toISOString(),
        submissionId: res.data.submissionId,
      });

      setCourse((prev) => ({
        ...prev,
        userAssignments: [
          ...(prev.userAssignments || []),
          {
            courseId: id,
            milestoneIndex: selectedModule.milestoneIndex,
            moduleIndex: selectedModule.moduleIndex,
            submissionText: assignmentText,
            submittedAt: new Date().toISOString(),
          },
        ],
      }));
    } catch (err) {
      console.error("submit assignment error:", err);
      toast.error(err?.response?.data?.message || "Failed to submit assignment");
    } finally {
      setAssignmentSubmitting(false);
    }
  };

  // MCQ pick option
  const pickMcqOption = (qIndex, optIndex) => {
    if (mcqSubmitted) return;
    setMcqAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  // MCQ submit
  const submitAllMcqs = async () => {
    if (!selectedModule || selectedModule.moduleType !== "mcq") return;
    const questions =
      selectedModule.mcqs ||
      (selectedModule.mcq
        ? Array.isArray(selectedModule.mcq)
          ? selectedModule.mcq
          : [selectedModule.mcq]
        : []);

    if (questions.length === 0) {
      toast.error("No MCQs found in this module.");
      return;
    }

    const results = [];
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const correctIndex =
        typeof q.correctIndex === "number"
          ? q.correctIndex
          : typeof q.answer === "number"
          ? q.answer
          : typeof q.answer === "string" && Array.isArray(q.options)
          ? q.options.findIndex((o) => o === q.answer)
          : undefined;

      const chosen = mcqAnswers[i];
      const isCorrect = chosen !== undefined && chosen === correctIndex;
      results.push({ questionIndex: i, chosen, correctIndex, isCorrect });
      if (isCorrect) correct++;
    }

    setMcqResults(results);
    setMcqSubmitted(true);
    setScoreSummary({ correct, total: questions.length });
    setShowScoreModal(true);

    try {
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        await axiosPublic.post("/api/save-mcq", {
          email: user.email,
          courseId: id,
          moduleIndex: selectedModule.globalIndex,
          questionIndex: r.questionIndex,
          isCorrect: !!r.isCorrect,
        });
      }
      toast.success("MCQ results saved");
      setCourse((prev) => ({
        ...prev,
        userMcqResults: [
          ...(prev.userMcqResults || []),
          { courseId: id, moduleIndex: selectedModule.globalIndex, results },
        ],
      }));
    } catch (err) {
      console.error("save mcq error:", err);
      toast.error("Failed to save MCQ results (results shown locally)");
    }
  };

  if (loading || !course) return <Loading />;

  const flatModules = flattenModules(course.milestones);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-600 mb-6">Instructor: {course.instructor}</p>

      <div className="flex gap-6">
        {/* Left content */}
        <div className="flex-1 bg-white p-5 rounded shadow min-h-[300px]">
          {!selectedModule && (
            <p className="text-gray-500">Select a module from the right.</p>
          )}

          {/* VIDEO */}
          {selectedModule?.moduleType === "video" && (
            <>
              <h2 className="text-xl font-semibold mb-2">
                {selectedModule.title}
              </h2>
              <div className="w-full aspect-video mb-3">
                <iframe
                  title={selectedModule.title}
                  src={getEmbedUrl(selectedModule.videoUrl)}
                  width="100%"
                  height="100%"
                  className="rounded w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {selectedModule.description && (
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedModule.description}
                </div>
              )}
            </>
          )}

          {/* TEXT */}
          {selectedModule?.moduleType === "text" && (
            <>
              <h2 className="text-xl font-semibold mb-2">
                {selectedModule.title}
              </h2>
              <div className="p-3 whitespace-pre-wrap">
                {selectedModule.content || selectedModule.text || "No content"}
              </div>
            </>
          )}

          {/* ASSIGNMENT */}
          {selectedModule?.moduleType === "assignment" && (
            <>
              <h2 className="text-xl font-semibold mb-2">
                {selectedModule.title || "Assignment"}
              </h2>

              <div className="mb-3 p-3 bg-gray-50 rounded">
                <strong>Instructions:</strong>
                <div className="mt-2 whitespace-pre-wrap">
                  {selectedModule.assignment ||
                    selectedModule.content ||
                    "No instructions provided."}
                </div>
              </div>

              {existingSubmission ? (
                <div className="mb-3 p-3 bg-green-50 rounded border">
                  <p className="font-semibold text-green-700">You submitted:</p>
                  <div className="mt-2 whitespace-pre-wrap">
                    {existingSubmission.submissionText}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Submitted at:{" "}
                    {new Date(existingSubmission.submittedAt).toLocaleString()}
                  </div>
                </div>
              ) : (
                <>
                  <textarea
                    className="textarea textarea-bordered w-full h-40"
                    placeholder="Write your assignment answer here..."
                    value={assignmentText}
                    onChange={(e) => setAssignmentText(e.target.value)}
                    disabled={assignmentSubmitting}
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      className={`btn text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] ${
                        assignmentSubmitting ? "loading" : ""
                      }`}
                      onClick={submitAssignment}
                      disabled={assignmentSubmitting}
                    >
                      {assignmentSubmitting
                        ? "Submitting..."
                        : "Submit Assignment"}
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => setAssignmentText("")}
                      disabled={assignmentSubmitting}
                    >
                      Clear
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* MCQ */}
          {selectedModule?.moduleType === "mcq" && (
            <>
              <h2 className="text-xl font-semibold mb-2">
                {selectedModule.title || "MCQ"}
              </h2>

              {(() => {
                const questions =
                  selectedModule.mcqs ||
                  (selectedModule.mcq
                    ? Array.isArray(selectedModule.mcq)
                      ? selectedModule.mcq
                      : [selectedModule.mcq]
                    : []);

                if (questions.length === 0)
                  return <p className="text-gray-500">No MCQ found.</p>;

                return (
                  <div className="space-y-4">
                    {questions.map((q, qi) => {
                      const correctIndex =
                        typeof q.correctIndex === "number"
                          ? q.correctIndex
                          : typeof q.answer === "number"
                          ? q.answer
                          : typeof q.answer === "string" &&
                            Array.isArray(q.options)
                          ? q.options.findIndex((o) => o === q.answer)
                          : undefined;

                      const chosen = mcqAnswers[qi];
                      const submitted = mcqSubmitted;
                      const isCorrect = submitted
                        ? mcqResults[qi]?.isCorrect
                        : undefined;

                      return (
                        <div
                          key={qi}
                          className="p-3 border rounded bg-white shadow-sm"
                        >
                          <div className="font-semibold mb-2">{q.question}</div>
                          <div className="space-y-2">
                            {q.options.map((opt, oi) => {
                              let optClass = "p-2 rounded cursor-pointer";
                              if (submitted) {
                                if (oi === correctIndex) {
                                  optClass +=
                                    " bg-green-100 border border-green-300";
                                } else if (oi === chosen && chosen !== correctIndex) {
                                  optClass += " bg-red-100 border border-red-300";
                                } else {
                                  optClass += " bg-gray-50";
                                }
                              } else {
                                if (chosen === oi) optClass += " bg-blue-50";
                                else optClass += " bg-gray-50 hover:bg-gray-100";
                              }
                              return (
                                <div
                                  key={oi}
                                  className={optClass}
                                  onClick={() => pickMcqOption(qi, oi)}
                                >
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      checked={mcqAnswers[qi] === oi}
                                      readOnly
                                      className="mr-2"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex gap-2">
                      <button
                        className="btn text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba]"
                        onClick={submitAllMcqs}
                        disabled={mcqSubmitted}
                      >
                        {mcqSubmitted ? "Submitted" : "Submit MCQs"}
                      </button>
                      <button
                        className="btn btn-ghost"
                        onClick={() => {
                          setMcqAnswers({});
                          setMcqSubmitted(false);
                          setMcqResults([]);
                        }}
                        disabled={mcqSubmitted}
                      >
                        Reset Answers
                      </button>
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {/* Mark as completed */}
          {selectedModule &&
            (selectedModule.moduleType === "video" ||
              selectedModule.moduleType === "text") && (
              <div className="mt-4">
                <button
                  className="btn text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba]"
                  onClick={async () => {
                    try {
                      await axiosPublic.patch(
                        `/api/users/${user.email}/completeModule`,
                        {
                          courseId: id,
                          moduleIndex: selectedModule.globalIndex,
                        }
                      );
                      toast.success("Module marked as complete");

                      setCourse((prev) => ({
                        ...prev,
                        purchasedCourses: (prev.purchasedCourses || []).map((c) => {
                          if (c.courseId === id) {
                            return {
                              ...c,
                              completedModules: [
                                ...(c.completedModules || []),
                                selectedModule.globalIndex,
                              ],
                            };
                          }
                          return c;
                        }),
                      }));
                    } catch (err) {
                      console.error("Mark module complete error:", err);
                      toast.error("Failed to mark module complete");
                    }
                  }}
                >
                  Mark as Completed
                </button>
              </div>
            )}
        </div>

        {/* Right sidebar */}
        <div className="w-80 bg-white p-4 rounded shadow max-h-[70vh] overflow-auto">
          <h3 className="font-semibold mb-3">Course Outline</h3>

          {(course.milestones || []).map((ms, mIndex) => (
            <div key={mIndex} className="mb-3">
              <div
                className="flex justify-between p-2 bg-gray-100 rounded cursor-pointer"
                onClick={() =>
                  setOpenMilestone(openMilestone === mIndex ? null : mIndex)
                }
              >
                <span>{ms.title}</span>
                {openMilestone === mIndex ? <FaAngleUp /> : <FaAngleDown />}
              </div>

              {openMilestone === mIndex && (
                <ul className="pl-3 mt-2 space-y-1">
                  {(ms.modules || []).map((mod, modIndex) => {
                    const globalIndex = flattenModules(course.milestones).findIndex(
                      (f) => f.milestoneIndex === mIndex && f.moduleIndex === modIndex
                    );

                    const prevMcq = course.userMcqResults?.find(
                      (r) => r.courseId === id && r.moduleIndex === globalIndex
                    );
                    const prevAssignment = course.userAssignments?.find(
                      (a) =>
                        a.courseId === id &&
                        Number(a.milestoneIndex) === mIndex &&
                        Number(a.moduleIndex) === modIndex
                    );

                    return (
                      <li
                        key={modIndex}
                        className="p-2 rounded cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                        onClick={() => openModule(mIndex, modIndex)}
                      >
                        <span className="truncate">{mod.title || mod.moduleType}</span>
                        <div className="flex items-center gap-2">
                          {mod.moduleType === "mcq" && prevMcq && (
                            <span className="text-green-600 text-sm">MCQ ✓</span>
                          )}
                          {mod.moduleType === "assignment" && prevAssignment && (
                            <span className="text-green-600 text-sm">Submitted</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseDetails;
