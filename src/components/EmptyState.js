import React from "react";

export default function EmptyState({ message }) {
  return (
    <div className="empty panel">
      <div style={{ fontSize: 18, marginBottom: 6 }}>Nothing here yet</div>
      <div>{message}</div>
    </div>
  );
}
