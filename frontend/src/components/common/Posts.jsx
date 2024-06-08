import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const Posts = ({ feedType, username, userId }) => {
  const getPostEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/v1/posts/all";
      case "following":
        return "/api/v1/posts/following";
      case "posts":
        return `/api/v1/posts/user/${username}`;
      case "likes":
        return `/api/v1/posts/likes/${userId}`;

      default:
        return "/api/v1/posts/all";
    }
  };
  const POST_ENDPOINT = getPostEndPoint();
  const { isPending, refetch, isRefetching, data } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }

        return data?.data?.posts;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  return (
    <>
      {isPending ||
        (isRefetching && (
          <div className="flex flex-col justify-center">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ))}
      {!isPending && !isRefetching && data?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isPending && !isRefetching && data && (
        <div>
          {data?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
