Type.js
=======

Type.js adds new type properties to your CSS, giving you the control you need for type on the web. You can write these properties in your CSS and they will work like any other property.

View `index.html` to see these new properties in action.

## Properties

### Kerning Pairs
Adjust the space between specific glyphs with a clear syntax. Just type in the two glyphs you want to kern, then the amount space you want.

#### Properties
`kerning-pairs` accepts a comma separated list of two glyphs, then the distance you want between them. Accepts positive or negative distances.
```CSS
kerning-pairs: az 0.02em; 
```
_Values:_ {Any glyph}{Any glyph} {Any distance}{Any CSS unit}

#### Example CSS
```CSS
h1 {
  font-size: 3em;
  line-height: 1.2;
  kerning-pairs: az 0.02em,
                 zy 0.01em,
                 th 0.01em,
                 ov -0.02em; 
}
```

### Rag Adjust
Set rules for where you want your lines to break in a paragraph.

#### Properties
`rag-adjust` accepts four values that describe where your lines should break.
```CSS
rag-adjust: small-words;
```
_Values:_
* `emphasis` – Text of three or less words in bold or italics does not break across lines.
* `small-words` – Breaks lines before words of three or less characters.
* `prepositions` – Breaks lines before prepositions.
* `dashes` – Breaks lines before hyphens and dashes.
* `all` – Breaks lines before all of the above.


#### Example CSS
```CSS
p, li, h3, dd {
  max-width: 35em;
  rag-adjust: small-words;
}
```

### Widow Adjust
Set rules for how you want to adjust styles to eliminate widows – or any grouping of less than 14 characters on the last line of a paragraph – in your text.

#### Properties
`widow-adjust` accepts the style property you want to use to fix your paragraph.
```CSS
widow-adjust: padding-right;
```
_Values:_
* `padding-right` – Increases `padding-right` until the widow is fixed. (Using `box-sizing: border-box;`)
* `padding-left` – Increases `padding-left` until the widow is fixed. (Using `box-sizing: border-box;`)
* `word-spacing` – Removes `word-spacing` until the widow is fixed.
* `nbsp` – Adds a `&nbsp;` character between the last few words of the paragraph.


#### Example CSS
```CSS
p, li, h3, dd {
  max-width: 35em;
  widow-adjust: padding-right;
}
```

### Min/max font-size
Set a minimum and maximum font-size for text when using a viewport unit for font-size.

#### Properties
`min-font-size` and `max-font-size` accepts any `font-size` value and CSS unit. Does not accept viewport units.
```CSS
min-font-size: 20px;
```
_Values:_ {Any value}{Any css unit}

#### Example CSS
```CSS
h1 {
  font-size: 3em;
  font-size: 4vw;
  max-font-size: 50px;
  min-font-size: 30px;
}
```

## Issues

Type.js only works within `style` tags on a page. For now. You can try using your external stylesheets by changing an option in the `type.js` file. Change:

```JS
stylefill.options({
  
  externalCSS : false
  
});
```

To:
```JS
stylefill.options({
  
  externalCSS : true
  
});
```

_Note:_ This will cause the browser to download your external CSS files twice. Once, as per usual, and again to read the `type.js` property values. 
