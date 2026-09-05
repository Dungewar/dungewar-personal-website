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

Vite writes the deployable static site to `frontend/dist`. That directory is
generated and intentionally not committed.
