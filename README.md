# chrome-form-manager

Chrome extension to manage multiple form presets for static html formulars.
Presets are stored per URL with uniqe name.

## HOW TO

### install?
This is an early beta under heavy development stage. For now no actual extension zip or similar are provided.
In order to install it in chrome you need to checkout project first.

```bash
$ git clone git@github.com/Dica-Developer/chrome-form-manager
```

cd into the project folder

```bash
$ cd chrome-form-manager
```

install all dependencies

```bash
$ npm install
```

run the build script

```bash
$ npm run build
```

After the build finished you will have a new folder `dist`.
In chrome go to `extensions` (chrome://extensions).
Make sure to enable developer mode, checkbox top right and click `Load unpacked extension …`.
Browse to `dist`folder of chrome-form-manager and hit ok.

If everything worked well you should end up with a new icon next to the browser URL input.
