type NavigationLinkType = { title: string; route: string };

export const publicNavigationLinks: NavigationLinkType[] = [];

export const authedNavigationLinks: NavigationLinkType[] = [
  { title: "Home", route: "/" },
  { title: "Tasks", route: "/tasks" },
];

export const adminNavigationLinks: NavigationLinkType[] = [];
