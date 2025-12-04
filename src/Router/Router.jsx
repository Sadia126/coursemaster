import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main/Main";
import Home from "../Pages/Home/Home/Home";
import Register from "../shared/Register/Register";
import Login from "../shared/Login/Login";
import CourseListing from "../Pages/CourseListing/CourseListing/CourseListing";
import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard/AdminDashboard";
import CreateCourse from "../Pages/AdminDashboard/CreateCourse/CreateCourse";
import CourseDetails from "../Pages/CourseDetails/CourseDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },{
          path:"/register",
          element:<Register></Register>
        },{
          path:"/login",
          element: <Login></Login>
        },{
          path:"/courseListing",
          element:<CourseListing></CourseListing>
        },{
          path:"/courses/:id",
          element:<CourseDetails></CourseDetails>
        }
    ],
  },{
    path:"/adminDashboard",
    element: <AdminDashboard></AdminDashboard>,
    children:[
      {
        path:"/adminDashboard/createCourse",
        element: <CreateCourse></CreateCourse>
      }
    ]
  }
]);
