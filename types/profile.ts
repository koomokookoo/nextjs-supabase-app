import type { Database } from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type UpdateProfileDto = {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

export type ProfileFormValues = {
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
};

export type ProfileResult<T> =
  { data: T; error: null } | { data: null; error: string };
