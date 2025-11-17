export interface DraftPost {
  id: string; 
  title: string;
  content: string; 
  excerpt?: string; 
  tags?: string[]; 
  createdAt: string; 
  updatedAt: string; 
}

export function getAllDrafts(): DraftPost[] {
  if (typeof window === "undefined") return [];

  const draftsJson = localStorage.getItem("drafts");
  if (!draftsJson) return [];

  try {
    return JSON.parse(draftsJson);
  } catch {
    return [];
  }
}

// Get a single draft by ID
export function getDraftById(id: string): DraftPost | null {
  const drafts = getAllDrafts();
  return drafts.find((draft) => draft.id === id) || null;
}

export function saveDraft(draft: DraftPost): void {
  if (typeof window === "undefined") return;

  const drafts = getAllDrafts();
  const existingIndex = drafts.findIndex((d) => d.id === draft.id);

  if (existingIndex >= 0) {
    drafts[existingIndex] = draft;
  } else {
    drafts.push(draft);
  }

  localStorage.setItem("drafts", JSON.stringify(drafts));
}

export function deleteDraft(id: string): void {
  if (typeof window === "undefined") return;

  const drafts = getAllDrafts();
  const filteredDrafts = drafts.filter((draft) => draft.id !== id);
  localStorage.setItem("drafts", JSON.stringify(filteredDrafts));
}

export function createNewDraft(): DraftPost {
  return {
    id: `draft-${Date.now()}`,
    title: "",
    content: "",
    excerpt: "",
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

