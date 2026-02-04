import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ menu, title }) {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleDropdown = (name) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  return (
    <div className="sidebar-green">
      {title && <h5 className="sidebar-title">{title}</h5>}

      <div className="sidebar-menu">
        {menu.map((item, index) => {
          // ✅ if item has children -> dropdown
          if (item.children) {
            return (
              <div key={index} className="sidebar-dropdown">
                <button
                  className="sidebar-dropdown-btn"
                  onClick={() => toggleDropdown(item.name)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="flex-grow-1">{item.name}</span>

                  <span className="dropdown-arrow">
                    {openMenu === item.name ? "▲" : "▼"}
                  </span>
                </button>

                {openMenu === item.name && (
                  <div className="sidebar-submenu">
                    {item.children.map((subItem, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={subItem.path}
                        className={({ isActive }) =>
                          isActive ? "sidebar-sublink active" : "sidebar-sublink"
                        }
                      >
                        <span className="sub-icon">{subItem.icon}</span>
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // ✅ Normal menu item
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.name}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;


