import React from "react";
import { Link } from "react-router-dom";

import "./Header.css";

const Header = () => {
  return (
    <header>
      <Link to="/">
        <div className="Header_logo">
          <div className="Header_name">
            <span>P</span>
            <span>L</span>
            <span>A</span>NT<span>Z</span>
            <span>Z</span>
            <span>Z</span>
          </div>
          <div className="Header_domain">.web.app</div>
        </div>
      </Link>
    </header>
  );
};

export default Header;
