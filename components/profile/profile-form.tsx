"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { updateProfileAction } from "@/app/protected/profile/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Profile } from "@/types/profile";

const profileSchema = z.object({
  username: z
    .string()
    .max(30, "사용자명은 30자 이하여야 합니다.")
    .regex(/^[a-zA-Z0-9_]*$/, "영문, 숫자, 언더스코어만 사용 가능합니다.")
    .or(z.literal("")),
  full_name: z.string().max(100, "이름은 100자 이하여야 합니다.").or(z.literal("")),
  avatar_url: z
    .string()
    .url("올바른 URL 형식이어야 합니다.")
    .or(z.literal("")),
  bio: z.string().max(500, "소개는 500자 이하여야 합니다.").or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialProfile: Profile;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: initialProfile.username ?? "",
      full_name: initialProfile.full_name ?? "",
      avatar_url: initialProfile.avatar_url ?? "",
      bio: initialProfile.bio ?? "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    const result = await updateProfileAction(values);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    setSuccessMessage("프로필이 저장되었습니다.");
    router.refresh();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">프로필 편집</CardTitle>
        <CardDescription>공개 프로필 정보를 수정합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">사용자명</Label>
              <Input
                id="username"
                placeholder="your_username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="full_name">이름</Label>
              <Input
                id="full_name"
                placeholder="홍길동"
                {...register("full_name")}
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avatar_url">아바타 URL</Label>
              <Input
                id="avatar_url"
                type="url"
                placeholder="https://example.com/avatar.png"
                {...register("avatar_url")}
              />
              {errors.avatar_url && (
                <p className="text-sm text-red-500">{errors.avatar_url.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">소개</Label>
              <Textarea
                id="bio"
                placeholder="자신을 소개해주세요..."
                rows={4}
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-red-500">{serverError}</p>
            )}
            {successMessage && (
              <p className="text-sm text-green-600">{successMessage}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
