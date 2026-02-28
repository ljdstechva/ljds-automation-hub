import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { supabase } from "./supabase";

export type NavigationItem = {
  id: string;
  label: string;
};

export type Specialization = {
  id?: string;
  title: string;
  description: string;
  icon: "workflow" | "sparkles" | "trending";
};

export type ToolItem = {
  id?: string;
  name: string;
  logo: string;
  description: string;
  filterTag: string;
};

export type Project = {
  id?: string;
  title: string;
  description: string;
  timeSaved: string;
  costSaved: string;
  tags: string[];
  videoUrl: string;
  previewImage: string;
  detailedDescription: string[];
};

export type Certificate = {
  id: string;
  title: string;
  provider: string;
  issuedDate: string;
  credentialId: string;
  categories: string[];
  skills: string[];
  imageUrl: string;
  externalUrl: string;
};

export type PortfolioData = {
  navigation: NavigationItem[];
  heroTitles: string[];
  specializations: Specialization[];
  tools: ToolItem[];
  projects: Project[];
  projectFilterTags: string[];
  certificates: Certificate[];
  certificateFilters: string[];
};

type PortfolioContent = Omit<PortfolioData, "navigation" | "projectFilterTags" | "certificateFilters">;

export const PORTFOLIO_CACHE_TAG = "portfolio-data-v2";

const navigation: NavigationItem[] = [
  { id: "home", label: "Home" },
  { id: "specialization", label: "Specialization" },
  { id: "about", label: "About" },
  { id: "tools", label: "Tools" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const DEFAULT_TOOL_LOGO = "/media/tools/prompt.svg";

function resolveToolLogo(rawLogo: string | null): string {
  if (!rawLogo) {
    return DEFAULT_TOOL_LOGO;
  }

  const value = rawLogo.trim();
  return value.length > 0 ? value : DEFAULT_TOOL_LOGO;
}

function emptyPortfolioContent(): PortfolioContent {
  return {
    heroTitles: [],
    specializations: [],
    tools: [],
    projects: [],
    certificates: [],
  };
}

function withDerivedFilters(data: PortfolioContent): PortfolioData {
  const projectFilterTags = ["All", ...new Set(data.projects.flatMap((project) => project.tags))];
  const certificateFilters = ["All", ...new Set(data.certificates.flatMap((certificate) => certificate.categories))];

  return {
    navigation,
    ...data,
    projectFilterTags,
    certificateFilters,
  };
}

async function readFromSupabase(): Promise<PortfolioContent> {
  const [heroRes, specRes, toolRes, projRes, certRes] = await Promise.all([
    supabase.from("ljds_hero_titles").select("title").order("sort_order"),
    supabase.from("ljds_specializations").select("*").order("sort_order"),
    supabase.from("ljds_tools").select("*").order("sort_order"),
    supabase.from("ljds_projects").select("*").order("sort_order"),
    supabase.from("ljds_certificates").select("*").order("sort_order"),
  ]);

  if (heroRes.error) throw heroRes.error;
  if (specRes.error) throw specRes.error;
  if (toolRes.error) throw toolRes.error;
  if (projRes.error) throw projRes.error;
  if (certRes.error) throw certRes.error;

  return {
    heroTitles: (heroRes.data ?? []).map((hero) => hero.title),
    specializations: (specRes.data ?? []).map((specialization) => ({
      id: specialization.id,
      icon: specialization.icon as Specialization["icon"],
      title: specialization.title,
      description: specialization.description,
    })),
    tools: (toolRes.data ?? []).map((tool) => ({
      id: tool.id,
      name: tool.name,
      logo: resolveToolLogo(tool.logo),
      description: tool.description,
      filterTag: tool.filter_tag,
    })),
    projects: (projRes.data ?? []).map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      timeSaved: project.time_saved,
      costSaved: project.cost_saved,
      tags: project.tags || [],
      videoUrl: project.video_url,
      previewImage: project.preview_image,
      detailedDescription: project.detailed_description || [],
    })),
    certificates: (certRes.data ?? []).map((certificate) => ({
      id: certificate.id,
      title: certificate.title,
      provider: certificate.provider,
      issuedDate: certificate.issued_date,
      credentialId: certificate.credential_id,
      categories: certificate.categories || [],
      skills: certificate.skills || [],
      imageUrl: certificate.image_url,
      externalUrl: certificate.external_url,
    })),
  };
}

async function getCachedPortfolioContent(): Promise<PortfolioContent> {
  "use cache";
  cacheTag(PORTFOLIO_CACHE_TAG);
  cacheLife("hours");
  return readFromSupabase();
}

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    return withDerivedFilters(await getCachedPortfolioContent());
  } catch (error) {
    console.error("Error fetching cached portfolio data:", error);
    return withDerivedFilters(emptyPortfolioContent());
  }
}

export async function getPortfolioDataUncached(): Promise<PortfolioData> {
  try {
    return withDerivedFilters(await readFromSupabase());
  } catch (error) {
    console.error("Error fetching uncached portfolio data:", error);
    return withDerivedFilters(emptyPortfolioContent());
  }
}
