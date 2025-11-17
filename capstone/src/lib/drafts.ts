// Draft Management Utility Functions
// This file handles saving and loading drafts from localStorage

// Interface for a draft post
export interface DraftPost {
  id: string; // Unique ID for the draft
  title: string; // Post title
  content: string; // Post content (HTML from editor)
  excerpt?: string; // Short description
  tags?: string[]; // Post tags
  createdAt: string; // When draft was created
  updatedAt: string; // When draft was last updated
}

// Get all drafts from localStorage
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

// Save a draft to localStorage
export function saveDraft(draft: DraftPost): void {
  if (typeof window === "undefined") return;

  const drafts = getAllDrafts();
  const existingIndex = drafts.findIndex((d) => d.id === draft.id);

  if (existingIndex >= 0) {
    // Update existing draft
    drafts[existingIndex] = draft;
  } else {
    // Add new draft
    drafts.push(draft);
  }

  // Save back to localStorage
  localStorage.setItem("drafts", JSON.stringify(drafts));
}

// Delete a draft
export function deleteDraft(id: string): void {
  if (typeof window === "undefined") return;

  const drafts = getAllDrafts();
  const filteredDrafts = drafts.filter((draft) => draft.id !== id);
  localStorage.setItem("drafts", JSON.stringify(filteredDrafts));
}

// Create a new draft with auto-generated ID
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

