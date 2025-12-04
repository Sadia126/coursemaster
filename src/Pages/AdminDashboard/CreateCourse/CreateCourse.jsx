import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axiosPublic from "../../../utils/axiosPublic";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [modules, setModules] = useState([{ title: "", content: "" }]);
  const [loading, setLoading] = useState(false);

  const handleModuleChange = (index, field, value) => {
    const newModules = [...modules];
    newModules[index][field] = value;
    setModules(newModules);
  };

  const addModule = () => setModules([...modules, { title: "", content: "" }]);
  const removeModule = (index) =>
    setModules(modules.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || modules.length === 0)
      return toast.error("Please fill all required fields");

    try {
      setLoading(true);
      const res = await axiosPublic.post("/api/courses", {
        title,
        description,
        instructor,
        syllabus,
        price: parseFloat(price),
        category,
        tags: tags.split(",").map((t) => t.trim()),
        modules,
      });
      toast.success(res.data.message);

      // Reset form
      setTitle("");
      setDescription("");
      setInstructor("");
      setSyllabus("");
      setPrice("");
      setCategory("");
      setTags("");
      setModules([{ title: "", content: "" }]);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Course Title *</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Course Description</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Instructor</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Syllabus</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={syllabus}
            onChange={(e) => setSyllabus(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Price (USD)</label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Category</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Modules</h3>
          {modules.map((mod, index) => (
            <div key={index} className="border p-4 rounded space-y-2 relative">
              <button
                type="button"
                onClick={() => removeModule(index)}
                className="btn btn-xs btn-error absolute top-2 right-2"
              >
                Remove
              </button>
              <input
                type="text"
                placeholder="Module Title"
                className="input input-bordered w-full"
                value={mod.title}
                onChange={(e) =>
                  handleModuleChange(index, "title", e.target.value)
                }
                required
              />
              <textarea
                placeholder="Module Content"
                className="textarea textarea-bordered w-full"
                value={mod.content}
                onChange={(e) =>
                  handleModuleChange(index, "content", e.target.value)
                }
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addModule}
            className="btn btn-md text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba]"
          >
            Add Module
          </button>
        </div>

        <button
          type="submit"
          className={`btn text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] mt-4 ${
            loading ? "loading" : ""
          }`}
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
