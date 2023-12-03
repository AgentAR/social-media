import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { like, tweet } from "~/server/db/schema";
import { withCursorPagination } from "drizzle-pagination";
import { desc, asc, eq, and, sql } from "drizzle-orm";

export const tweetRouter = createTRPCRouter({
  infiniteFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ ctx, input: { limit = 10, cursor } }) => {
      const currentid = ctx.session?.user.id;
      let cur;
      let crea;
      if (cursor == undefined) {
        cur = 2;
        crea = new Date();
      } else {
        cur = cursor.id;
        crea = cursor.createdAt;
      }
      const data = await ctx.db.query.tweet.findMany({
        ...withCursorPagination({
          limit: limit + 1,
          cursors: [
            // Non-unique, sequential column
            [tweet.createdAt, "desc", crea],
            // Unique column as a fallback so you get a stable sort order
            [tweet.id, "asc", cur],
          ],
        }),
        columns: {
          id: true,
          name: true,
          createdAt: true,
        },
        with: {
          users: {
            columns: {
              id: true,
              image: true,
              name: true,
            },
          },
          likes: {
            columns: {
              userId: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined;

      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      return {
        tweets: data.map((tweet) => {
          const leng = tweet.likes.length;
          let b = false;
          tweet.likes.map((like) => {
            if (like.userId === currentid) b=true;
          });
          
          return {
            id: tweet.id,
            content: tweet.name,
            createdAt: tweet.createdAt,
            users: tweet.users,
            likes: leng,
            liked: b,
            // extras: tweet.extras,
          };
        }),
        nextCursor,
      };
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const tweet1 = await ctx.db
        .insert(tweet)
        .values({
          name: input.name,
          createdById: ctx.session.user.id,
        })
        .returning();
      return tweet1;
    }),

  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.query.tweet.findFirst({
  //     orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //   });
  // }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
