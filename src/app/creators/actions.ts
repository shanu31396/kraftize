"use server";

import { auth } from "../../../auth";
import prisma from "@/lib/prisma";

export async function createCreatorProfile(data: { storeName: string; bio: string; socialLink?: string }) {
  try {
    // 1. Verify the user is logged in
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "You must be logged in to create a store." };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { error: "User account not found." };
    }

    // 2. IMPORTANT: Check if the store name is already taken globally
    const existingStore = await prisma.creatorProfile.findUnique({
      where: { storeName: data.storeName }
    });

    // If it exists (even if it belongs to someone else), block it!
    if (existingStore) {
      return { error: `The store name "@${data.storeName}" is already taken. Please choose another.` };
    }

    // 3. Create the new store and attach it to this user
    await prisma.creatorProfile.create({
      data: {
        userId: user.id,
        storeName: data.storeName,
        bio: data.bio,
        socialLink: data.socialLink || null, // Optional field
      }
    });

    return { success: true };
    
  } catch (error) {
    console.error("Error creating store:", error);
    return { error: "Something went wrong saving your profile." };
  }
}