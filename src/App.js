import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import VaultGate from "./components/VaultGate";
import NoteEditor from "./components/NoteEditor";
import NoteList from "./components/NoteList";
import SearchBar from "./components/SearchBar";
import { listNotes, putNote, deleteNote } from "./lib/db";
import { encryptText, decryptText } from "./lib/crypto";
import { uuid, now, normalize } from "./lib/util";

const emptyDraft = () => ({
  id: uuid(),
  title: "",
  content: "",
  pinned: false,
  archived: false,
  createdAt: now(),
  updatedAt: now(),
  // the encrypted payload will be set right before saving
});

export default function App() {
  const [passphrase, setPassphrase] = useState(null);
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState(emptyDraft());
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ pinnedOnly: false, showArchived: false });
  const [sort, setSort] = useState("updatedDesc");
  const [activeId, setActiveId] = useState(null);

  // Load & decrypt all notes when unlocked
  useEffect(() => {
    if (!passphrase) return;
    (async () => {
      const raw = await listNotes();
      const out = [];
      for (const n of raw) {
        try {
          const title = decryptText(n.title.cipher, n.title.iv, n.title.salt, passphrase);
          const content = decryptText(n.content.cipher, n.content.iv, n.content.salt, passphrase);
          out.push({ ...n, title, content });
        } catch {
          // bad passphrase: ignore; VaultGate should prevent this scenario
        }
      }
      // newer first
      out.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
      setNotes(out);
      if (out.length) {
        setActiveId(out[0].id);
        setDraft(out[0]);
      } else {
        const d = emptyDraft();
        setActiveId(d.id);
        setDraft(d);
      }
    })();
  }, [passphrase]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    let arr = notes.filter(n => {
      const match = normalize(n.title).includes(q) || normalize(n.content).includes(q);
      const archivedPass = filters.showArchived ? true : !n.archived;
      const pinnedPass = filters.pinnedOnly ? n.pinned : true;
      return match && archivedPass && pinnedPass;
    });

    switch (sort) {
      case "updatedAsc": arr.sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1)); break;
      case "titleAsc": arr.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "titleDesc": arr.sort((a, b) => b.title.localeCompare(a.title)); break;
      default: // updatedDesc
        arr.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    }

    // Keep pinned at the top within sorting order
    arr = [...arr.filter(n => n.pinned), ...arr.filter(n => !n.pinned)];
    return arr;
  }, [notes, query, filters, sort]);

  const onOpen = (n) => {
    setActiveId(n.id);
    setDraft(n);
  };

  const onDraftChange = (d) => setDraft(d);

  const persist = async (n) => {
    const titleEnc = encryptText(n.title, passphrase);
    const contentEnc = encryptText(n.content, passphrase);
    const record = {
      id: n.id,
      pinned: n.pinned,
      archived: n.archived,
      createdAt: n.createdAt,
      updatedAt: now(),
      title: titleEnc,
      content: contentEnc,
    };
    await putNote(record);

    // reflect in-memory
    const newNotes = notes
      .filter(x => x.id !== n.id)
      .concat([{ ...n, updatedAt: record.updatedAt }])
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    setNotes(newNotes);
    setDraft({ ...n, updatedAt: record.updatedAt });
  };

  const onSave = () => persist(draft);
  const onNew = () => {
    const d = emptyDraft();
    setDraft(d);
    setActiveId(d.id);
  };

  const onArchiveToggle = async () => {
    await persist({ ...draft, archived: !draft.archived });
  };

  const onPinToggle = async () => {
    await persist({ ...draft, pinned: !draft.pinned });
  };

  const onDelete = async () => {
    if (!window.confirm("Delete this note permanently?")) return;
    await deleteNote(draft.id);
    setNotes(notes.filter(n => n.id !== draft.id));
    const next = notes.filter(n => n.id !== draft.id)[0] || emptyDraft();
    setDraft(next);
    setActiveId(next.id);
  };

  const onExport = () => {
    // export encrypted records only (privacy by default)
    const payload = notes.map(n => ({
      id: n.id,
      pinned: n.pinned,
      archived: n.archived,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    }));

    const enc = notes.map(n => ({
      id: n.id,
      pinned: n.pinned,
      archived: n.archived,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
      title: encryptText(n.title, passphrase),
      content: encryptText(n.content, passphrase),
    }));

    const blob = new Blob([JSON.stringify({ version: 1, enc }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "secure-notes-export.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      if (!data?.enc?.length) throw new Error("Invalid file");
      for (const r of data.enc) {
        const title = decryptText(r.title.cipher, r.title.iv, r.title.salt, passphrase);
        const content = decryptText(r.content.cipher, r.content.iv, r.content.salt, passphrase);
        await persist({
          id: r.id,
          pinned: r.pinned,
          archived: r.archived,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          title, content,
        });
      }
      alert("Import complete.");
    } catch (err) {
      alert("Failed to import: " + err.message);
    } finally {
      e.target.value = ""; // reset input
    }
  };

  const onLock = () => {
    if (!window.confirm("Lock the vault? You’ll need your passphrase to unlock again.")) return;
    setPassphrase(null);
    setNotes([]);
    setDraft(emptyDraft());
  };

  if (!passphrase) {
    return <VaultGate onUnlock={setPassphrase} />;
  }

  return (
    <div className="container">
      <Header onNew={onNew} onExport={onExport} onImport={onImport} onLock={onLock} />
      <div className="grid">
        <aside>
          <SearchBar
            query={query}
            setQuery={setQuery}
            filters={filters}
            setFilters={setFilters}
            sort={sort}
            setSort={setSort}
          />
          <NoteList
            notes={filtered}
            onOpen={onOpen}
            onPin={(n) => persist({ ...n, pinned: !n.pinned })}
            onArchive={(n) => persist({ ...n, archived: !n.archived })}
          />
        </aside>
        <section>
          <NoteEditor
            draft={draft}
            onChange={onDraftChange}
            onSave={onSave}
            onArchiveToggle={onArchiveToggle}
            onPinToggle={onPinToggle}
            onDelete={onDelete}
          />
          <div className="footer">
            Encrypted locally • Works offline • Built with love 💙
          </div>
        </section>
      </div>
    </div>
  );
}
