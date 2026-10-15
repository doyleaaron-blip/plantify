# Plantify

Built by the Software Factory. Add backlog items for this app in the factory;
the builder makes them here and opens a pull request for the owner to review.

## Setting up from scratch

Everything installs from the public npm registry; nothing depends on files
from someone's own computer. With Node.js 22 (see `.nvmrc`):

```bash
npm ci               # install the exact packages in package-lock.json
npm run check        # lint + typecheck + tests
npm run build        # production build
npm start            # run the built site at http://localhost:3000
```

No settings are needed to start the app. The analytics settings in
`.env.example` are optional locally; without them analytics stay off.
Vercel builds a preview link for every pull request.
