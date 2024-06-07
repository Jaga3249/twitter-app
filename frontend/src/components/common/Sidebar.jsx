import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
  const QueryClient = useQueryClient();

  const { mutate: LogoutMutate } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/v1/auth/logout`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error.message || "something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("user logged out sucessfully");
      QueryClient.invalidateQueries("authUser");
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-col gap-2 mt-4">
          <li className="flex justify-center md:justify-start md:mr-1 ">
            <Link
              to="/"
              className="flex gap-2 items-center justify-center md:justify-start hover:bg-stone-900 transition-all rounded-lg duration-300 p-2  cursor-pointer md:w-full"
            >
              <MdHomeFilled className="w-7 h-7" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start md:mr-1">
            <Link
              to="/notifications"
              className="flex gap-2 items-center justify-center md:justify-start hover:bg-stone-900 transition-all rounded-lg duration-300 p-2 md:w-full cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start md:mr-1">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center justify-center md:justify-start hover:bg-stone-900 transition-all rounded-lg duration-300 p-2 md:w-full cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {authUser && (
          <Link
            to={`/profile/${authUser?.username}`}
            className="mt-auto mb-10 flex gap-2 items-center transition-all duration-300 hover:bg-[#181818] p-2 rounded-md 
            md:pr-4 md:-ml-2 md:w-full mx-4"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex md:justify-between justify-center items-center flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.fullname}
                </p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="w-7 h-7 cursor-pointer "
                onClick={(e) => {
                  e.preventDefault();
                  LogoutMutate();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
