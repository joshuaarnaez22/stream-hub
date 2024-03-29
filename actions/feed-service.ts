import prisma from "@/lib/prisma";
import { getSelf } from "./auth-service";

export const getStreams = async () => {
  let self;
  let streams = [];

  try {
    self = await getSelf();
  } catch (error) {
    self = null;
  }

  if (self?.user) {
    const blockedIds = await prisma.block.findMany({
      where: {
        blockedId: self.user.id,
      },
      select: {
        blockerId: true,
      },
    });

    const blockingIds = await prisma.block.findMany({
      where: {
        blockerId: self.user.id,
      },
      select: {
        blockedId: true,
      },
    });

    const excludedUserIds = [
      ...blockedIds.map((blocked) => blocked.blockerId),
      ...blockingIds.map((blocked) => blocked.blockedId),
    ];
    streams = await prisma.stream.findMany({
      where: {
        user: {
          id: {
            notIn: excludedUserIds,
          },
        },
      },
      select: {
        id: true,
        isLive: true,
        thumbnailUrl: true,
        name: true,
        user: true,
      },
      orderBy: [{ isLive: "desc" }, { updatedAt: "desc" }],
    });
  } else {
    streams = await prisma.stream.findMany({
      select: {
        id: true,
        isLive: true,
        thumbnailUrl: true,
        name: true,
        user: true,
      },
      orderBy: [{ isLive: "desc" }, { updatedAt: "desc" }],
    });
  }

  return streams;
};
