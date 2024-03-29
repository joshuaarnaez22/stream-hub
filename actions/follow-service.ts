import prisma from "@/lib/prisma";
import { getSelf } from "./auth-service";

export const isFollowingUser = async (id: string) => {
  try {
    const self = await getSelf();

    if (!self.user) {
      return false;
    }

    const otherUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!otherUser) throw new Error("User not found");

    if (self.user.id === otherUser.id) return true;

    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: self.user.id,
        followingId: otherUser.id,
      },
    });

    return !!existingFollow;
  } catch (error) {
    return false;
  }
};

export const getAllFollowUsers = async () => {
  const self = await getSelf();

  if (!self.user) {
    return [];
  }

  const blockedIds = await prisma.block.findMany({
    where: {
      blockedId: self.user.id,
    },
    select: {
      blockerId: true,
    },
  });

  const excludedUserIds = [...blockedIds.map((blocked) => blocked.blockerId)];
  const folowedUsers = await prisma.follow.findMany({
    where: {
      AND: [
        {
          followerId: self.user.id,
        },
        {
          following: {
            id: {
              notIn: excludedUserIds,
            },
          },
        },
      ],
    },
    include: {
      following: {
        include: {
          stream: {
            select: {
              isLive: true,
            },
          },
        },
      },
    },
  });

  return folowedUsers;
};
