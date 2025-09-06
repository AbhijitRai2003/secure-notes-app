import React from "react";
import NoteCard from "./NoteCard";
import EmptyState from "./EmptyState";

export default function NoteList({ notes, onOpen, onPin, onArchive }) {
  if (!notes.length) return <EmptyState message="No notes found. Create one or adjust your filters." />;

  return (
    <div className="panel">
      {notes.map((n) => (
        <NoteCard
          key={n.id}
          note={n}
          onOpen={() => onOpen(n)}
          onPin={() => onPin(n)}
          onArchive={() => onArchive(n)}
        />
      ))}
    </div>
  );
}
