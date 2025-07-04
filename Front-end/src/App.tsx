import Root from "./pages/Root";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Auth from "./pages/auth/Auth";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Adopter from "./pages/adopter/Adopter";
import Admin from "./pages/admin/Admin";
import AdminDefault from "./pages/admin/AdminDefault";
import PageNotFound from "./pages/NotFound";
import AdopterDefault from "./pages/adopter/AdopterDefault";
import Manager from "./pages/manager/Manager";
import ManagerDefault from "./pages/manager/ManagerDefault";
import Staff from "./pages/staff/Staff";
import StaffDefault from "./pages/staff/StaffDefault";
import PetAdd from "./pages/staff/PetAdd";
import Applications from "./pages/staff/Applications";
import AdopterApplications from "./pages/adopter/AdopterApplications";
import PetEdit from "./pages/staff/PetEdit";
import PetDetails from "./pages/adopter/PetDetails";
import ShelterSearch from './pages/ShelterSearch';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      {/* Set default routing as auth in page*/}
      <Route path="/" element={<Login />} /> 
      <Route path="signup" element={<SignUp />} />
      {/* <Route path="auth" element={<Auth />}>
        <Route index element={<Login />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
       */}

      {/* Adopter Route */}
      <Route path="adopter" element={<Adopter />}>
        <Route index element={<AdopterDefault />} />
        <Route path="applications" element={<AdopterApplications />} />
        <Route path=":id" element={<PetDetails />} />
      </Route>

      {/* Admin Route */}
      <Route path="admin" element={<Admin />}>
        <Route index element={<AdminDefault />} />
      </Route>

      {/* Manager Route */}
      <Route path="manager" element={<Manager />}>
        <Route index element={<ManagerDefault />} />
      </Route>

      {/* Staff Route */}
      <Route path="staff" element={<Staff />}>
        <Route index element={<StaffDefault />} />
        <Route path=":id" element={<PetEdit />} />
        <Route path="add" element={<PetAdd />} />
        <Route path="applications" element={<Applications />} />
      </Route>

      {/* Set default routing as log in page*/}
      <Route path="/" element={<Auth />} />
      <Route path="/shelter-search" element={<ShelterSearch />} />
      
      {/* 404 page - render this when no other routes match */}
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);

const App = () => {
  return (
      <RouterProvider router={router}></RouterProvider>
  )
}

export default App
