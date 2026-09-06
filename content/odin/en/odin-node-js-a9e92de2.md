# Project: File Uploader

## Personal file storage

Build a small Google Drive-like application: people sign in, organize folders, upload files, inspect metadata and download them. This project remains in the complete library even if it extends beyond the guided week.

## Assignment

1. Create Next App Router with PostgreSQL and Prisma. Integrate Better Auth with database-persisted sessions, not an in-memory dictionary.
2. Add an authenticated multipart form. A Route Handler may read `request.formData()`; verify the field is a `File` and enforce size limits. For large files, use authorized direct uploads and verify provider metadata server-side.
3. You may prototype with a local practice directory outside `public`. Move to durable private storage before deployment because instance disks may be ephemeral.
4. Implement folder create, read, rename and delete, plus uploading into folders. Every query must enforce session ownership of both folder and file.
5. Add file details showing name, size, upload date and a download button.
6. Integrate [Cloudinary](https://cloudinary.com/) or [Supabase Storage](https://supabase.com/docs/guides/storage), or compatible storage. Store object keys, ownership and metadata in PostgreSQL, not permanent public URLs for private files.
7. Validate permitted sizes and types. Do not trust browser MIME or extension alone; inspect content as appropriate. Generate safe internal names instead of accepting client filesystem paths.
8. Authorize downloads before streaming or issuing short-lived signed URLs. Handle storage failure after metadata creation by removing incomplete records or scheduling cleanup.

## Model and invariants

Consider `folders(id, owner_id, name, parent_id)` and `files(id, folder_id, owner_id, object_key, name, size, uploaded_at)`. Prevent cycles if nesting folders. Define deletion of occupied folders and coordinate metadata with stored objects.

## Acceptance criteria

- Sessions survive restart and can be revoked at sign-out.
- A and B have separate folders; knowing an ID never lets B read, rename, delete or download A's objects.
- Folder CRUD and upload destination selection work.
- Details and download match the correct object.
- Oversized or disallowed uploads are rejected without publication.
- Failed uploads do not appear as valid files.
- README documents configuration, limits, checks and external costs; local evaluation does not require purchasing a plan.

## Extra credit: folder sharing

Let owners select a duration such as one or ten days. Generate an unguessable random token and store its hash, scope and expiry. The link grants anonymous reading only to that folder and its files. Check expiry and revocation on every access; never expose sibling folders or owner data.

