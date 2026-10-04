"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../../utils/supabase/server";

export async function rateRole(
  castRoleId: number,
  titleId: number,
  score: number
) {
  if (!Number.isInteger(score) || score < 1 || score > 10) {
    return { error: "Score must be a whole number from 1 to 10." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to rate." };
  }

  const { error } = await supabase
    .from("performance_ratings")
    .upsert(
      { user_id: user.id, cast_role_id: castRoleId, score },
      { onConflict: "user_id,cast_role_id" }
    );

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/title/${titleId}`);
  return { error: null };
}

export async function submitScreenTime(
  castRoleId: number,
  titleId: number,
  minutes: number
) {
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 300) {
    return { error: "Enter whole minutes between 1 and 300." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to add screen time." };
  }

  const { error } = await supabase
    .from("screen_time_entries")
    .upsert(
      { user_id: user.id, cast_role_id: castRoleId, minutes },
      { onConflict: "user_id,cast_role_id" }
    );

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/title/${titleId}`);
  return { error: null };
}