import { WifiOff } from "lucide-react";
import React from "react";

interface OfflineVideoProps {
  username: string;
}
export const OfflineVideo = ({ username }: OfflineVideoProps) => {
  return (
    <div className="h-full flex flex-col space-y-4 justify-center items-center">
      <WifiOff className="w-10 h-10 text-muted-foreground" />
      <p className=" text-muted-foreground">{username} is offline.</p>
    </div>
  );
};
