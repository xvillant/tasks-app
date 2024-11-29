import {
  authedNavigationLinks,
  adminNavigationLinks,
  publicNavigationLinks,
} from "@/lib/navigation-links";
import { useUserStore } from "@/store/userStore";
import SignOutButton from "@/components/auth/signOut-button";
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
        <SignOutButton />
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
