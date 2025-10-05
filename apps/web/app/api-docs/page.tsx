export default function ApiDocs() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">API Docs</h1>
      <ul className="list-disc pl-6">
        <li>
          <a className="underline" href="/api-docs/openapi.json">
            Download openapi.json
          </a>
        </li>
        <li>
          Swagger UI (backend): <code>http://localhost:3000/docs</code>
        </li>
      </ul>
    </main>
  );
}
