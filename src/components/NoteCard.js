import React from "react";

export default function NoteCard({ note, onOpen, onPin, onArchive }) {
  return (
    <div className="card" onClick={onOpen} style={{ cursor: "pointer" }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <strong>{note.title || "Untitled"}</strong>
        <div className="row" style={{ gap: 6 }}>
          {note.pinned ? <span className="badge">Pinned</span> : null}
          {note.archived ? <span className="badge">Archived</span> : null}
        </div>
      </div>
      <div className="kicker" style={{ marginTop: 6 }}>
        {new Date(note.updatedAt).toLocaleString()}
      </div>
      <div style={{
        color: "#cbd5e1",
        marginTop: 8,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
      }}>
        {note.content || "No content"}
      </div>

      <hr className="sep" />
      <div className="row" style={{ gap: 8 }}>
        <button className="btn" onClick={(e) => { e.stopPropagation(); onPin(); }}>
          {note.pinned ? "Unpin" : "Pin"}
        </button>
        <button className="btn" onClick={(e) => { e.stopPropagation(); onArchive(); }}>
          {note.archived ? "Unarchive" : "Archive"}
        </button>
      </div>
    </div>
  );
}
