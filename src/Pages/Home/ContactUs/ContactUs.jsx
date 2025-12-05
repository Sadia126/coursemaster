import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdEmail, MdPhone } from "react-icons/md";
import SectionTitle from "../../../shared/SectionTitle/SectionTitle";


const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("access_key", import.meta.env.VITE_WEB3_ACCESS_KEY);
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("message", formData.message);
    form.append("subject", `New Message from ${formData.name}`);
    form.append("custom_note", "This email was sent from Rentra 🚀");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Submission failed.");
    }
  };

  return (
    <section className="py-20 px-6 lg:px-20" id="contact">
      <SectionTitle title="Contact Us" />

      <div className="grid md:grid-cols-2 gap-10 mt-10">
        {/* Contact Info */}
        <div className="space-y-6 text-gray-700">
          <p className="flex items-center gap-3 text-lg">
            <MdPhone className="text-2xl text-[#0fb894]" />
            Hotline:{" "}
            <a href="tel:+8801234567890" className="font-semibold hover:underline">
              +8801234567890
            </a>
          </p>
          <p className="flex items-center gap-3 text-lg">
            <MdEmail className="text-2xl text-[#0fb894]" />
            Email:{" "}
            <a href="mailto:hire.rent@gmail.com" className="font-semibold hover:underline">
              hire.rent@gmail.com
            </a>
          </p>
          <p className="leading-relaxed">
            Have a question, partnership idea, or need help? We’re here to support you.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Your Name"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0fb894]"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Your Email"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0fb894]"
          />
          <textarea
            name="message"
            value={formData.message}
            placeholder="Your Message"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-[#0fb894]"
          />
          <button
            type="submit"
            className="w-full bg-[#0fb894] hover:bg-[#0ca383] text-white font-semibold py-3 rounded-lg transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
