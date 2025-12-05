import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main/Main";
import Home from "../Pages/Home/Home/Home";
import Register from "../shared/Register/Register";
import Login from "../shared/Login/Login";
import CourseListing from "../Pages/CourseListing/CourseListing/CourseListing";
import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard/AdminDashboard";
import CreateCourse from "../Pages/AdminDashboard/CreateCourse/CreateCourse";
import CourseDetails from "../Pages/CourseDetails/CourseDetails";
import PaymentSuccess from "../Pages/PaymentSuccess/PaymentSuccess";
import Dashboard from "../Pages/Dashboard/Dashboard/Dashboard";
import EnrolledCourse from "../Pages/Dashboard/EnrolledCourse/EnrolledCourse";
import EnrolledCourseDetails from "../Pages/Dashboard/EnrolledCourseDetails/EnrolledCourseDetails";
import EnrollmentManagement from "../Pages/AdminDashboard/EnrollmentManagment/EnrollmentManagment";
import SubmittedAssignment from "../Pages/AdminDashboard/SubmittedAssignment/SubmittedAssignment";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/courseListing",
        element: <CourseListing></CourseListing>,
      },
      {
        path: "/courses/:id",
        element: <CourseDetails></CourseDetails>,
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess></PaymentSuccess>,
      },
    ],
  },
  {
    path: "/adminDashboard",
    element: (
      <AdminRoute>
        <PrivateRoute>
          <AdminDashboard></AdminDashboard>
        </PrivateRoute>
      </AdminRoute>
    ),
    children: [
      {
        path: "/adminDashboard/createCourse",
        element: <AdminRoute><PrivateRoute><CreateCourse></CreateCourse></PrivateRoute></AdminRoute>,
      },
      {
        path: "/adminDashboard/EnrollmentManagment",
        element: <AdminRoute><PrivateRoute><EnrollmentManagement></EnrollmentManagement></PrivateRoute></AdminRoute>,
      },
      {
        path: "/adminDashboard/AssignmentManagment",
        element: <AdminRoute><PrivateRoute><SubmittedAssignment></SubmittedAssignment></PrivateRoute></AdminRoute>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    children: [
      {
        path: "/dashboard",
        element: <PrivateRoute><EnrolledCourse></EnrolledCourse></PrivateRoute>,
      },
      {
        path: "/dashboard/enrolled-course/:id",
        element: <PrivateRoute><EnrolledCourseDetails></EnrolledCourseDetails></PrivateRoute>,
      },
    ],
  },
]);
