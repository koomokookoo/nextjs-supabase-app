"use server";

import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/profile/profile.service";
import type {
  Profile,
  ProfileFormValues,
  ProfileResult,
} from "@/types/profile";

export async function updateProfileAction(
  values: ProfileFormValues,
): Promise<ProfileResult<Profile>> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return { data: null, error: "인증 정보를 확인할 수 없습니다." };
  }

  return updateProfile(data.claims.sub, values);
}
