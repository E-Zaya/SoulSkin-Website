# SoulSkin refactor patch

This patch assumes the project uses root-level folders instead of `src`:

```txt
app/
components/
data/
lib/
public/
```

If your current project has `src/app`, `src/components`, `src/data`, and `src/lib`, move those folders to the project root and replace the matching files with this patch.

If your `@/` import alias currently points to `./src/*`, update `tsconfig.json` like this:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Main changes:

- Fixed font token mismatch in `globals.css`.
- Added reusable spacing, typography, hero, CTA, and layout utilities.
- Reduced mobile whitespace in Hero, Drop, Lookbook, Products, CustomOrder, and About.
- Replaced the non-functional mobile Menu button with a direct Instagram link.
- Renamed Archive copy to a more brand/lookbook-oriented Selected Pieces direction.
