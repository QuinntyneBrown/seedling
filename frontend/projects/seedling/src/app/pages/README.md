# pages

One folder per routed screen: `<page>/<page>.page.ts` + `<page>.page.html` + `<page>.page.scss` + `<page>.page.spec.ts`, lazy-loaded from `app.routes.ts`. Pages compose design-system components from `components` and depend on service tokens from `api`. No inline forms: editing opens a dialog or navigates.
