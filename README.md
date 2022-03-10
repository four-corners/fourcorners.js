
# fourcorners.js

The **Four Corners Project** allows specific information to be embedded in each of the photograph’s four corners, where it is available for an interested reader to explore. This increased contextualization strengthens both the authorship of the photographer and the credibility of the image.

**fourcorners.js** is an open source JavaScript library that augments your embedded images with the interactive "four corners" and corresponding contextual data and media.

For inquiries about usage or development contribution, please email [fourcornersphotograph@gmail.com](mailto:fourcornersphotograph@gmail.com).

## Setup

### How to initialize an embed

```js
new FourCorners(selector, options, provenance);
```

#### Default JSON embed
If you are embedding using HTML generated from the Four Corners Project's "[Create your own](https://fourcornersproject.org/en/create/)" page you can ignore the `provenance` argument. Instead, your HTML will include your contextual data in a JSON object wrapped in a `<script>` tag.

```js
new FourCorners(selector, options);
```

#### C2PA embed
If you are using an image file injected with the C2PA and Four Corners metadata, you must first extract the metadata from the image file and then pass as the `provenance` argument.

Add the following in your `<head>` tag:

```html
<script type="module">
import { ContentAuth } from "https://cdn.jsdelivr.net/npm/@contentauth/sdk@0.8.12-alpha.10/dist/cai-sdk.esm.min.js";
import "https://cdn.jsdelivr.net/npm/@contentauth/web-components@0.4.2-alpha.20/dist/index.min.js";
var wasmSrc = "https://cdn.jsdelivr.net/npm/@contentauth/sdk@0.8.12-alpha.10/dist/assets/wasm/toolkit_bg.wasm";
var workerSrc = "https://cdn.jsdelivr.net/npm/@contentauth/sdk@0.8.12-alpha.10/dist/cai-sdk.worker.min.js";
var sdk = new ContentAuth({wasmSrc, workerSrc});
var provenance = await sdk.processImage(imgSrc);
await new FourCorners(selector, options, provenance);
</script>
```

### Basic examples

#### Initialize with string selector
```js
var fc_image = new FourCorners("img.fc-image");
```

#### Initialize with DOM element
```js
var elem = document.querySelector("img.fc-image");
var fc_image = new FourCorners(elem);
```

#### Initialize with options
```js
var fc_image = new FourCorners(elem, {
	caption: true,
	credit: true,
	logo: true,
	dark: true
});
```

### Options

| Name | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| `caption` | *boolean* | `false` | Decides if the caption shows under the embed* |
| `credit` | *boolean* | `false` | Decides if the credits show under the embed* |
| `logo` | *boolean* | `false` | Decides if a hyperlinked Four Corners Project logo shows under the embed |
| `dark` | *boolean* | `false` | Decides if the embed UI should be in dark mode |

*\*These fields will always show in the Authorship panel regardless of these settings*