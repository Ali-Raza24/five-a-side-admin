// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import List from "@material-ui/icons/ListAlt";
import DashboardPage from "../views/Dashboard/Dashboard.jsx";
import Bookings from "../views/Bookings/Bookings";
import VenueManager from "../views/VenueManager/VenueManager";
import Payout from "../views/Payouts/Payout";
// import ContentPaste from "@material-ui/icons/ContentPaste";
// core components/views

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Material Dashboard",
    icon: Dashboard,
    component: DashboardPage,
  },
  // {
  //   path: "/user",
  //   sidebarName: "User Profile",
  //   navbarName: "Profile",
  //   icon: Person,
  //   component: UserProfile
  // },
  // {
  //   path: "/bookings",
  // subPath: [
  //   {path: "/venues/create", title: "Create Venue"},
  // ],
  // sidebarName: "Bookings",
  // navbarName: "Bookings",
  // icon: List,
  // component: Bookings
  // },
  {
    path: "/venues",
    subPath: [{ path: "/venues/create", title: "Create Venue" }],
    sidebarName: "Venues",
    navbarName: "Venues",
    icon: List,
    component: VenueManager,
  },
  {
    path: "/payouts",
    sidebarName: "Payouts",
    navbarName: "Payouts",
    icon: List,
    component: Payout,
  },
  // {
  //   path: "/table",
  //   sidebarName: "Table List",
  //   navbarName: "Table List",
  //   icon: "content_paste",
  //   component: TableList
  // },
  // {
  //   path: "/typography",
  //   sidebarName: "Typography",
  //   navbarName: "Typography",
  //   icon: LibraryBooks,
  //   component: Typography
  // },
  // {
  //   path: "/icons",
  //   sidebarName: "Icons",
  //   navbarName: "Icons",
  //   icon: BubbleChart,
  //   component: Icons
  // },
  // {
  //   path: "/maps",
  //   sidebarName: "Maps",
  //   navbarName: "Map",
  //   icon: LocationOn,
  //   component: Maps
  // },
  // {
  //   path: "/notifications",
  //   sidebarName: "Notifications",
  //   navbarName: "Notifications",
  //   icon: Notifications,
  //   component: NotificationsPage
  // },
  // {
  //   path: "/upgrade-to-pro",
  //   sidebarName: "Upgrade To PRO",
  //   navbarName: "Upgrade To PRO",
  //   icon: Unarchive,
  //   component: UpgradeToPro
  // },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" },
];

export default dashboardRoutes;
