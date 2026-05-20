export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center gap-md px-md text-center">
      <span className="text-8xl font-bold text-primary">404</span>
      <h1 className="font-h2 text-h2 text-on-surface">Página no encontrada</h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
        La página que buscas no existe o fue movida.
      </p>
      <a
        href="/"
        className="mt-md px-lg py-sm bg-primary text-white rounded-xl font-label-caps text-label-caps hover:bg-primary/90 transition-colors"
      >
        Volver al inicio
      </a>
    </div>
  );
}
