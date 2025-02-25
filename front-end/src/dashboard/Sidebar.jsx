import "./sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AddBoxIcon from "@mui/icons-material/AddBox";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";

import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="center">
        <ul>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>

          <p className="title">LISTS</p>
          <Link to="/dashboard/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>
          <Link
            to="/dashboard/productsdashboard"
            style={{ textDecoration: "none" }}
          >
            <li>
              <StoreIcon className="icon" />
              <span>Products</span>
            </li>
          </Link>

          <Link to="/dashboard/addProduct" style={{ textDecoration: "none" }}>
            <li>
              <AddBoxIcon className="icon" />
              <span>Add Product</span>
            </li>
          </Link>

          <li>
            <LocalShippingIcon className="icon" />
            <span>Delivery</span>
          </li>
          <p className="title">USEFUL</p>
          <li>
            <InsertChartIcon className="icon" />
            <span>Stats</span>
          </li>
          <li>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>
          <p className="title">SERVICE</p>
          <li>
            <SettingsSystemDaydreamOutlinedIcon className="icon" />
            <span>System Health</span>
          </li>
          <li>
            <PsychologyOutlinedIcon className="icon" />
            <span>Logs</span>
          </li>
          <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li>
          <p className="title">PAGES</p>
          <Link to="/dashboard/form" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlinedIcon className="icon" />
              <span>Profile Form</span>
            </li>
          </Link>
          <Link to="/dashboard/calendar" style={{ textDecoration: "none" }}>
            <li>
              <CalendarTodayOutlinedIcon className="icon" />
              <span>Calendar</span>
            </li>
          </Link>

          <p className="title">CHARTS</p>

          <Link to="/dashboard/bar" style={{ textDecoration: "none" }}>
            <li>
              <BarChartOutlinedIcon className="icon" />
              <span>Bar Chart</span>
            </li>
          </Link>

          <Link to="/dashboard/pie" style={{ textDecoration: "none" }}>
            <li>
              <PieChartOutlineOutlinedIcon className="icon" />
              <span>Pie Chart</span>
            </li>
          </Link>

          <Link to="/dashboard/line" style={{ textDecoration: "none" }}>
            <li>
              <ShowChartOutlinedIcon className="icon" />
              <span>Line Chart</span>
            </li>
          </Link>

          <Link to="/dashboard/geo" style={{ textDecoration: "none" }}>
            <li>
              <PublicOutlinedIcon className="icon" />
              <span>Geographic Chart</span>
            </li>
          </Link>
          <p className="title">USER</p>
          <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li>
          <li>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
