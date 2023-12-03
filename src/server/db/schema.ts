import { sql } from "drizzle-orm";
import {
  index,
  uniqueIndex,
  integer,
  primaryKey,
  pgTableCreator,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mypgTable = pgTableCreator((name) => `project1_${name}`);


export const users = mypgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
 })
 export const usersRelations = relations(users, ({ many }) => ({
	tweets: many(tweet),
  follows: many(follow),
  likes:many(like)
}));

export const follow = mypgTable("follow", {
  id: text("id").notNull().primaryKey().$defaultFn(() => createId()),
  follower_id: text("follower_id" )
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  following_id: text("following_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
export const followRelations = relations(follow, ({ one }) => ({
	folowedby: one(users, {
		fields: [follow.follower_id],
		references: [users.id],
	}),
  folowing: one(users, {
		fields: [follow.following_id],
		references: [users.id],
	}),
}));
export const tweet = mypgTable(
  "tweet",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    name: text("name", ).notNull(),
    createdById: text("createdById")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (example) => ({
    createdByIdIdx: index("tweetById_idx").on(example.createdById),
    nameIndex: index("tweetname_idx").on(example.name),
    idIndex: uniqueIndex("createdatid_idx").on(example.id && example.createdAt),
  }),
);
export const tweetRelations = relations(tweet, ({ one,many }) => ({
	users: one(users, {
		fields: [tweet.createdById],
		references: [users.id],
	}),
  likes: many(like),
  liked: many(like)
}));
export const like = mypgTable(
  "like",
  {
    tweetId: text("tweetid")
      .primaryKey()
      .references(() => tweet.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (example) => ({
    likedByIdIdx: index("likedById_idx").on(example.userId),
    tweetIndex: index("tweet_idx").on(example.tweetId),
  }),
);
export const likeRelations = relations(like, ({ one }) => ({
	tweet: one(tweet, {
		fields: [like.tweetId],
		references: [tweet.id],
	}),
  user: one(users, {
		fields: [like.userId],
		references: [users.id],
	}),
}));
// export const usersRelations = relations(users, ({ many }) => ({
//   accounts: many(accounts),
//   sessions: many(sessions),
// }));


 

 
 export const accounts = mypgTable(
 "account",
 {
   userId: text("userId")
     .notNull()
     .references(() => users.id, { onDelete: "cascade" }),
   type: text("type").$type<AdapterAccount["type"]>().notNull(),
   provider: text("provider").notNull(),
   providerAccountId: text("providerAccountId").notNull(),
   refresh_token: text("refresh_token"),
   access_token: text("access_token"),
   expires_at: integer("expires_at"),
   token_type: text("token_type"),
   scope: text("scope"),
    id_token: text("id_token"),
   session_state: text("session_state"),
 },
 (account) => ({
   compoundKey: primaryKey(account.provider, account.providerAccountId),
 })
 )
 
 export const sessions = mypgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
 })
 
 export const verificationTokens = mypgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
 )