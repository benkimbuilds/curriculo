export default function AppLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="app-loading-center" role="status">
      <span aria-hidden="true" className="app-loading-spinner" />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
