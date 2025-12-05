import React, { useEffect, useState } from "react";
import SectionTitle from "../../../shared/SectionTitle/SectionTitle";

// Sample reviews for CourseMaster
const reviews = [
  {
    id: 1,
    name: "Rasel Ahamed",
    role: "Student",
    text: "CourseMaster helped me complete my web development course smoothly. The platform is very user-friendly!",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Awlad Hossin",
    role: "Student",
    text: "I loved the progress tracking and interactive assignments. It made learning structured and fun!",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Sadia Khatun",
    role: "Student",
    text: "The course materials are comprehensive, and the quizzes help reinforce what I learned.",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: 4,
    name: "Mehedi Hasan",
    role: "Student",
    text: "Submitting assignments and tracking grades is seamless. I can focus entirely on learning.",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
];

const Review = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 1 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? reviews.length - itemsPerPage : prev - itemsPerPage
    );
  };

  const nextSlide = () => {
    setActiveIndex((prev) =>
      prev + itemsPerPage >= reviews.length ? 0 : prev + itemsPerPage
    );
  };

  const currentReviews = reviews.slice(activeIndex, activeIndex + itemsPerPage);

  return (
    <section className="py-16 bg-gray-50">
      <SectionTitle title="What Our Students Say" />

      <div className="flex justify-center gap-6 mt-10 overflow-hidden relative">
        {currentReviews.map((review) => (
          <div
            key={review.id}
            className="p-6 bg-white rounded-2xl shadow-md flex-1 min-w-[250px] transition-transform duration-500"
          >
            <p className="text-gray-800 mb-4">&ldquo;{review.text}&rdquo;</p>
            <div className="flex items-center gap-4 mt-4">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#638efb]"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{review.name}</h4>
                <p className="text-sm text-gray-500">{review.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={prevSlide}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-[#638efb] bg-white hover:bg-[#638efb] hover:text-white transition"
        >
          ←
        </button>

        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(reviews.length / itemsPerPage) }).map(
            (_, i) => (
              <span
                key={i}
                onClick={() => setActiveIndex(i * itemsPerPage)}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${
                  activeIndex / itemsPerPage === i
                    ? "bg-[#638efb]"
                    : "bg-gray-300"
                }`}
              ></span>
            )
          )}
        </div>

        <button
          onClick={nextSlide}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-[#638efb] bg-white hover:bg-[#638efb] hover:text-white transition"
        >
          →
        </button>
      </div>
    </section>
  );
};

export default Review;
