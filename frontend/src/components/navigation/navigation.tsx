import {
  authedNavigationLinks,
  adminNavigationLinks,
  publicNavigationLinks,
} from "@/lib/navigation-links";
import { useUserStore } from "@/store/userStore";
import LogoutButton from "@/components/auth/logout-button";
import CustomNavLink from "@/components/navigation/custom-navlink";
import { isAdmin } from "@/lib/utils";

export default function Navigation() {
  const user = useUserStore((state) => state.user);

  if (user) {
    let links = [
      ...authedNavigationLinks,
      { title: "Profile", route: `/profile/${user.username}` },
    ];
    if (isAdmin(user)) {
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
