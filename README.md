# chrome-form-manager

Chrome extension to manage multiple form presets for static html formulars.
Presets are stored per URL with uniqe name.

Required:

`node >= v6.0.0`
`npm >= v5.0.0`

## HOW TO

### install?
This is an early beta under heavy development stage. For now no actual extension zip or similar are provided.
In order to install it in chrome you need to checkout project first.

```bash
$ git clone git@github.com:Dica-Developer/chrome-form-manager.git
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
$ npm run dist
```

After the build finished you will have a new folder `dist`.
In chrome go to `extensions` (chrome://extensions).
Make sure to enable developer mode, checkbox top right and click `Load unpacked extension …`.
Browse to `dist`folder of chrome-form-manager and hit ok.

If everything worked well you should end up with a new icon next to the browser URL input.

## use it?

### New preset

If you're on a page with a formular you want to save the values typed in.
Just hit the icon of the extension and the popup will popup. ;)

Type in a name (required), a description (optional) and hit save.
The nex time you open the popup the new preset you be availabe in the select box.

### Apply preset


