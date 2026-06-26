function HistoryPanel({ history = [], onOpenHistory }) {
  return (
    <section className="history-panel premium-card">
      <div className="panel-title-row">
        <div>
          <p className="eyebrow">Memory</p>
          <h3>Past Analyses</h3>
        </div>

        <span>{history.length}</span>
      </div>

      {history.length === 0 && (
        <p className="muted">No saved analyses yet.</p>
      )}

      <div className="history-list">
        {history.map((item) => (
          <button
            key={item.id}
            className="history-card"
            onClick={() => onOpenHistory(item.id)}
          >
            <b>Analysis #{item.id}</b>
            <p>{item.user_input?.slice(0, 85)}...</p>
            <small>
              {item.created_at
                ? new Date(item.created_at).toLocaleString()
                : "Saved"}
            </small>
          </button>
        ))}
      </div>
    </section>
  );
}

export default HistoryPanel;