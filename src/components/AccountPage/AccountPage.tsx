"use client";
import Image from "next/image";
import {
  Mail,
  CircleCheck,
  CircleX,
  Music2,
  Heart,
  Upload,
  Shield,
  Pencil,
  X,
  Camera,
  Lock,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React, { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateUserSchema,
  UpdateUserSchemaType,
} from "@/lib/schemas/user.schema";
import { useAppDispatch } from "@/store/hook";
import { setUserData } from "@/reduxSlices/auth.slice";
import {
  updateUser,
  UpdateUserPayload,
} from "@/services/user.services";
import { showToast } from "@/hooks/useToast";

interface AccountPageProps {
  data: UserProfileI;
}

export default function AccountCard({ data }: AccountPageProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  // Tracks the current blob URL so it can be revoked (SongEditForm pattern).
  const previewUrlRef = useRef<string | null>(null);

  // Same RHF + zod setup as the signup flow. Values are re-seeded from the
  // latest store data every time edit mode is entered, so a save from a
  // previous session can never leak stale text into the inputs.
  const form = useForm<UpdateUserSchemaType>({
    resolver: zodResolver(updateUserSchema),
    mode: "onBlur",
    defaultValues: {
      displayName: data?.displayName ?? "",
      username: data?.username ?? "",
    },
  });
  const { errors } = useFormState({ control: form.control });

  // Cleanup-only effect: releases the blob URL when this page unmounts.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  if (!data) return null;

  const initials = data.displayName?.includes(" ")
    ? data.displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : data.displayName?.[0] || data.username[0]?.toUpperCase() || "U";

  const avatarSrc = previewAvatar ?? data.avatar;

  const clearAvatarPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewAvatar(null);
    setAvatarFile(null);
  };

  // Mirrors backend MAX_COVER_IMAGE_FILE_SIZE (10 MB) so oversized avatars
  // are rejected instantly instead of after a full upload round-trip.
  const MAX_AVATAR_FILE_SIZE = 10 * 1024 * 1024;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset the input so picking the same file again still fires onChange.
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_AVATAR_FILE_SIZE) {
      showToast({
        message: "Image is too large. Maximum allowed size is 10 MB",
        type: "error",
      });
      return;
    }
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setAvatarFile(file);
    setPreviewAvatar(url);
  };

  const resetFormValues = () => {
    form.reset({
      displayName: data.displayName ?? "",
      username: data.username ?? "",
    });
  };

  const exitEditMode = () => {
    clearAvatarPreview();
    resetFormValues();
    setIsEditing(false);
  };

  const toggleEdit = () => {
    if (isEditing) {
      exitEditMode();
    } else {
      resetFormValues();
      setIsEditing(true);
    }
  };

  const onProfileSubmit: SubmitHandler<UpdateUserSchemaType> = async (
    values,
  ) => {
    // zod has already trimmed both fields (and we lowercase the username to
    // match the backend) so unchanged values compare cleanly.
    const payload: UpdateUserPayload = {};
    if (values.displayName !== (data.displayName ?? "").trim()) {
      payload.displayName = values.displayName;
    }
    if (values.username !== (data.username ?? "").toLowerCase()) {
      payload.username = values.username;
    }
    if (avatarFile) payload.avatar = avatarFile;

    // Nothing changed -> just close the form (SongEditForm pattern).
    if (!payload.displayName && !payload.username && !payload.avatar) {
      exitEditMode();
      return;
    }

    setSaving(true);
    try {
      const updated = await updateUser(payload);
      dispatch(setUserData(updated));
      clearAvatarPreview();
      resetFormValues();
      setIsEditing(false);
      showToast({ message: "Profile updated successfully", type: "success" });
    } catch (err) {
      const apiError = err as ApiError;
      showToast({
        message: apiError.response?.data.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#5520A5] pt-2 pb-6 px-4 md:px-8">
        <div className="max-w-lg mx-auto flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">My Account</h1>
              <p className="text-xs text-purple-300/70 mt-0.5">
                Your profile &amp; stats
              </p>
            </div>
            <Button
              variant={isEditing ? "ghost" : "outline"}
              size="sm"
              onClick={toggleEdit}
              disabled={saving}
              className={`gap-1.5 ${
                isEditing
                  ? "text-white/70 hover:text-white hover:bg-white/5"
                  : "border-purple-400/40 text-purple-200 hover:bg-purple-600/30 hover:text-white"
              }`}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" /> Cancel
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4" /> Edit Profile
                </>
              )}
            </Button>
          </div>

          {/* Avatar + name card */}
          <Card className="rounded-2xl border-white/10 bg-gradient-to-tr from-purple-900/60 via-[#6b30c2]/40 to-purple-800/40 shadow-lg shadow-purple-950/30">
            <CardContent className="pt-6 flex flex-col items-center gap-3 text-center">
              {/* Avatar */}
              <div className="relative">
                {avatarSrc ? (
                  <div className="relative w-28 h-28 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-purple-400/40">
                    <Image
                      src={avatarSrc}
                      alt={data.displayName}
                      fill
                      // blob: preview URLs bypass next/image's optimizer
                      // (SongRow.tsx convention for local previews).
                      unoptimized={Boolean(previewAvatar)}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 md:w-24 md:h-24 rounded-full bg-purple-600/40 border-2 border-purple-400/40 flex items-center justify-center text-3xl md:text-xl font-bold text-purple-100">
                    {initials}
                  </div>
                )}
                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      aria-label="Change profile picture"
                      className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="w-6 h-6 text-white" aria-hidden="true" />
                    </button>
                    {/* Always-visible affordance: the hover overlay above is
                        unreachable on touch devices, so mobile users get a
                        camera badge pinned to the avatar. */}
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      aria-label="Change profile picture"
                      className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-purple-600 border-2 border-[#5520A5] flex items-center justify-center shadow-md cursor-pointer hover:bg-purple-500 active:scale-95 transition-all"
                    >
                      <Camera className="w-4 h-4 text-white" aria-hidden="true" />
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      aria-label="Upload profile picture"
                      onChange={handleAvatarChange}
                    />
                  </>
                )}
              </div>

              {isEditing && (
                <p className="text-xs text-purple-200/70 -mt-1 text-center">
                  Tap the camera to change your photo 📸
                  <br />
                  Under 10 MB please :)
                </p>
              )}

              {!isEditing && (
                <>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {data.displayName}
                    </h2>
                    <p className="text-sm text-purple-200/80">
                      @{data.username}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-600/40 border border-purple-400/40 text-purple-100 text-[11px] font-semibold uppercase tracking-wide">
                    {data.role}
                  </span>
                </>
              )}
            </CardContent>
          </Card>

          {/* Edit form */}
          {isEditing && (
            <Card className="rounded-2xl border-white/10 bg-gradient-to-tr from-purple-900/95 via-purple-800/95 to-purple-700/95">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white">Edit Profile</CardTitle>
                <p className="text-xs text-purple-200/70">
                  You can change your display name, username and profile photo.
                </p>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={form.handleSubmit(onProfileSubmit)}
                  noValidate
                  className="flex flex-col gap-4"
                >
                  {/* Email is shown read-only so users know it's intentionally
                      not editable, not missing from the form. */}
                  <Field>
                    <FieldLabel
                      htmlFor="email"
                      className="text-purple-200/70"
                    >
                      Email
                    </FieldLabel>
                    <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 opacity-75">
                      <Mail className="w-4 h-4 text-purple-300 shrink-0" aria-hidden="true" />
                      <span className="text-sm text-white/80 truncate flex-1">
                        {data.email}
                      </span>
                      <Lock
                        className="w-3.5 h-3.5 text-purple-300/70 shrink-0"
                        aria-label="Locked"
                      />
                    </div>
                    <FieldDescription>Email can&apos;t be changed.</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="displayName">Display Name</FieldLabel>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Your display name"
                      maxLength={30}
                      className="rounded-xl bg-white/5 border-white/10 text-white placeholder-white/20 focus-visible:ring-purple-400/50"
                      {...form.register("displayName")}
                    />
                    <FieldDescription>2–30 characters.</FieldDescription>
                    {errors.displayName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.displayName.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Your username"
                      maxLength={30}
                      className="rounded-xl bg-white/5 border-white/10 text-white placeholder-white/20 focus-visible:ring-purple-400/50"
                      {...form.register("username")}
                    />
                    <FieldDescription>
                      Letters, numbers, dots and underscores only.
                    </FieldDescription>
                    {errors.username && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.username.message}
                      </p>
                    )}
                  </Field>
                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-white text-purple-900 font-bold hover:bg-purple-100"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Info card */}
          {!isEditing && (
            <Card className="rounded-xl border-white/10 bg-[#6b30c2]/40">
              <CardContent className="pt-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-purple-300 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-purple-200/70">Email</p>
                    <p className="text-sm font-medium text-white truncate">
                      {data.email}
                    </p>
                  </div>
                  {data.isEmailVerified ? (
                    <CircleCheck className="w-4 h-4 text-green-500 shrink-0" />
                  ) : (
                    <CircleX className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Music2 className="w-4 h-4 text-purple-300 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-purple-200/70">Username</p>
                    <p className="text-sm font-medium text-white">
                      @{data.username}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-purple-300 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-purple-200/70">Role</p>
                    <p className="text-sm font-medium text-white capitalize">
                      {data.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats card */}
          {!isEditing && (
            <Card className="rounded-xl border-white/10 bg-[#6b30c2]/40">
              <CardContent className="pt-6 grid grid-cols-2 gap-4 text-center">
                <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Upload className="w-5 h-5 text-purple-300" />
                  <p className="text-2xl font-bold text-white">
                    {data.uploadedSongs ?? 0}
                  </p>
                  <p className="text-xs text-purple-200/70">
                    Uploaded Songs
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Heart className="w-5 h-5 text-rose-400" />
                  <p className="text-2xl font-bold text-white">
                    {data.favouriteSongs ?? 0}
                  </p>
                  <p className="text-xs text-purple-200/70">
                    Favourite Songs
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analytics — placeholder for v3 */}
          {!isEditing && (
            <Card className="rounded-xl border-white/10 bg-[#6b30c2]/40">
              <CardContent className="pt-6 flex flex-col items-center justify-center gap-4 py-10 text-center">
                <div className="w-14 h-14 rounded-full bg-purple-500/15 flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-purple-300" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-base font-semibold text-white">
                    Analytics
                  </p>
                  <p className="text-sm text-purple-200/70">
                    Coming in v3
                  </p>
                </div>
                <p className="text-xs text-purple-200/70 max-w-xs">
                  Track your listening habits, top artists, and more — coming
                  soon in the next version.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
