# Publishing the Veritale website with GitHub Pages

All files sit at one level, so they go straight into the top of the repository.

## 1. Upload the files

1. Open https://github.com/Rupeshrajak456/skill-veritale
2. Click **Add file**, then **Upload files**.
3. Drag in every file from this folder: `index.html`, `style.css`, `script.js`, `data.js`, `SKILL.md`, the six `module-*.md` files, `examples.md`, `README.md`, `CITATION.cff`, `LICENSE`, `DEPLOY.md` and `.nojekyll`.
4. Click **Commit changes**.

`.nojekyll` starts with a dot, so some computers hide it. If you cannot see it, create it on GitHub instead: **Add file**, then **Create new file**, name it `.nojekyll`, leave it empty and commit. It stops GitHub from turning the `.md` files into web pages, so the module explorer can read them as plain text.

## 2. Turn on GitHub Pages

1. In the repository, open **Settings**, then **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose the branch **main** and the folder **/ (root)**, then click **Save**.
4. Wait one or two minutes and refresh. The site will appear at:
   https://rupeshrajak456.github.io/skill-veritale/

## 3. Updating later

Edit any file on GitHub and commit. Pages republishes the site in about a minute. If you change a module file, the module explorer shows the new version automatically. The demonstration and the visualisation use `data.js`, so update that file too if you change the case studies.
