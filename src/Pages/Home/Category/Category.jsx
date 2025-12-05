import React from "react";
import { Book, Code, Globe, Music } from "lucide-react";
import SectionTitle from "../../../shared/SectionTitle/SectionTitle";

const Category = () => {
  const categories = [
    { icon: <Book size={36} className="text-indigo-600 mb-3" />, name: "Business" },
    { icon: <Code size={36} className="text-green-600 mb-3" />, name: "Programming" },
    { icon: <Globe size={36} className="text-red-600 mb-3" />, name: "Languages" },
    { icon: <Music size={36} className="text-yellow-500 mb-3" />, name: "Arts & Music" },
  ];

  return (
    <section className="my-12 mx-auto px-6">
      <SectionTitle title={"Explore Course Categories"} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-2xl hover:shadow-xl hover:scale-105 transition cursor-pointer"
          >
            {cat.icon}
            <p className="font-semibold text-center">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;
