import {
  projects as fallbackProjects,
  aiVisuals as fallbackAiVisuals,
} from "../content";
import type { Project, AiVisual } from "../content";

interface ApiProjectLink {
  label?: string;
  url?: string;
  href?: string;
}

interface ApiProjectItem {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  overview?: string;
  role?: string;
  services?: string;
  year?: string;
  categories?: string[];
  tech?: string[];
  cover?: string;
  image?: string;
  images?: string[];
  gallery?: string[];
  links?: ApiProjectLink[];
  caseStudy?: string;
}

interface ApiVisualItem {
  id?: string;
  order?: number;
  title?: string;
  shelf?: number;
  slot?: number;
  texture?: string;
  image?: string;
  width?: number;
  height?: number;
  aspect?: number;
  alt?: string;
  label?: string;
  caption?: string;
  catalogUrl?: string;
}

interface PortfolioApiResponse {
  success?: boolean;
  projects?: ApiProjectItem[];
  data?: ApiProjectItem[];
  aiVisuals?: (ApiVisualItem | string)[];
}

const SHELF_MAP = [
  { shelf: 0, slot: 0 },
  { shelf: 0, slot: 1 },
  { shelf: 0, slot: 2 },
  { shelf: 1, slot: 0 },
  { shelf: 1, slot: 1 },
  { shelf: 1, slot: 2 },
  { shelf: 2, slot: 0 },
  { shelf: 2, slot: 1 },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function toRelativeAssetUrl(url?: string): string {
  if (!url) return "";
  // Ubah URL domain absolut rofiull menjadi relative /assets/portofolio/ agar fleksibel di dev maupun prod
  return url.replace(/^https?:\/\/[^/]+(\/assets\/portofolio\/)/, "$1");
}

/**
 * Menyesuaikan response dari /api/portfolio (project rofiull) ke struktur 3d-gallery
 * dengan mengutamakan aset gambar yang dikirim langsung dari API rofiull.
 */
export function normalizePortfolioPayload(payload: PortfolioApiResponse): {
  projects: Project[];
  aiVisuals: AiVisual[];
} {
  const rawProjects = Array.isArray(payload.projects)
    ? payload.projects
    : Array.isArray(payload.data)
      ? payload.data
      : [];

  const localProjectById = new Map<string, Project>();
  for (const lp of fallbackProjects) {
    localProjectById.set(lp.id, lp);
    localProjectById.set(slugify(lp.title), lp);
  }

  const normalizedProjects: Project[] =
    rawProjects.length > 0
      ? rawProjects.map((item, idx) => {
          const title = item.title || fallbackProjects[idx]?.title || "Project";
          const id = item.id || item.slug || slugify(title);
          const localMatch =
            localProjectById.get(id) ||
            localProjectById.get(slugify(title)) ||
            fallbackProjects.find((p) => p.title === title);

          const rawCover = item.cover || item.image || "";
          const apiCover = toRelativeAssetUrl(rawCover);
          const rawImages = Array.isArray(item.images)
            ? item.images
            : Array.isArray(item.gallery)
              ? [rawCover, ...item.gallery].filter(Boolean)
              : rawCover
                ? [rawCover]
                : [];
          const apiImages = rawImages.map(toRelativeAssetUrl).filter(Boolean);

          // Utamakan gambar yang dikirim dari API rofiull
          const cover = apiCover || localMatch?.cover || "";
          const images =
            apiImages.length > 0
              ? apiImages
              : localMatch && localMatch.images.length > 0
                ? localMatch.images
                : [];

          return {
            id,
            title,
            description: item.description ?? localMatch?.description ?? "",
            overview: item.overview ?? localMatch?.overview ?? "",
            role: item.role ?? item.services ?? localMatch?.role ?? "",
            year: item.year ?? localMatch?.year ?? "",
            categories:
              Array.isArray(item.categories) && item.categories.length > 0
                ? item.categories
                : (localMatch?.categories ?? []),
            tech:
              Array.isArray(item.tech) && item.tech.length > 0
                ? item.tech
                : (localMatch?.tech ?? []),
            cover,
            images,
            links: Array.isArray(item.links)
              ? item.links.map((l) => {
                  const targetUrl = l.url || l.href || "";
                  return {
                    label: l.label || "Tautan",
                    url: targetUrl,
                    href: targetUrl,
                  };
                })
              : (localMatch?.links ?? []),
            caseStudy:
              item.caseStudy ||
              localMatch?.caseStudy ||
              `https://rofiull.vercel.app/portfolio/${id}`,
          };
        })
      : fallbackProjects;

  const rawVisuals = Array.isArray(payload.aiVisuals) ? payload.aiVisuals : [];

  const normalizedAiVisuals: AiVisual[] =
    rawVisuals.length > 0
      ? rawVisuals.map((item, i) => {
          const num = String(i + 1).padStart(2, "0");
          const localVisual = fallbackAiVisuals[i];
          const layout = SHELF_MAP[i] || { shelf: 2, slot: Math.max(0, i - 6) };

          // Jika API hanya mengirim string URL gambar atau objek visual
          const isString = typeof item === "string";
          const vObj: ApiVisualItem = isString
            ? { image: item, texture: item }
            : item;

          const apiTexture = toRelativeAssetUrl(vObj.texture || vObj.image || "");
          const apiImage = toRelativeAssetUrl(vObj.image || vObj.texture || "");

          return {
            id: vObj.id || localVisual?.id || `ai-visual-${num}`,
            order: vObj.order ?? localVisual?.order ?? i + 1,
            title: vObj.title || localVisual?.title || `AI Product Visual ${num}`,
            shelf: vObj.shelf ?? localVisual?.shelf ?? layout.shelf,
            slot: vObj.slot ?? localVisual?.slot ?? layout.slot,
            // Utamakan gambar dari API rofiull (/assets/portofolio/product-ai/...)
            texture: apiTexture || localVisual?.texture || "",
            image: apiImage || localVisual?.image || "",
            width: vObj.width ?? localVisual?.width ?? 1200,
            height: vObj.height ?? localVisual?.height ?? 1200,
            aspect: vObj.aspect ?? localVisual?.aspect ?? 1,
            alt:
              vObj.alt ||
              localVisual?.alt ||
              `AI Product Visual ${num} — Eksplorasi visual produk berbantuan AI`,
            label: vObj.label || localVisual?.label || "Karya berbantuan AI",
            caption:
              vObj.caption ||
              localVisual?.caption ||
              "Koleksi visual produk komersial pilihan yang dibuat dengan kecerdasan buatan generatif.",
            catalogUrl:
              vObj.catalogUrl ||
              localVisual?.catalogUrl ||
              "https://lynk.id/rofiull",
          };
        })
      : fallbackAiVisuals;

  return {
    projects: normalizedProjects,
    aiVisuals: normalizedAiVisuals,
  };
}

/**
 * Mengambil data portofolio & visual AI dari endpoint API project rofiull (/api/portfolio).
 * Mendukung endpoint lokal Vite middleware (/api/portfolio), custom env VITE_PORTFOLIO_API_URL,
 * maupun fallback ke https://rofiull.vercel.app/api/portfolio.
 */
export async function fetchPortfolioFromApi(lang: "id" | "en" = "id"): Promise<{
  projects: Project[];
  aiVisuals: AiVisual[];
  fromApi: boolean;
}> {
  const customUrl = (
    import.meta as { env?: Record<string, string | undefined> }
  ).env?.VITE_PORTFOLIO_API_URL;
  const candidateUrls = [
    customUrl ? `${customUrl.replace(/\/+$/, "")}?lang=${lang}` : null,
    `/api/portfolio?lang=${lang}`,
    `https://rofiull.vercel.app/api/portfolio?lang=${lang}`,
  ].filter(Boolean) as string[];

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) continue;
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) continue;

      const json = (await response.json()) as PortfolioApiResponse;
      if (
        json &&
        (Array.isArray(json.projects) ||
          Array.isArray(json.data) ||
          Array.isArray(json.aiVisuals))
      ) {
        const normalized = normalizePortfolioPayload(json);
        return {
          ...normalized,
          fromApi: true,
        };
      }
    } catch {
      // Lanjut ke kandidat URL berikutnya atau fallback lokal
    }
  }

  return {
    projects: fallbackProjects,
    aiVisuals: fallbackAiVisuals,
    fromApi: false,
  };
}
