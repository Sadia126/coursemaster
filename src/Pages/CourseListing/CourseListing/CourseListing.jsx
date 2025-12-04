import React, { useEffect, useState } from "react";
import axiosPublic from "../../../utils/axiosPublic";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loading from "../../../shared/Loading/Loading";

const CourseListing = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(6); // items per page
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(""); // "price_asc" or "price_desc"
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        search,
        sort,
        category: categoryFilter,
        tags: tagsFilter,
      };
      const { data } = await axiosPublic.get("/api/courses", { params });
      setCourses(data.courses);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, [page, search, sort, categoryFilter, tagsFilter]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Available Courses</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or instructor"
          className="input input-bordered flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select select-bordered"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort by Price</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        <input
          type="text"
          placeholder="Filter by category"
          className="input input-bordered"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter by tags (comma-separated)"
          className="input input-bordered"
          value={tagsFilter}
          onChange={(e) => setTagsFilter(e.target.value)}
        />
      </div>

      {/* Courses Grid */}
      {loading ? (
        <Loading></Loading>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 duration-300 flex flex-col overflow-hidden"
            >
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-48 w-full object-cover rounded-t-xl"
                />
              )}

              {/* Course Info */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-2xl font-bold mb-2 line-clamp-1">
                  {course.title}
                </h3>

                <p className="text-gray-800 font-semibold mb-1">
                  Instructor: {course.instructor}
                </p>
                <p className="text-gray-800 font-semibold mb-3">
                  Price: ${course.price}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {course.category && (
                    <span className="badge badge-outline badge-primary">
                      {course.category}
                    </span>
                  )}
                  {(course.tags || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className="badge badge-outline badge-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="btn mt-auto text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] hover:scale-105 transition transform"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          className="btn btn-sm text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba]"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="flex items-center px-2">
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-sm text-white bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba]"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseListing;
