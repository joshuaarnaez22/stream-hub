"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface ActionsProps {
  id: string;
  isFollowing: boolean;
}
export const Actions = ({ id, isFollowing }: ActionsProps) => {
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();
  const handleFollow = async () => {
    try {
      setIsPending(true);
      const { data } = await axios.post("/api/user-actions/follow", { id });
      toast.success(data.message, {
        icon: "👍",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        icon: "❌",
      });
    } finally {
      setIsPending(false);
    }
  };
  const handleUnFollow = async () => {
    try {
      setIsPending(true);
      const { data } = await axios.post("/api/user-actions/unfollow", { id });
      toast.success(data.message, {
        icon: "👍",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        icon: "❌",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleBlock = async () => {
    const { data } = await axios.post("/api/user-actions/block", { id });
    console.log(data);

    toast.success(data.message, {
      icon: "👍",
    });
    router.refresh();
  };
  const handleUnBlock = async () => {
    const { data } = await axios.post("/api/user-actions/unblock", { id });
    console.log(data);

    toast.success(data.message, {
      icon: "👍",
    });
    router.refresh();
  };
  return (
    <>
      {" "}
      <Button
        variant="primary"
        onClick={() => (isFollowing ? handleUnFollow() : handleFollow())}
        disabled={isPending}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
      <Button onClick={handleUnBlock}>unBlock</Button>
    </>
  );
};
