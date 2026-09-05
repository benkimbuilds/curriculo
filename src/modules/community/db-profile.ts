import { eq } from "drizzle-orm";

import { db, type Database } from "@/db";
import { profiles, user } from "@/db/schema";
import { ResourceNotFoundError } from "@/shared/errors";

export interface OwnProfile {
  userId: string;
  accountName: string;
  email: string;
  emailVerified: boolean;
  chosenName: string;
  bio: string;
  githubUsername: string;
  profileVisible: boolean;
  isMinor: boolean;
}

export async function getOwnProfile(
  userId: string,
  database: Database = db,
): Promise<OwnProfile> {
  const [row] = await database
    .select({
      userId: user.id,
      accountName: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      chosenName: profiles.chosenName,
      bio: profiles.bio,
      githubUsername: profiles.githubUsername,
      profileVisible: profiles.profileVisible,
      isMinor: profiles.isMinor,
    })
    .from(user)
    .leftJoin(profiles, eq(profiles.userId, user.id))
    .where(eq(user.id, userId))
    .limit(1);
  if (!row) throw new ResourceNotFoundError("Profile");
  return {
    ...row,
    chosenName: row.chosenName ?? row.accountName,
    bio: row.bio ?? "",
    githubUsername: row.githubUsername ?? "",
    profileVisible: row.isMinor === false && (row.profileVisible ?? false),
    isMinor: row.isMinor ?? true,
  };
}
