# Seedling marketing site

A static page: plain HTML, one stylesheet and one script, with no framework and no build. The
application lives on its own host; every call to action here links there.

| File                       | What it is                                                                     |
| -------------------------- | ------------------------------------------------------------------------------ |
| `index.html`               | The page. No inline script or style: the Content-Security-Policy forbids them. |
| `assets/seedling.css`      | The layout, using the same tokens by role as the design system.                |
| `assets/seedling.js`       | Menu, header shadow, footer year.                                              |
| `assets/screenshots/`      | Captured from the real app by `tools/marketing-screenshots`.                   |
| `staticwebapp.config.json` | Security headers and redirects to the app.                                     |

## Preview locally

```sh
cd e2e && node fixtures/marketing-server.mjs ../marketing 4500
# http://localhost:4500, served with the production headers
```

Run Prettier on this folder from `frontend/` (`npx prettier --write ../marketing`); the pre-commit
hook does not see it.
