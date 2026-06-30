import { createClient } from "@/lib/supabase/server";
import type { Profile, UpdateProfileDto } from "@/types/profile";

export async function findProfileById(userId: string): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  return data;
}

export async function upsertProfile(
  userId: string,
  dto: UpdateProfileDto,
): Promise<Profile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      { id: userId, ...dto, updated_at: new Date().toISOString() },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) {
    if (error.code === "23505")
      throw new Error("이미 사용 중인 사용자명입니다.");
    throw new Error(error.message);
  }

  return data;
}
