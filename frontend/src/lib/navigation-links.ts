type NavigationLinkType = { title: string; route: string };

export const publicNavigationLinks: NavigationLinkType[] = [
  { title: "Home", route: "/" },
  { title: "Login", route: "/login" },
  { title: "Register", route: "/register" },
];

export const authedNavigationLinks: NavigationLinkType[] = [
  { title: "Home", route: "/" },
  { title: "Tasks", route: "/tasks" },
];

export const adminNavigationLinks: NavigationLinkType[] = [];
