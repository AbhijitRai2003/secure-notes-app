import React from "react";

export default function SearchBar({ query, setQuery, filters, setFilters, sort, setSort }) {
  return (
    <div className="panel" style={{ marginBottom: 8 }}>
      <div className="row wrap">
        <input
          className="input"
          placeholder="Search title or content…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="updatedDesc">Updated (newest)</option>
          <option value="updatedAsc">Updated (oldest)</option>
          <option value="titleAsc">Title (A→Z)</option>
          <option value="titleDesc">Title (Z→A)</option>
        </select>
        <label className="row" style={{ gap: 6 }}>
          <input
            type="checkbox"
            checked={filters.pinnedOnly}
            onChange={(e) => setFilters(f => ({ ...f, pinnedOnly: e.target.checked }))}
          />
          <span className="label">Pinned only</span>
        </label>
        <label className="row" style={{ gap: 6 }}>
          <input
            type="checkbox"
            checked={filters.showArchived}
            onChange={(e) => setFilters(f => ({ ...f, showArchived: e.target.checked }))}
          />
          <span className="label">Include archived</span>
        </label>
      </div>
    </div>
  );
}
