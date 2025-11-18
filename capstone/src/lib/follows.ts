interface FollowRecord {
  followerId: string; 
  followingId: string; 
  followedAt: string; 
}

export function isFollowing(followerId: string, followingId: string): boolean {
  if (typeof window === "undefined") return false;

  const followsJson = localStorage.getItem("follows");
  if (!followsJson) return false;

  try {
    const follows: FollowRecord[] = JSON.parse(followsJson);
    return follows.some(
      (follow) =>
        follow.followerId === followerId &&
        follow.followingId === followingId
    );
  } catch {
    return false;
  }
}

export function followUser(followerId: string, followingId: string): void {
  if (typeof window === "undefined") return;

  if (isFollowing(followerId, followingId)) {
    return;
  }

  const followsJson = localStorage.getItem("follows");
  const follows: FollowRecord[] = followsJson ? JSON.parse(followsJson) : [];

  const newFollow: FollowRecord = {
    followerId,
    followingId,
    followedAt: new Date().toISOString(),
  };

  follows.push(newFollow);
  localStorage.setItem("follows", JSON.stringify(follows));
}

export function unfollowUser(followerId: string, followingId: string): void {
  if (typeof window === "undefined") return;

  const followsJson = localStorage.getItem("follows");
  if (!followsJson) return;

  try {
    const follows: FollowRecord[] = JSON.parse(followsJson);
    const filteredFollows = follows.filter(
      (follow) =>
        !(
          follow.followerId === followerId &&
          follow.followingId === followingId
        )
    );

    localStorage.setItem("follows", JSON.stringify(filteredFollows));
  } catch {
 
  }
}

export function toggleFollow(
  followerId: string,
  followingId: string
): boolean {
  const isCurrentlyFollowing = isFollowing(followerId, followingId);

  if (isCurrentlyFollowing) {
    unfollowUser(followerId, followingId);
    return false;
  } else {
    followUser(followerId, followingId);
    return true;
  }
}

export function getFollowing(userId: string): string[] {
  if (typeof window === "undefined") return [];

  const followsJson = localStorage.getItem("follows");
  if (!followsJson) return [];

  try {
    const follows: FollowRecord[] = JSON.parse(followsJson);
    return follows
      .filter((follow) => follow.followerId === userId)
      .map((follow) => follow.followingId);
  } catch {
    return [];
  }
}

export function getFollowers(userId: string): string[] {
  if (typeof window === "undefined") return [];

  const followsJson = localStorage.getItem("follows");
  if (!followsJson) return [];

  try {
    const follows: FollowRecord[] = JSON.parse(followsJson);
    return follows
      .filter((follow) => follow.followingId === userId)
      .map((follow) => follow.followerId);
  } catch {
    return [];
  }
}

export function getFollowingCount(userId: string): number {
  return getFollowing(userId).length;
}


export function getFollowersCount(userId: string): number {
  return getFollowers(userId).length;
}

export function getPersonalizedFeed(userId: string): string[] {
  const following = getFollowing(userId);
  
  if (following.length === 0) {
    return [];
  }

  return following;
}

