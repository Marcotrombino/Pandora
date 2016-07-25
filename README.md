# Pandora
<b>Pandora.js</b> processes images using HTML5 canvas and applies filters like Instagram, Facebook or other apps which allow to customize your images. Pandora takes a queue list and processes the source image applying effects layer over layer. That means you can use multiple effects on your images and obtain new effects time by time!
##Let's start to use Pandora
The concept behind Pandora's structure is permitting users to apply their filters in the less steps possible :
###1. Include
First of all you need to include <b>pandora.js</b> on your .html page :
```html
<script type="text/javascript" src="pandora.js"><script>
```
###2. Set up targets
Pandora requires 3 attribute applied on ```<img> ```
- `pandora` : Pandora's class target
- `src` : Contains the path of the image target
- `data-queue` : Contains the queue of <b>Pandora's effects</b> you want to apply
<br><br>Pandora will provide to create an HTML5 canvas inside each Pandora's target.

 Let's give an example :
```html
<img src="myImage1.png" data-queue="colorfull();">
<img src="myImage2.png" data-queue="bw();brightness(10);contrast(30);">
...
<img src="myImageX.png" data-queue="bwRed();">
```

###3. Start Pandora
Start Pandora creating a Pandora object in the end of body :
```html
<script type="text/javascript>
  var PandoraBox = new Pandora();
</script>
```
## Pandora Effects
Pandora offers many effects which you can apply over your images
### Adjustments
A set of adjustment effects

Adjustment | Parameters | Release | Description  
--- | --- | --- | ---
`brightness()` | - `value` : Adjustment value | 1.0 | Brightness adjustment
`contrast()` | - `value` : Contrast value | 1.0 | Contrast adjustment
`colorBalance()` | - `R` : Adjustment value of Red channel <br> - `G` : Adjustment value of Green channel <br> - `B` : Adjustment value of Blue channel | 1.0 | Color balance

###Effects
A set of simple effects

Effect | Parameters | Release | Description
--- | --- | --- | ---
`bw()` | | 1.0 | Black and white effect
`noise()` | - `value`(optional) : Noise intensity | 1.0 | Noise effect
`invert()` | - `R` : Boolean invert Red channel<br> - `G` : Boolean invert Green channel<br> - `B` : Boolean invert blue channel<br> - `intensity`(optional) : Intensity value adjustment | 1.0 | Invert effect
`fill()` | - `blendMode` : Blend mode (`source-over`, `source-in`, `source-out`, `source-atop`, `destination-over`, `destination-in`, `destination-out`, `destination-atop`, `lighter`, `copy`, `xor`, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `color-dodge`, `color-burn`, `hard-light`, `soft-light`, `difference`, `exclusion`, `hue`, `saturation`, `color`, `luminosity`)<br><br> - `fillingType` : Filling type (`color` or `gradient`)<br> - `fillingValue` : Filling value<br> - `alpha` : Opacity value| 1.0 | Color or gradient layer with blending

###Presets
A set of compounds effects ready to use without any customization

Preset | Release | Description
--- | --- | --- |
`redBw()`| 1.0 | Red B&W preset
`brilliantRed()`| 1.0 | High Red and Brown preset
`vintage()`| 1.0 | Vintage preset
`sprite()`| 1.0 | High contrast and colorfull preset




