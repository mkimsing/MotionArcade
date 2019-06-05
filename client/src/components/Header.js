import React from "react";
import { Link, NavLink } from "react-router-dom";
import joystick from "../assets/icons/joystick.svg";

export default function Header() {
  return (
    <div className="header">
      <div className="header__flexbox">
        <Link to="/">
          <img className="logo" src={joystick} />
        </Link>
        <nav>
          <div className="navItem">
            <NavLink
              activeClassName="navLinkActive"
              className="navLink"
              to="/Game1"
            >
              <div className="runnerIcon" />
              Endless Runner
            </NavLink>
          </div>
          <div className="navItem">
            <NavLink
              activeClassName="navLinkActive"
              className="navLink"
              to="/Game2"
            >
              <div className="jetIcon" />
              Galaga Lite
            </NavLink>
          </div>
        </nav>
      </div>
    </div>
  );
}
