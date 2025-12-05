import React from "react";

const Banner = () => {
  return (
    <section className="">
      <div className="container mx-auto flex flex-col items-center text-center px-6 py-32 lg:py-40">
        {/* Headline */}
        <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight animate-fade-in">
          Empower Your Learning Journey
        </h1>

        {/* Subtext */}
        <p className="text-lg lg:text-2xl mb-8 max-w-2xl animate-fade-in delay-200">
          Explore our courses, submit assignments, and track your progress
          with ease. Learn at your own pace with interactive content.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-400">
          <a
            href="courseListing"
            className="bg-white text-[#1b59ba] font-semibold px-6 py-3 rounded-lg 
            shadow-lg hover:bg-gray-100 transition"
          >
            Browse Courses
          </a>
          <a
            href="register"
            className="border border-white font-semibold px-6 py-3 rounded-lg
             hover:bg-white hover:text-[#1b59ba] transition"
          >
            Get Started
          </a>
        </div>

        {/* Floating shapes */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-white/20 rounded-full blur-2xl animate-float"></div>
      </div>

   
    </section>
  );
};

export default Banner;
