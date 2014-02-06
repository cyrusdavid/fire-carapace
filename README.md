fire-carapace
===

A ferociously quick front-end boilerplate using:

- GULP
- livereload
- LESS/SASS
- bootstrap
- dot.js

## Tasks:

- **serve** - when in development
- **build** - build the whole stuff

## Get started

```
git clone --depth 1 https://github.com/vohof/fire-carapace myapp && cd $_
npm install && bower install
gulp serve
```

## Boilerplate structure

```
fire-carapace
|   .bowerrc
|   .gitignore
|   bower.json
|   Gulpfile.js
|   package.json
|   README.md
|
+---app
|   |   index.dot
|   |
|   +---js
|   |       first.js
|   |       second.js
|   |
|   +---layouts
|   |       dev.dot
|   |       prod.dot
|   |
|   \---less
|           style.less
|
+---build
|
+---vendor
|
+---node_modules
|
\---build
```
