export default function Page() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">MerchConnect México</h1>
      <p className="text-sm text-mc-deep-navy/70 mt-2">MVP multi-tenant</p>
      <ul className="mt-6 space-y-2">
        <li><a className="underline" href="/admin">Admin</a></li>
        <li><a className="underline" href="/workshop">Workshop</a></li>
        <li><a className="underline" href="/proveedor">Proveedor</a></li>
        <li><a className="underline" href="/site/onpoint/home">Site demo</a></li>
      </ul>
    </main>
  );
}
