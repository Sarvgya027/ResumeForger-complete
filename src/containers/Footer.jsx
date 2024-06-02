import React from "react";
import { Logo } from "../assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="w-full flex items-center justify-between border-t-2 border-[#0D5C63]">
      <div className="flex items-center justify-center gap-3 py-3">
        <img className="w-8 mt-2 h-auto object-contain" src={Logo} alt="" />
        <p>ResumeForger</p>
      </div>
      <div className="flex items-center justify-center gap-6">
        <Link to={"/"} className="">
          Home
        </Link>
        <Link to={"/"} className="">
          Contact
        </Link>
        <Link to={"/"} className="">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default Footer;
