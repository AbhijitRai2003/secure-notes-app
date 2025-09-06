import { openDB } from "idb";

/**
 * IndexedDB schema (dbName: "secure-notes", store: "notes")
 * Note is stored encrypted:
 * {
 *   id, createdAt, updatedAt, pinned, archived,
 *   title: {cipher, iv, salt},
 *   content: {cipher, iv, salt}
 * }
 */
const DB_NAME = "secure-notes";
const STORE = "notes";
const VERSION = 1;

export async function db() {
  return openDB(DB_NAME, VERSION, {
    upgrade(d) {
      if (!d.objectStoreNames.contains(STORE)) {
        const store = d.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("by_updatedAt", "updatedAt");
        store.createIndex("by_pinned", "pinned");
        store.createIndex("by_archived", "archived");
      }
    },
  });
}

export async function listNotes() {
  const database = await db();
  return await database.getAll(STORE);
}

export async function getNote(id) {
  const database = await db();
  return await database.get(STORE, id);
}

export async function putNote(note) {
  const database = await db();
  return await database.put(STORE, note);
}

export async function deleteNote(id) {
  const database = await db();
  return await database.delete(STORE, id);
}

export async function bulk() {
  const database = await db();
  return database.transaction(STORE, "readwrite").store;
}
