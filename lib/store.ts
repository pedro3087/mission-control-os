"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Project } from "./types";
import { DEMO_PROJECTS } from "./fixtures";

export type SettingsSection = "projects" | "apis" | "about";
export type DashboardView = "standard" | "portfolio" | "brain" | "ops";

export interface ApiTokens {
  vercelToken: string;
  githubToken: string;
  githubOwner: string;
  githubRepos: string;
}

interface AppStore {
  isDemo: boolean;
  setDemo: (v: boolean) => void;

  selectedProjectId: string | null;
  setSelectedProject: (id: string | null) => void;

  brainFilter: string;
  setBrainFilter: (f: string) => void;

  projects: Project[];
  updateProject: (id: string, updates: Partial<Project>) => void;
  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  resetProjects: () => void;

  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  settingsSection: SettingsSection;
  setSettingsSection: (s: SettingsSection) => void;
  editingProjectId: string | null;
  setEditingProjectId: (id: string | null) => void;

  isTasksOpen: boolean;
  setTasksOpen: (open: boolean) => void;

  dashboardView: DashboardView;
  setDashboardView: (v: DashboardView) => void;

  apiTokens: ApiTokens;
  setApiTokens: (tokens: Partial<ApiTokens>) => void;
}

// SSR-safe localStorage storage — factory is called lazily so it never runs on server
const storage = createJSONStorage(() => {
  if (typeof window === "undefined") {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
  return localStorage;
});

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      isDemo: true,
      setDemo: (v) => set({ isDemo: v }),

      selectedProjectId: null,
      setSelectedProject: (id) => set({ selectedProjectId: id }),

      brainFilter: "all",
      setBrainFilter: (f) => set({ brainFilter: f }),

      projects: DEMO_PROJECTS,
      updateProject: (id, updates) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      addProject: (project) =>
        set((s) => ({ projects: [...s.projects, project] })),
      deleteProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          selectedProjectId: s.selectedProjectId === id ? null : s.selectedProjectId,
          editingProjectId: s.editingProjectId === id ? null : s.editingProjectId,
        })),
      resetProjects: () => set({ projects: DEMO_PROJECTS }),

      isSettingsOpen: false,
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),
      settingsSection: "projects",
      setSettingsSection: (s) => set({ settingsSection: s }),
      editingProjectId: null,
      setEditingProjectId: (id) => set({ editingProjectId: id }),

      isTasksOpen: false,
      setTasksOpen: (open) => set({ isTasksOpen: open }),

      dashboardView: "standard",
      setDashboardView: (v) => set({ dashboardView: v }),

      apiTokens: { vercelToken: "", githubToken: "", githubOwner: "", githubRepos: "" },
      setApiTokens: (tokens) =>
        set((s) => ({ apiTokens: { ...s.apiTokens, ...tokens } })),
    }),
    {
      name: "mission-control-store",
      storage,
      skipHydration: true,
    }
  )
);
