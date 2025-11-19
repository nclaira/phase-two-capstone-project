import { getAllPosts, type Post } from "./posts";

export async function searchPosts(query: string): Promise<Post[]> {
  if (!query || query.trim() === "") {
    return []; 
  }

  const allPosts = await getAllPosts();
  const searchTerm = query.toLowerCase().trim();

  return allPosts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm);

    const excerptMatch = post.excerpt.toLowerCase().includes(searchTerm);

    const contentText = stripHtml(post.content).toLowerCase();
    const contentMatch = contentText.includes(searchTerm);

    const tagsMatch = post.tags.some((tag) =>
      tag.toLowerCase().includes(searchTerm)
    );

    const authorMatch = post.authorName.toLowerCase().includes(searchTerm);

    return (
      titleMatch || excerptMatch || contentMatch || tagsMatch || authorMatch
    );
  });
}

function stripHtml(html: string): string {
  if (typeof window !== "undefined") {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  } else {

    return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  }
}

export async function getRecommendedPosts(
  excludePostId?: string,
  limit: number = 3
): Promise<Post[]> {
  const allPosts = await getAllPosts();

  const filteredPosts = excludePostId
    ? allPosts.filter((post) => post.id !== excludePostId)
    : allPosts;

  const shuffled = [...filteredPosts].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, limit);
}

export async function getPopularPosts(limit: number = 6): Promise<Post[]> {
  const allPosts = await getAllPosts();

  return allPosts
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit);
}

export async function getLatestPosts(limit: number = 6): Promise<Post[]> {
  const allPosts = await getAllPosts();

  return allPosts.slice(0, limit);
}

