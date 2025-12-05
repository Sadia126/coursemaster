/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axiosPublic from "../../../utils/axiosPublic";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  
  // NEW STRUCTURE: course → milestones → modules
  const [milestones, setMilestones] = useState([
    {
      title: "",
      modules: [
        {
          moduleType: "text",
          title: "",
          content: "",
          videoUrl: "",
          assignment: "",
          mcqs: [],
        },
      ],
    },
  ]);

  const handleMilestoneChange = (index, field, value) => {
    const m = [...milestones];
    m[index][field] = value;
    setMilestones(m);
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: "",
        modules: [
          {
            moduleType: "text",
            title: "",
            content: "",
            videoUrl: "",
            assignment: "",
            mcqs: [],
          },
        ],
      },
    ]);
  };

  const removeMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  // ===== MODULE HANDLERS =====
  const addModule = (mIndex) => {
    const updated = [...milestones];
    updated[mIndex].modules.push({
      moduleType: "text",
      title: "",
      content: "",
      videoUrl: "",
      assignment: "",
      mcqs: [],
    });
    setMilestones(updated);
  };

  const removeModule = (mIndex, moduleIndex) => {
    const updated = [...milestones];
    updated[mIndex].modules = updated[mIndex].modules.filter(
      (_, i) => i !== moduleIndex
    );
    setMilestones(updated);
  };

  const handleModuleChange = (mIndex, moduleIndex, field, value) => {
    const updated = [...milestones];
    updated[mIndex].modules[moduleIndex][field] = value;
    setMilestones(updated);
  };

  const addMCQ = (mIndex, moduleIndex) => {
    const updated = [...milestones];
    updated[mIndex].modules[moduleIndex].mcqs.push({
      question: "",
      options: ["", "", "", ""],
      answer: "",
    });
    setMilestones(updated);
  };

  const handleMCQChange = (mIndex, moduleIndex, qIndex, field, value) => {
    const updated = [...milestones];
    updated[mIndex].modules[moduleIndex].mcqs[qIndex][field] = value;
    setMilestones(updated);
  };

  const handleMCQOptionChange = (
    mIndex,
    moduleIndex,
    qIndex,
    optIndex,
    value
  ) => {
    const updated = [...milestones];
    updated[mIndex].modules[moduleIndex].mcqs[qIndex].options[optIndex] = value;
    setMilestones(updated);
  };

  // =================== SUBMIT COURSE ===================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || milestones.length === 0)
      return toast.error("Please fill all required fields");

    try {
      let imageUrl = "";

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const imgRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMGBB_KEY
          }`,
          { method: "POST", body: formData }
        );
        const imgData = await imgRes.json();
        if (imgData.success) imageUrl = imgData.data.url;
      }

      const { data } = await axiosPublic.post("/api/courses", {
        title,
        description,
        instructor,
        category,
        tags, 
        syllabus,
        price: parseFloat(price),
        image: imageUrl,
        milestones,
      });

      toast.success("Course created successfully!");

      // RESET FORM
      setTitle("");
      setDescription("");
      setSyllabus("");
      setInstructor("");
      setPrice("");
      setCategory("");
      setTags([]);
      setImage(null);
      setMilestones([
        {
          title: "",
          modules: [
            {
              moduleType: "text",
              title: "",
              content: "",
              videoUrl: "",
              assignment: "",
              mcqs: [],
            },
          ],
        },
      ]);
    } catch (err) {
      toast.error("Failed to create course");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6">Create Course</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC DETAILS */}
        <div>
          <label className="font-semibold">Title *</label>
          <input
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="font-semibold">Description</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="font-semibold">Instructor</label>
          <input
            className="input input-bordered w-full"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold">Syllabus</label>
          <input
            className="input input-bordered w-full"
            value={syllabus}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="font-semibold">Category</label>
          <select
            className="select select-bordered w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Web Development">Web Development</option>
            <option value="Problem Solving">Problem Solving</option>
            <option value="Programming Fundamentals">
              Programming Fundamentals
            </option>
            <option value="Data Structures">Data Structures</option>
            <option value="Algorithms">Algorithms</option>
            <option value="App Development">App Development</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Machine Learning">Machine Learning</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Tags (comma separated)</label>
          <input
            className="input input-bordered w-full"
            placeholder="react, javascript, beginner"
            onChange={(e) =>
              setTags(e.target.value.split(",").map((t) => t.trim()))
            }
          />
        </div>

        <div>
          <label className="font-semibold">Price</label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* IMAGE */}
        <div>
          <label className="font-semibold">Thumbnail Image</label>
          <input
            type="file"
            className="file-input w-full"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* MILESTONES */}
        <div>
          <h2 className="text-xl font-bold mb-3">Milestones</h2>

          {milestones.map((m, mIndex) => (
            <div key={mIndex} className="border p-4 rounded mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">Milestone {mIndex + 1}</h3>
                {mIndex !== 0 && (
                  <button
                    onClick={() => removeMilestone(mIndex)}
                    className="btn btn-error btn-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                className="input input-bordered w-full mt-2"
                placeholder="Milestone Title"
                value={m.title}
                onChange={(e) =>
                  handleMilestoneChange(mIndex, "title", e.target.value)
                }
              />

              {/* MODULES INSIDE MILESTONE */}
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Modules</h4>

                {m.modules.map((mod, moduleIndex) => (
                  <div key={moduleIndex} className="p-3 border rounded mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">
                        Module {moduleIndex + 1}
                      </span>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => removeModule(mIndex, moduleIndex)}
                        disabled={m.modules.length === 1}
                      >
                        Remove
                      </button>
                    </div>

                    {/* Module Type */}
                    <select
                      className="select select-bordered w-full"
                      value={mod.moduleType}
                      onChange={(e) =>
                        handleModuleChange(
                          mIndex,
                          moduleIndex,
                          "moduleType",
                          e.target.value
                        )
                      }
                    >
                      <option value="text">Text</option>
                      <option value="video">Video</option>
                      <option value="assignment">Assignment</option>
                      <option value="mcq">MCQ</option>
                    </select>

                    {/* Dynamic Fields */}
                    {mod.moduleType === "text" && (
                      <textarea
                        className="textarea textarea-bordered w-full mt-2"
                        placeholder="Write instructions..."
                        value={mod.content}
                        onChange={(e) =>
                          handleModuleChange(
                            mIndex,
                            moduleIndex,
                            "content",
                            e.target.value
                          )
                        }
                      />
                    )}

                    {mod.moduleType === "video" && (
                      <>
                        <input
                          className="input input-bordered w-full mt-2"
                          placeholder="Module Title"
                          value={mod.title}
                          onChange={(e) =>
                            handleModuleChange(
                              mIndex,
                              moduleIndex,
                              "title",
                              e.target.value
                            )
                          }
                        />
                        <input
                          className="input input-bordered w-full mt-2"
                          placeholder="Video URL"
                          value={mod.videoUrl}
                          onChange={(e) =>
                            handleModuleChange(
                              mIndex,
                              moduleIndex,
                              "videoUrl",
                              e.target.value
                            )
                          }
                        />
                      </>
                    )}

                    {mod.moduleType === "assignment" && (
                      <textarea
                        className="textarea textarea-bordered w-full mt-2"
                        placeholder="Assignment Instructions"
                        value={mod.assignment}
                        onChange={(e) =>
                          handleModuleChange(
                            mIndex,
                            moduleIndex,
                            "assignment",
                            e.target.value
                          )
                        }
                      ></textarea>
                    )}

                    {mod.moduleType === "mcq" && (
                      <div className="mt-2">
                        <button
                          className="btn btn-sm btn-success mb-2"
                          type="button"
                          onClick={() => addMCQ(mIndex, moduleIndex)}
                        >
                          Add MCQ
                        </button>

                        {mod.mcqs.map((q, qIndex) => (
                          <div key={qIndex} className="border p-2 rounded mb-2">
                            <input
                              className="input input-bordered w-full mb-2"
                              placeholder="Question"
                              value={q.question}
                              onChange={(e) =>
                                handleMCQChange(
                                  mIndex,
                                  moduleIndex,
                                  qIndex,
                                  "question",
                                  e.target.value
                                )
                              }
                            />

                            {q.options.map((op, optIndex) => (
                              <input
                                key={optIndex}
                                className="input input-bordered w-full mb-1"
                                placeholder={`Option ${optIndex + 1}`}
                                value={op}
                                onChange={(e) =>
                                  handleMCQOptionChange(
                                    mIndex,
                                    moduleIndex,
                                    qIndex,
                                    optIndex,
                                    e.target.value
                                  )
                                }
                              />
                            ))}

                            <input
                              className="input input-bordered w-full"
                              placeholder="Correct Answer"
                              value={q.answer}
                              onChange={(e) =>
                                handleMCQChange(
                                  mIndex,
                                  moduleIndex,
                                  qIndex,
                                  "answer",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <button
                  className="btn text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] btn-sm mt-2"
                  type="button"
                  onClick={() => addModule(mIndex)}
                >
                  Add Module
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] mt-3"
            onClick={addMilestone}
          >
            Add Milestone
          </button>
        </div>

        <button
          className="btn text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] w-full"
          type="submit"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
