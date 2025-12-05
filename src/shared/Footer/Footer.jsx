import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import logo from "../../assets/logo.png"; 

const Footer = () => {
  return (
    <footer className=" bg-base-200 py-10 px-6 md:px-20">
      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Logo & Tagline */}
        <div>
          <img src={logo} alt="Logo" className="w-32 mb-4" />
          <p className="text-sm leading-relaxed">
            Empowering people to rent & earn seamlessly.  
            Join us today 
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold  mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/"  >Home</a>
            </li>
            <li>
              <a href="/about"  >About</a>
            </li>
            <li>
              <a href="/services"  >Services</a>
            </li>
            <li>
              <a href="/contact"  >Contact</a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold  mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#"  ><FaFacebook size={22} /></a>
            <a href="#"  ><FaTwitter size={22} /></a>
            <a href="#"  ><FaInstagram size={22} /></a>
            <a href="#"  ><FaLinkedin size={22} /></a>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
        © {new Date().getFullYear()} Rentra. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
