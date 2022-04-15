import Dashboard from '@material-ui/icons/Dashboard';
import List from '@material-ui/icons/ListAlt';
import DashboardPage from '../views/Dashboard/Dashboard';
import ManagerRequests from '../views/ManagerRequests/ManagerRequests';
import Bookings from '../views/Bookings/Bookings';
import VenueManager from '../views/VenueManager/VenueManager';
import Payout from '../views/Payouts/Payout';
import PendingPayouts from "../views/PendingPayouts/PendingPayouts";
import BookingHistory from "../views/BookingHistory/BookingHistory";
import { HowToReg, HowToRegSharp, MonetizationOnSharp, VerifiedUser } from '@material-ui/icons'
import AdminAllVenues from '../views/AdminAllVenues/AdminAllVenues'
import AdminTransactions from '../views/AdminTransactions/AdminTransactions'


const adminRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Material Dashboard",
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: "/pendingPayouts",
    sidebarName: "Pending Payouts",
    navbarName: "Pending Payouts",
    icon: MonetizationOnSharp,
    component: PendingPayouts
  },
  {
    path: "/managerRequests",
    sidebarName: "Manager Requests",
    navbarName: "Manager Requests",
    icon: HowToRegSharp,
    component: ManagerRequests
  },
  // {
  //   path: "/bookingsHistory",
  //   sidebarName: "Booking History",
  //   navbarName: "Booking History",
  //   icon: List,
  //   component: BookingHistory
  //  },
  {
    path: "/bookingsHistory",
    sidebarName: "Booking History",
    navbarName: "Booking History",
    icon: List,
    component: BookingHistory
  },
  {
    path: "/AdminAllVenues",
    sidebarName: "All Venues",
    navbarName: "All Venues",
    icon: List,
    component: AdminAllVenues
  },
  {
      path: "/purchases",
      sidebarName: "Purchases",
      navbarName: "Purchases",
      icon: MonetizationOnSharp,
      component: AdminTransactions
  },
 
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default adminRoutes;
