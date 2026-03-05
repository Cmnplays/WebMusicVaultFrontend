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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useRef } from "react";

// interface AccountData extends UserI {
//   uploadedSongs: number;
//   favouriteSongs: number;
// }

interface AccountData {
  avatar: string | null;
  username: string;
  email: string;
  isEmailVerified: boolean;
  displayName: string;
  uploadedSongs: number;
  favouriteSongs: number;
  role: "user" | "admin";
}

const MOCK: AccountData = {
  avatar: null,
  username: "aaditya_dev",
  email: "aaditya@example.com",
  isEmailVerified: true,
  displayName: "Aaditya Sharma",
  uploadedSongs: 12,
  favouriteSongs: 48,
  role: "user",
};

interface AccountPageProps {
  data: AccountData;
}

export default function AccountCard({ data = MOCK }: AccountPageProps) {
  console.log({ data });
  const [isEditing, setIsEditing] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const initials = data.displayName.includes(" ")
    ? data.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : data.displayName[0];

  const avatarSrc = previewAvatar ?? data.avatar;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewAvatar(url);
    // TODO: upload logic here
  };

  return (
    <>
      <div className="min-h-screen bg-background px-4 py-6 md:px-8">
        <div className="max-w-lg mx-auto flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">My Account</h1>
            <Button
              variant={isEditing ? "ghost" : "outline"}
              size="sm"
              onClick={() => {
                setIsEditing(!isEditing);
                setPreviewAvatar(null);
              }}
              className="gap-1.5"
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
          <Card>
            <CardContent className="pt-6 flex flex-col items-center gap-3 text-center">
              {/* Avatar */}
              <div className="relative">
                {avatarSrc ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border">
                    <Image
                      src={avatarSrc}
                      alt={data.displayName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-muted border-2 border-border flex items-center justify-center text-xl font-bold text-muted-foreground">
                    {initials}
                  </div>
                )}
                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </>
                )}
              </div>

              {!isEditing && (
                <>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {data.displayName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      @{data.username}
                    </p>
                  </div>
                  <Badge variant="secondary" className="uppercase text-xs">
                    {data.role}
                  </Badge>
                </>
              )}
            </CardContent>
          </Card>

          {/* Edit form */}
          {isEditing && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    defaultValue={data.displayName}
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Leave blank to keep current"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {/* Info card */}
          {!isEditing && (
            <Card>
              <CardContent className="pt-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground truncate">
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
                  <Music2 className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Username</p>
                    <p className="text-sm font-medium text-foreground">
                      @{data.username}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {data.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats card */}
          {!isEditing && (
            <Card>
              <CardContent className="pt-6 grid grid-cols-2 gap-4 text-center">
                <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <p className="text-2xl font-bold text-foreground">
                    {data.uploadedSongs}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded Songs
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50">
                  <Heart className="w-5 h-5 text-muted-foreground" />
                  <p className="text-2xl font-bold text-foreground">
                    {data.favouriteSongs}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Favourite Songs
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
