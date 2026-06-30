import * as profileRepository from "./profile.repository";
import type {
  Profile,
  ProfileFormValues,
  ProfileResult,
  UpdateProfileDto,
} from "@/types/profile";

export async function getProfile(
  userId: string,
): Promise<ProfileResult<Profile | null>> {
  try {
    const profile = await profileRepository.findProfileById(userId);
    return { data: profile, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "프로필 조회 실패";
    return { data: null, error: message };
  }
}

export async function updateProfile(
  userId: string,
  formValues: ProfileFormValues,
): Promise<ProfileResult<Profile>> {
  const dto: UpdateProfileDto = {
    username: formValues.username.trim() || null,
    full_name: formValues.full_name.trim() || null,
    avatar_url: formValues.avatar_url.trim() || null,
    bio: formValues.bio.trim() || null,
  };

  try {
    const profile = await profileRepository.upsertProfile(userId, dto);
    return { data: profile, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "프로필 저장 실패";
    return { data: null, error: message };
  }
}
