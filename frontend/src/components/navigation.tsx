import {
  authedNavigationLinks,
  adminNavigationLinks,
  publicNavigationLinks,
} from "@/lib/navigation-links";
import { Role } from "@/lib/types";
import { useUserStore } from "@/store/userStore";
import LogoutButton from "@/components/logout-button";
import CustomNavLink from "@/components/custom-navlink";

export default function Navigation() {
  const user = useUserStore((state) => state.user);

  if (user) {
    let links = [
      ...authedNavigationLinks,
      { title: "Profile", route: `/profile/${user.username}` },
    ];
    if (user.role === Role.ADMIN) {
      links = links.concat(adminNavigationLinks);
    }

    return (
      <>
        {links.map((link) => (
          <CustomNavLink key={link.route} to={link.route}>
            {link.title}
          </CustomNavLink>
        ))}
        <LogoutButton />
      </>
    );
  }

  return (
    <>
      {publicNavigationLinks.map((link) => (
        <CustomNavLink key={link.route} to={link.route}>
          {link.title}
        </CustomNavLink>
      ))}
    </>
  );
}
