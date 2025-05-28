"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function getAllGrpNames() {
  return await db.group.findMany({});
}

export async function getGroup(id: string) {
  return await db.group.findFirst({
    where: {
      id: id,
    },
    include: {
      ActiveStreams: true,
    },
  });
}
export async function getUser(id: string) {
  return await db.user.findFirst({
    where: {
      id: id,
    },
  });
}
export async function getMembers(member: string[]) {
  if (member.length === 0) {
    throw new Error("The member array does not contain any members.");
  }

  return await db.user.findMany({
    where: {
      id: {
        in: member,
      },
    },
  });
}

export async function createStream({ groupId }: { groupId: string }) {
  try {
    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      throw new Error("Unable to find group");
    }

    const createdStream = await db.activeStreams.create({
      data: {
        groupId: groupId,
        type: "Spotify",
        userId: group.userId,
      },
    });

    await db.group.update({
      where: { id: groupId },
      data: { streamId: createdStream.id },
    });
    pusherServer.trigger("active-stream", "new-stream", createdStream);

    return createdStream;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

interface urlTypes {
  groupId: string;
  link: string;
  image: string;
  title: string;
}

export async function addUrl({ image, title, groupId, link }: urlTypes) {
  try {
    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      throw new Error("Unable to find group");
    }

    const stream = await db.activeStreams.findUnique({
      where: {
        groupId: groupId,
      },
    });

    if (!stream) {
      throw new Error("Unable to find stream");
    }

    if (!image || !title || !link) {
      throw new Error("not able to add this song");
    }
    const newUrl = await db.url.create({
      data: {
        image,
        title,
        streamId: stream.id,
        url: link,
      },
      include: {
        activeStream: true,
      },
    });

    return newUrl;
  } catch (error) {
    throw error;
  }
}

export async function dropUrl(urlId: string) {
  await db.$connect();

  try {
    const url = await db.url.findUnique({
      where: {
        id: urlId,
      },
    });

    if (!url) {
      throw new Error("not able to find that url");
    }

    return await db.url.delete({
      where: {
        id: urlId,
      },
    });
  } catch (error) {
    throw new Error("while deleting steam");
  } finally {
    await db.$disconnect();
  }
}

export async function updateActiveStream(
  groupID: string,
  currentSongIndex: number
) {
  try {
    const activeSong = await db.activeStreams.update({
      where: { groupId: groupID },
      data: { currentSongIndex },
    });

    await pusherServer.trigger("active-song", "new-activeSong", activeSong);
    console.log("Active song updated:");
    return activeSong;
  } catch (error) {
    console.log(error);
  }
}

export async function findActiveStream(groupID: string) {
  await db.$connect();
  try {
    const group = await db.group.findFirst({
      where: {
        id: groupID,
      },
    });

    if (!group) {
      throw new Error("not able to find group");
    }

    return await db.activeStreams.findUnique({
      where: {
        id: group.streamId,
      },
      include: {
        url: true,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Could not find any stream for the given group");
  }
}
export async function deleteStream(streamID: string) {
  await db.$connect();
  try {
    const group = await db.group.updateMany({
      where: {
        streamId: streamID,
      },
      data: {
        streamId: "",
      },
    });

    return await db.activeStreams.delete({
      where: {
        id: streamID,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Could not find any stream for the given group");
  }
}

export async function addFavorite({
  image_url,
  Audio_url,
  title_url,
}: {
  title_url: string;
  Audio_url: string;
  image_url: string;
}) {
  await db.$connect();
  const session = await getServerSession(authOptions);
  try {
    if (!session || !session.user?.email) {
      throw new Error("session is not register");
    }
    const user = await db.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });

    if (!user) {
      throw new Error("no user find with this credentials");
    }

    const checkFavList = await db.favroutie.findFirst({
      where: {
        Audio_url: Audio_url,
      },
    });

    if (checkFavList) {
      throw new Error("All ready in fav list");
    }
    return await db.favroutie.create({
      data: {
        userId: user?.id,
        image_url,
        Audio_url,
        title_url,
      },
    });
  } catch (error) {
    throw new Error("Check your Fav List OR may be already in your fav list");
  }
}

export async function checkAdmin(groupID: string) {
  if (!groupID) {
    throw new Error("group id Server Issue");
  }
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("can't find the user");
    }

    const user = await db.user.findUnique({
      where: {
        email: session.user.email!,
      },
    });

    const group = await db.group.findUnique({
      where: {
        id: groupID,
      },
    });

    if (group?.admin === user?.id) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    throw new Error("admin is not there");
  }
}
export async function getAdmin() {
  await db.$connect();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new Error("can't find the user");
    }

    return await db.user.findUnique({
      where: {
        email: session.user.email!,
      },
    });
  } catch (error) {
    throw new Error("there is no admin");
  }
}

export async function changeFavList(Audio_url: string) {
  await db.$connect();

  try {
    return db.favroutie.deleteMany({
      where: {
        Audio_url: Audio_url,
      },
    });
  } catch (error) {
    throw new Error("Error while deleting from fav list");
  }
}
