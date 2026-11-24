export default function AppLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="app-content app-content--wide app-loading-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-line skeleton-line--sm" />
        <div className="skeleton-line skeleton-line--lg" />
      </div>
      <div className="skeleton-banner" />
      <div className="skeleton-grid">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    </div>
  );
}
