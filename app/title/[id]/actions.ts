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

export async function rateMovie(titleId: number, score: number) {
  if (!Number.isInteger(score) || score < 1 || score > 100) {
    return { error: "Movie-RangeScore must be a whole number from 1 to 100." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to rate this movie." };
  }

  const { error } = await supabase.from("movie_ratings").upsert(
    { user_id: user.id, title_id: titleId, score },
    { onConflict: "user_id,title_id" }
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

export async function saveReview(titleId: number, body: string) {
  const text = body.trim();

  if (text.length < 10 || text.length > 1000) {
    return { error: "Review must be between 10 and 1000 characters." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to write a review." };
  }

  const fullName = (user.user_metadata?.full_name as string | undefined) ?? "";
  const authorName = fullName.trim().split(" ")[0] || "Anonymous";

  const { error } = await supabase.from("reviews").upsert(
    {
      user_id: user.id,
      title_id: titleId,
      author_name: authorName,
      body: text,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,title_id" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/title/${titleId}`);
  return { error: null };
}

export async function deleteReview(titleId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in first." };
  }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("title_id", titleId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/title/${titleId}`);
  return { error: null };
}