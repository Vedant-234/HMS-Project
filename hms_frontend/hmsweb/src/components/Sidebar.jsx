import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ menu, title }) {

  // ✅ read last open menu from localStorage
  const [openMenu, setOpenMenu] = useState(
    localStorage.getItem("doctorSidebarOpenMenu")
  );

  // ✅ toggle dropdown + persist state
  const toggleDropdown = (name) => {
    const newValue = openMenu === name ? null : name;
    setOpenMenu(newValue);

    if (newValue) {
      localStorage.setItem("doctorSidebarOpenMenu", newValue);
    } else {
      localStorage.removeItem("doctorSidebarOpenMenu");
    }
  };

  return (
    <div className="sidebar-green">
      {title && <h5 className="sidebar-title">{title}</h5>}

      <div className="sidebar-menu">
        {menu.map((item, index) => {

          // ✅ DROPDOWN MENU
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
                          isActive
                            ? "sidebar-sublink active"
                            : "sidebar-sublink"
                        }
                        // ✅ keep dropdown open when navigating
                        onClick={() =>
                          localStorage.setItem(
                            "doctorSidebarOpenMenu",
                            item.name
                          )
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

          // ✅ NORMAL MENU ITEM
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
              // ✅ close dropdown when navigating to top-level menu
              onClick={() =>
                localStorage.removeItem("doctorSidebarOpenMenu")
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
