"use client";
import React from "react";
import { useViewerToken } from "@/hooks/use-viewer-token";
import { Stream, User } from "@prisma/client";
import { LiveKitRoom } from "@livekit/components-react";
import { Video } from "./video";

interface StreamPlayerProps {
  user: User & { stream: Stream | null };
  isFollowing: boolean;
}
export const StreamPlayer = ({ user, isFollowing }: StreamPlayerProps) => {
  const { token, name, identity } = useViewerToken(user.id);

  if (!token || !name || !identity) {
    return <div>Cannot watch stream</div>;
  }
  return (
    <>
      {" "}
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
        video={true}
        audio={true}
        className="grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 2xl:grid-cols-6 h-full"
      >
        <div className=" space-y-4 col-span-1 lg:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar">
          <Video hostName={user.username} hostIdentity={user.id} />
        </div>
      </LiveKitRoom>
    </>
  );
};
