import projectData from "./data/projects.json";
import aiVisualData from "./data/ai-visuals.json";

export type Project = (typeof projectData)[number];
export type AiVisual = (typeof aiVisualData)[number];

export const projects: Project[] = projectData;
export const aiVisuals: AiVisual[] = aiVisualData;
export const aiCatalogUrl =
  aiVisuals[0]?.catalogUrl || "https://lynk.id/rofiull";

export const featured = [
  "OCS EDU",
  "Rekyndness",
  "BangunKarya",
  "Veyra",
  "TalkBuddy",
  "VOLTX",
  "Our Creative",
  "Blade",
].map((name) => projects.find((p) => p.title.startsWith(name))!);

export interface RoomDefinition {
  id:
    | "plaza"
    | "lobby"
    | "room-01"
    | "room-02"
    | "room-03"
    | "room-04"
    | "guestbook";
  index: number;
  code: string;
  short: string;
  title: string;
  subtitle: string;
  range: string;
  zBounds: [number, number];
  mapBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  dotY: number;
}

export const rooms: RoomDefinition[] = [
  {
    id: "plaza",
    index: 0,
    code: "",
    short: "Halaman",
    title: "Di tengah kota, sebuah cerita.",
    subtitle: "Sebuah ruang untuk ide yang menjadi karya.",
    range: "Jakarta · Ruang digital",
    zBounds: [25, 7],
    dotY: 263,
  },
  {
    id: "lobby",
    index: 1,
    code: "00",
    short: "Lobby",
    title: "Lobby & Reception",
    subtitle:
      "Ruang penyambutan museum. Lihat papan denah di kiri atau buka buku katalog di meja resepsi.",
    range: "Ruang 00 · Sambutan & Orientasi",
    zBounds: [7, -6],
    mapBox: { x: 30, y: 214, width: 72, height: 34 },
    dotY: 231,
  },
  {
    id: "room-01",
    index: 2,
    code: "01",
    short: "Ruang 01",
    title: "Products & Systems",
    subtitle: "Dari kebutuhan sehari-hari menjadi sistem yang bekerja.",
    range: "2026 · 3 proyek",
    zBounds: [-6, -24],
    mapBox: { x: 30, y: 174, width: 72, height: 34 },
    dotY: 191,
  },
  {
    id: "room-02",
    index: 3,
    code: "02",
    short: "Ruang 02",
    title: "Applied Experiments",
    subtitle: "Menjelajahi kemungkinan di antara kode dan dunia nyata.",
    range: "2026 · 3 proyek",
    zBounds: [-24, -42],
    mapBox: { x: 30, y: 134, width: 72, height: 34 },
    dotY: 151,
  },
  {
    id: "room-03",
    index: 4,
    code: "03",
    short: "Ruang 03",
    title: "Web & Interface",
    subtitle: "Pertemuan antara fungsi, bentuk, dan pengalaman.",
    range: "2025–2026 · 2 proyek",
    zBounds: [-42, -56],
    mapBox: { x: 30, y: 94, width: 72, height: 34 },
    dotY: 111,
  },
  {
    id: "room-04",
    index: 5,
    code: "04",
    short: "Ruang 04",
    title: "AI Product Visuals",
    subtitle:
      "Eksplorasi visual produk komersial menggunakan kecerdasan buatan generatif.",
    range: "Koleksi AI · 8 visual produk",
    zBounds: [-56, -70],
    mapBox: { x: 30, y: 54, width: 72, height: 34 },
    dotY: 71,
  },
  {
    id: "guestbook",
    index: 6,
    code: "05",
    short: "Guestbook",
    title: "Sign the guestbook",
    subtitle:
      "Tanyakan tentang proyek, kolaborasi, atau tinggalkan kesan kunjungan Anda.",
    range: "Buku Tamu · Kontak Langsung",
    zBounds: [-70, -82],
    mapBox: { x: 30, y: 18, width: 72, height: 30 },
    dotY: 33,
  },
];

export const interiorRooms = rooms.filter((r) => Boolean(r.code));

export const placements = featured.map((project, i) => ({
  id: `placement-${i + 1}`,
  project,
  x: i % 2 === 0 ? -6.72 : 6.72,
  z: [-10, -15, -20, -28, -33, -38, -46, -52][i],
  room: i < 3 ? 2 : i < 6 ? 3 : 4,
}));

export interface StationDefinition {
  id: string;
  position: [number, number, number];
  look: [number, number, number];
  room: number;
  project: number;
  roomOverview?: boolean;
  aiRoom?: boolean;
  guestbookRoom?: boolean;
}

const artStation = (i: number): StationDefinition => {
  const p = placements[i];
  return {
    id: `station-art-${i + 1}`,
    position: [p.x < 0 ? 1.5 : -1.5, 2.3, p.z + 4.3],
    look: [p.x, 2.3, p.z],
    room: p.room,
    project: i,
  };
};

export const stations: StationDefinition[] = [
  {
    id: "station-plaza",
    position: [31, 22, 42],
    look: [0, 1, -10],
    room: 0,
    project: -1,
  },
  {
    id: "station-lobby",
    position: [0, 2.22, 6.2],
    look: [0, 2.0, -5.5],
    room: 1,
    project: -1,
    roomOverview: true,
  },
  // Room 01 — Sorot ruangan terlebih dahulu, lalu ke tiap project (01-03)
  {
    id: "station-room-01",
    position: [0, 2.3, -5.8],
    look: [0, 2.2, -19.5],
    room: 2,
    project: -1,
    roomOverview: true,
  },
  artStation(0),
  artStation(1),
  artStation(2),
  // Room 02 — Sorot ruangan terlebih dahulu, lalu ke tiap project (04-06)
  {
    id: "station-room-02",
    position: [0, 2.3, -23.8],
    look: [0, 2.2, -37.5],
    room: 3,
    project: -1,
    roomOverview: true,
  },
  artStation(3),
  artStation(4),
  artStation(5),
  // Room 03 — Sorot ruangan terlebih dahulu, lalu ke tiap project (07-08)
  {
    id: "station-room-03",
    position: [0, 2.3, -41.8],
    look: [0, 2.2, -53.5],
    room: 4,
    project: -1,
    roomOverview: true,
  },
  artStation(6),
  artStation(7),
  // Room 04 — Sorot ruangan terlebih dahulu, lalu ke rak visual AI
  {
    id: "station-room-04",
    position: [0, 2.35, -55.8],
    look: [-1.8, 2.3, -67.5],
    room: 5,
    project: -1,
    roomOverview: true,
  },
  {
    id: "station-ai-visuals",
    position: [1.85, 2.55, -63],
    look: [-6.76, 2.65, -63],
    room: 5,
    project: -1,
    aiRoom: true,
  },
  // Room 05 — Guestbook
  {
    id: "station-guestbook",
    position: [-1.15, 2.05, -76.2],
    look: [0.35, 1.48, -81.8],
    room: 6,
    project: -1,
    roomOverview: true,
    guestbookRoom: true,
  },
];

export type LobbyViewpointId = "wide" | "board" | "desk";

export const lobbyViewpoints: Record<
  LobbyViewpointId,
  {
    id: LobbyViewpointId;
    label: string;
    position: [number, number, number];
    look: [number, number, number];
  }
> = {
  wide: {
    id: "wide",
    label: "Sudut lebar",
    position: [0, 2.22, 6.2],
    look: [0, 2.0, -5.5],
  },
  board: {
    id: "board",
    label: "Pandangan denah",
    position: [-1.45, 2.22, 0.2],
    look: [-4.55, 2.25, -1.9],
  },
  desk: {
    id: "desk",
    label: "Meja katalog",
    position: [1.15, 1.88, 0.45],
    look: [3.35, 1.22, -1.85],
  },
};

export const initialGuestbookEntries = [
  { text: "Wonderful show. — Ana R." },
  { text: "The blue room!" },
  { text: "Marta & João" },
  { text: "Back next spring, T." },
  { text: "Thank you. — L. Costa" },
  { text: "Bought a print :)" },
  { text: "Inês, Porto" },
  { text: "Lovely light here" },
];

export function getRoomEntryStation(roomIndex: number): number {
  const found = stations.findIndex((s) => s.room === roomIndex);
  return found >= 0 ? found : 0;
}

export function status(p: Project) {
  return p.title === "OCS EDU"
    ? "Dalam pengujian"
    : p.title === "Veyra Vision"
      ? "Prototipe · Data demo"
      : p.title.startsWith("VOLTX")
        ? "Simulator"
        : p.tech.includes("Figma") && p.tech.length < 3
          ? "Desain / prototipe"
          : "";
}

export function shortTitle(p: Project) {
  return p.title.split(" — ")[0].replace(" (OCS)", "");
}
