import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { UseGlobalContext } from "./components/Provider/Context";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ResetPassword from "./components/Auth/ResetPassword";
import ForgetPassword from "./components/Auth/ForgetPassword";
import PublicRoute from "./components/privateRoute/AuthPublicRoute";
import Loading from "./components/SingleComponent/Loading";
import Messenger from "./components/ChatIo";
import DisplayConversation from "./components/ChatIo/DisplayConversation";
import MobileMessenger from "./components/ChatIo/MobileMessenger";
import UpdateProfile from "./components/ChatIo/UpdateProfile";

const App = () => {
  let { loading } = UseGlobalContext();

  if (loading) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Navigate to="/messages/r" />} />
        <Route
          path="/messages/r/*"
          element={
            <PrivateRoute>
              <Messenger />
            </PrivateRoute>
          }
        >
          <Route path=":id/*" element={<DisplayConversation />} />
        </Route>

        <Route
          path="/m/messages/r/:id/*"
          element={
            <PrivateRoute>
              <MobileMessenger />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/*"
          element={
            <PrivateRoute>
              <UpdateProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/user/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/user/signup"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/user/reset-password/:resetToken"
          element={<ResetPassword />}
        />
        <Route
          path="/user/forget-password"
          element={
            <PublicRoute>
              <ForgetPassword />
            </PublicRoute>
          }
        />
      </Routes>
    </React.Fragment>
  );
};

export default App;
