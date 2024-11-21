import { ReactNode } from "react";
import { NavLink, To } from "react-router-dom";

export default function CustomNavLink({
  to,
  children,
}: {
  to: To;
  children: ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "underline underline-offset-4 text-primary font-bold"
          : "hover:underline underline-offset-4"
      }
    >
      {children}
    </NavLink>
  );
}
