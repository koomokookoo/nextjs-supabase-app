import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile/profile.service";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfileForm } from "@/components/profile/profile-form";

async function ProfileContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const userId = data.claims.sub;
  const result = await getProfile(userId);

  if (result.error) {
    return (
      <div className="text-sm text-red-500">
        프로필을 불러올 수 없습니다: {result.error}
      </div>
    );
  }

  if (!result.data) {
    return (
      <div className="text-sm text-muted-foreground">
        프로필을 찾을 수 없습니다. 다시 로그인해주세요.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 items-start">
      <ProfileCard profile={result.data} />
      <ProfileForm initialProfile={result.data} />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">내 프로필</h2>
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground">로딩 중...</div>
          }
        >
          <ProfileContent />
        </Suspense>
      </div>
    </div>
  );
}
