
import React, {
  lazy,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "./App.css";

import { Userdatacontext } from "./Context/UserContext";

// =====================================
// LAZY LOADED COMPONENTS
// =====================================

const Home = lazy(() => import("./components/Home"));
const Refresh = lazy(() => import("./components/Refresh"));
const ThanksPost = lazy(() => import("./components/ThanksPost"));
const Notify = lazy(() => import("./components/Notify"));
const ViewProfile = lazy(() => import("./components/Viewprofile"));
const Userposts = lazy(() => import("./components/Userposts"));
const Mynetwork = lazy(() => import("./components/Mynetwork"));
const QuickLinks = lazy(() => import("./components/QuickLinks"));
const Editprofile = lazy(() => import("./components/Editprofile"));
const Signup = lazy(() => import("./components/Signup"));
const Login = lazy(() => import("./components/Login"));

// =====================================
// LOADING COMPONENT
// =====================================

function PageLoader() {
  return (
    <div className="app-loader">
      <div className="app-loader-spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

// =====================================
// APP COMPONENT
// =====================================

function App() {
  const { userdata } = useContext(Userdatacontext);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            userdata ? <Home /> : <Navigate to="/login" replace />
          }
        />

        {/* AUTHENTICATION */}
        <Route
          path="/signup"
          element={
            !userdata ? <Signup /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/login"
          element={
            !userdata ? <Login /> : <Navigate to="/" replace />
          }
        />

        {/* OTHER PAGES */}
        <Route path="/Welcome" element={<Refresh />} />

        <Route path="/quicklinks" element={<QuickLinks />} />

        <Route path="/postsend" element={<ThanksPost />} />

        <Route path="/notify" element={<Notify />} />

        <Route path="/profile" element={<ViewProfile />} />

        <Route path="/editprofile" element={<Editprofile />} />

        <Route path="/userpost" element={<Userposts />} />

        <Route path="/network" element={<Mynetwork />} />

        {/* INVALID ROUTES */}
        <Route
          path="*"
          element={
            <Navigate
              to={userdata ? "/" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
