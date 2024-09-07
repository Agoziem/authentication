import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUserById = unstable_cache(
  async (id: string) => {
    try {
      const user = await db.user.findUnique({
        where: { id },
      });

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  ["user", "id"],
  {
    tags: ["user"],
  }
);

export const createUser = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const user = await db.user.create({
      data: {
        email,
        password,
        name,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};
