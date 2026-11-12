import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const records = sqliteTable('studio_records', {
 id: text('id').primaryKey(), owner: text('owner').notNull(), kind: text('kind').notNull(),
 data: text('data').notNull(), revision: integer('revision').notNull().default(1), updatedAt: text('updated_at').notNull()
});

// Video entities are additive. Existing studio records are unchanged.
export const videoProjects=sqliteTable('video_projects',{
 id:text('id').primaryKey(),owner:text('owner').notNull(),title:text('title').notNull(),data:text('data').notNull(),revision:integer('revision').notNull().default(1),updatedAt:text('updated_at').notNull()
});
export const videoAssets=sqliteTable('video_assets',{
 id:text('id').primaryKey(),owner:text('owner').notNull(),name:text('name').notNull(),type:text('type').notNull(),category:text('category').notNull(),mime:text('mime').notNull(),size:integer('size').notNull(),duration:integer('duration').notNull().default(0),width:integer('width').notNull().default(0),height:integer('height').notNull().default(0),group:text('asset_group').notNull().default(''),key:text('storage_key').notNull(),createdAt:text('created_at').notNull()
});

// Reusable, owner-scoped rig snapshots. Existing media and studio tables are untouched.
export const preparedCharacters=sqliteTable('prepared_characters',{
 id:text('id').primaryKey(),owner:text('owner').notNull(),title:text('title').notNull(),data:text('data').notNull(),revision:integer('revision').notNull().default(1),updatedAt:text('updated_at').notNull()
});

// Reusable scene object snapshots; additive migration only.
export const preparedObjects=sqliteTable('prepared_objects',{
 id:text('id').primaryKey(),owner:text('owner').notNull(),title:text('title').notNull(),data:text('data').notNull(),updatedAt:text('updated_at').notNull()
});
