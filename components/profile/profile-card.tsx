import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types/profile";

interface ProfileCardProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const initial =
    profile.full_name?.[0]?.toUpperCase() ??
    profile.email?.[0]?.toUpperCase() ??
    "?";

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-bold text-muted-foreground">
          {initial}
        </div>
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl">
            {profile.full_name ?? "이름 없음"}
          </CardTitle>
          {profile.username && (
            <Badge variant="secondary">@{profile.username}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {profile.email && (
          <div className="text-sm text-muted-foreground">{profile.email}</div>
        )}
        {profile.bio && (
          <p className="text-sm leading-relaxed">{profile.bio}</p>
        )}
        <div className="text-xs text-muted-foreground">
          가입일: {new Date(profile.created_at).toLocaleDateString("ko-KR")}
        </div>
      </CardContent>
    </Card>
  );
}
