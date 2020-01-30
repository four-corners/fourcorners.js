# fourcorners.js

The **Four Corners Project** allows specific information to be embedded in each of the photograph’s four corners, where it is available for an interested reader to explore. This increased contextualization strengthens both the authorship of the photographer and the credibility of the image.

**fourcorners.js** is an open source JavaScript library to initiate your Four Corners photographs built on fourcornersproject.org or generated from your CMS. The library is still in development and should not be used in production.

For inquiries about usage or development contribution, please email [fourcornersphotograph@gmail.com](mailto:fourcornersphotograph@gmail.com).



### Default setup

```js
var four_corners_modules = new FourCorners();
```


### Setup with options
```js
var four_corners_modules = new FourCorners({
	selector: '.fc-embed',
	caption: true,
	credit: true,
	logo: true,
	active: '',
	static: false,
});
```

### Options


| Name | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| **selector** | *string* | `.fc-embed` | Provide a selector to target which elements should be constructed as a Four Corners module |
| **caption** | *boolean* | `false` | Toggle if the image caption is included under the module |
| **credit** | *boolean* | `false` | Toggle if the image credit is included under the module |
| **logo** | *boolean* | `false` | Toggle if the Four Corners Project logo and link to [fourcornersproject.org](https://fourcornersproject.org) is included under the module |
| **active** | *string* | `''` | Set a corner to be open when the module is constructed (Options available are *authorship*, *backstory*, *imagery*, or *links*)
| **static** | *boolean* | `false` | Toggle interactive capabilities, if set to `false` the `active` property can control which corner is opened |
