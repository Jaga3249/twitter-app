import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signUp/SignUpPage";
import HomePage from "./pages/home/HomePage";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/common/Sidebar";
import { useQuery } from "react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import RightPanel from "./components/common/RightPanel";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/v1/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "something went wrong");
        }
        return data?.data?.user;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const RenderLoading = () => {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  };

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={
            isLoading ? (
              <RenderLoading />
            ) : authUser ? (
              <HomePage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isLoading ? (
              <RenderLoading />
            ) : !authUser ? (
              <SignUpPage />
            ) : (
              <Navigate to={"/"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            isLoading ? (
              <RenderLoading />
            ) : !authUser ? (
              <LoginPage />
            ) : (
              <Navigate to={"/"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isLoading ? (
              <RenderLoading />
            ) : authUser ? (
              <NotificationPage />
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/profile/:username"
          element={
            isLoading ? (
              <RenderLoading />
            ) : authUser ? (
              <ProfilePage />
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="*"
          element={
            isLoading ? (
              <RenderLoading />
            ) : authUser ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}
export default App;
