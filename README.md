# dungewar.com

The source for the dungewar.com personal website.

## Development

```bash
npm install
npm run dev
```

The development server prints the local URL. API requests use
`https://api.dungewar.com` by default. Set `VITE_API_ORIGIN` to override it
during local development.

## Production

```bash
npm run build
npm run preview
```

The build writes the deployable static site to `frontend/dist`, which this
repository currently tracks for deployment. Niranjan's offline WordNet lookup
is generated during the build and copied into `dist/assets/dictionary`; it is
served as static files, so no dictionary request needs a backend or a
third-party API. The generated source buckets under
`frontend/public/assets/dictionary` are ignored.
