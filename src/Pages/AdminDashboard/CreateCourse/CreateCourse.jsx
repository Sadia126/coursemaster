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
  const [batches, setBatches] = useState([
    { batchName: "", startDate: "", endDate: "" },
  ]);
  const [image, setImage] = useState(null);

  const handleBatchChange = (index, field, value) => {
    const newBatches = [...batches];
    newBatches[index][field] = value;
    setBatches(newBatches);
  };

  const addBatch = () =>
    setBatches([...batches, { batchName: "", startDate: "", endDate: "" }]);

  const removeBatch = (index) =>
    setBatches(batches.filter((_, i) => i !== index));

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

    let imageUrl = "";

    // === Upload image first if selected ===
    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      const uploadRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const imgData = await uploadRes.json();

      if (!imgData.success) {
        toast.error("Image upload failed!");
        return;
      }

      imageUrl = imgData.data.url;
    }

    // === Create Course API call ===
    const res = await axiosPublic.post("/api/courses", {
      title,
      description,
      instructor,
      syllabus,
      price: parseFloat(price),
      category,
      tags: tags.split(",").map((t) => t.trim()),
      modules,
      batches,
      image: imageUrl, 
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
    setBatches([{ batchName: "", startDate: "", endDate: "" }]);
    setImage(null);
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
        <div>
          <h3 className="text-xl font-bold mb-2">Batches</h3>

          {batches.map((batch, index) => (
            <div key={index} className="border p-4 rounded mb-3 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Batch Name</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={batch.batchName}
                    onChange={(e) =>
                      handleBatchChange(index, "batchName", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={batch.startDate}
                    onChange={(e) =>
                      handleBatchChange(index, "startDate", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={batch.endDate}
                    onChange={(e) =>
                      handleBatchChange(index, "endDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <button
                type="button"
                className="btn text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] btn-sm mt-3"
                onClick={() => removeBatch(index)}
              >
                Remove Batch
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] btn-sm"
            onClick={addBatch}
          >
            + Add Batch
          </button>
        </div>
        <div>
          <label className="block font-semibold mb-1">Course Thumbnail</label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
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
