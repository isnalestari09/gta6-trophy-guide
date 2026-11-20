/* main.js — boots Leonida Platinum: loads the trophy data, wires the tracker. */
import { loadEarned, saveEarned, exportEarned, importEarned, readHashState, writeHashState, shareLink, DEMO_EARNED } from "./store.js";
import { filterTrophies, sortTrophies } from "./filters.js";
import { updateProgress, renderChecklist, renderDetail, renderRoadmap, renderMissables } from "./views.js";

const state = {
  trophies: [],
  earned: loadEarned(),
  openId: null,
  view: "checklist",
  query: "",
  grade: "all",
  kind: "all",
  missableOnly: false,
  earnedOnly: false,
  spoilers: false,
};

function showView(view) {
  state.view = view;
  for (const button of document.querySelectorAll("#tabs button")) {
    button.classList.toggle("active", button.dataset.view === view);
  }
  for (const section of document.querySelectorAll(".view")) {
    section.hidden = section.id !== `view-${view}`;
  }
  if (view === "roadmap") renderRoadmap(state.trophies, state.earned);
  if (view === "missables") renderMissables(state.trophies, state.earned);
  writeHashState(view, state.earned, state.openId);
}

function refresh() {
  updateProgress(state.trophies, state.earned);
  const sorted = sortTrophies(state.trophies);
  const visible = filterTrophies(sorted, state);
  renderChecklist(visible, state, onToggle, onOpen);
  const open = state.trophies.find((t) => t.id === state.openId) || null;
  renderDetail(open, state);
  if (state.view === "roadmap") renderRoadmap(state.trophies, state.earned);
  if (state.view === "missables") renderMissables(state.trophies, state.earned);
}

function onToggle(id, checked) {
  if (checked) state.earned.add(id);
  else state.earned.delete(id);
  saveEarned(state.earned);
  refresh();
}

function onOpen(id) {
  state.openId = id;
  const open = state.trophies.find((t) => t.id === id) || null;
  renderDetail(open, state);
  writeHashState(state.view, state.earned, state.openId);
  document.getElementById("detailPane").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function wireToolbar() {
  document.getElementById("searchBox").addEventListener("input", (event) => {
    state.query = event.target.value;
    refresh();
  });
  document.getElementById("gradeFilter").addEventListener("change", (event) => {
    state.grade = event.target.value;
    refresh();
  });
  document.getElementById("kindFilter").addEventListener("change", (event) => {
    state.kind = event.target.value;
    refresh();
  });
  document.getElementById("missableOnly").addEventListener("change", (event) => {
    state.missableOnly = event.target.checked;
    refresh();
  });
  document.getElementById("earnedOnly").addEventListener("change", (event) => {
    state.earnedOnly = event.target.checked;
    refresh();
  });
  document.getElementById("spoilerToggle").addEventListener("change", (event) => {
    state.spoilers = event.target.checked;
    refresh();
  });
  document.getElementById("exportBtn").addEventListener("click", () => exportEarned(state.earned));
  document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
  document.getElementById("importFile").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      state.earned = await importEarned(file);
      saveEarned(state.earned);
      refresh();
    } catch {
      alert("That file is not a Leonida Platinum progress file.");
    }
    event.target.value = "";
  });
  document.getElementById("shareBtn").addEventListener("click", async () => {
    const link = shareLink(state.earned);
    try {
      await navigator.clipboard.writeText(link);
      document.getElementById("shareBtn").textContent = "Link copied!";
      setTimeout(() => { document.getElementById("shareBtn").textContent = "Copy share link"; }, 2000);
    } catch {
      prompt("Copy your share link:", link);
    }
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm("Clear all earned trophies?")) {
      state.earned = new Set();
      saveEarned(state.earned);
      refresh();
    }
  });
  for (const button of document.querySelectorAll("#tabs button")) {
    button.addEventListener("click", () => showView(button.dataset.view));
  }
}

async function boot() {
  const hash = readHashState();
  if (hash.shared) {
    state.earned = hash.shared;
    saveEarned(state.earned);
  } else if (hash.demo) {
    state.earned = new Set(DEMO_EARNED);
    saveEarned(state.earned);
  }
  if (hash.openId) state.openId = hash.openId;
  if (hash.spoilers) state.spoilers = true;
  const response = await fetch("data/trophies.json");
  const data = await response.json();
  state.trophies = data.trophies;
  wireToolbar();
  document.getElementById("spoilerToggle").checked = state.spoilers;
  showView(["checklist", "roadmap", "missables", "about"].includes(hash.view) ? hash.view : "checklist");
  refresh();
}

boot();
