"use server";

import { updateTag } from "next/cache";
import { createAuthenticatedSupabase, requireAdminUserForAction } from "./admin-auth";
import { isServiceRoleConfigured } from "./supabase";
import { Project, Certificate, PORTFOLIO_CACHE_TAG } from "./portfolio-data";

function throwActionError(action: string, error: { code?: string; message: string }) {
  if (error.code === "42501") {
    if (isServiceRoleConfigured) {
      throw new Error(`${action} failed due to a database RLS permission error.`);
    }

    throw new Error(
      `${action} failed: missing write access for anon key. Configure SUPABASE_SERVICE_ROLE_KEY for server actions or add explicit write policies/grants.`,
    );
  }

  throw new Error(`${action} failed: ${error.message}`);
}

export async function addProject(project: Project) {
  const { accessToken } = await requireAdminUserForAction();
  const supabase = createAuthenticatedSupabase(accessToken);

  const { error } = await supabase.from("ljds_projects").insert([
    {
      title: project.title,
      description: project.description,
      time_saved: project.timeSaved,
      cost_saved: project.costSaved,
      tags: project.tags,
      video_url: project.videoUrl,
      preview_image: project.previewImage,
      detailed_description: project.detailedDescription,
    },
  ]);

  if (error) throwActionError("Add project", error);
  updateTag(PORTFOLIO_CACHE_TAG);
}

export async function updateProject(id: string, project: Project) {
  const { accessToken } = await requireAdminUserForAction();
  const supabase = createAuthenticatedSupabase(accessToken);

  const { error } = await supabase
    .from("ljds_projects")
    .update({
      title: project.title,
      description: project.description,
      time_saved: project.timeSaved,
      cost_saved: project.costSaved,
      tags: project.tags,
      video_url: project.videoUrl,
      preview_image: project.previewImage,
      detailed_description: project.detailedDescription,
    })
    .eq("id", id);

  if (error) throwActionError("Update project", error);
  updateTag(PORTFOLIO_CACHE_TAG);
}

export async function deleteProject(id: string) {
  const { accessToken } = await requireAdminUserForAction();
  const supabase = createAuthenticatedSupabase(accessToken);

  const { error } = await supabase.from("ljds_projects").delete().eq("id", id);
  if (error) throwActionError("Delete project", error);
  updateTag(PORTFOLIO_CACHE_TAG);
}

export async function addCertificate(certificate: Certificate) {
  const { accessToken } = await requireAdminUserForAction();
  const supabase = createAuthenticatedSupabase(accessToken);

  const { error } = await supabase.from("ljds_certificates").insert([
    {
      id: certificate.id,
      title: certificate.title,
      provider: certificate.provider,
      issued_date: certificate.issuedDate,
      credential_id: certificate.credentialId,
      categories: certificate.categories,
      skills: certificate.skills,
      image_url: certificate.imageUrl,
      external_url: certificate.externalUrl,
    },
  ]);

  if (error) throwActionError("Add certificate", error);
  updateTag(PORTFOLIO_CACHE_TAG);
}

export async function updateCertificate(id: string, certificate: Certificate) {
  const { accessToken } = await requireAdminUserForAction();
  const supabase = createAuthenticatedSupabase(accessToken);

  const { error } = await supabase
    .from("ljds_certificates")
    .update({
      title: certificate.title,
      provider: certificate.provider,
      issued_date: certificate.issuedDate,
      credential_id: certificate.credentialId,
      categories: certificate.categories,
      skills: certificate.skills,
      image_url: certificate.imageUrl,
      external_url: certificate.externalUrl,
    })
    .eq("id", id);

  if (error) throwActionError("Update certificate", error);
  updateTag(PORTFOLIO_CACHE_TAG);
}

export async function deleteCertificate(id: string) {
  const { accessToken } = await requireAdminUserForAction();
  const supabase = createAuthenticatedSupabase(accessToken);

  const { error } = await supabase.from("ljds_certificates").delete().eq("id", id);
  if (error) throwActionError("Delete certificate", error);
  updateTag(PORTFOLIO_CACHE_TAG);
}
