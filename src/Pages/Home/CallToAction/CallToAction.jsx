import React from "react";
import bannerImg from "../../../assets/download.jpeg";

const CallToAction = () => {
  return (
    <section
      className="relative py-20 my-10 text-white text-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bannerImg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
           Level Up Your Skills 🚀
        </h2>
        <p className="text-base md:text-lg mb-8 text-gray-200">
          Enroll in top courses, track your progress, and achieve your learning goals with CourseMaster.
        </p>
        <a
          href="register"
          className="inline-block bg-[#0fb894] hover:bg-[#0ca383] text-white font-semibold rounded-xl px-8 py-4 transition"
        >
          Get Started
        </a>
      </div>
    </section>
  );
};

export default CallToAction;
