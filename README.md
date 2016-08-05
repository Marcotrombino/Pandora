# Pandora
<b>Pandora</b> processes images using HTML5 canvas and applies filters like Instagram, Facebook or other apps which allow image customization. The script takes a queue list and processes the source image applying effects layer over layer. That means you can use multiple effects over your images and obtain new effects time by time!
<p align="center"><img src="http://i.imgur.com/VaIwNzd.gif"><br><i>Low quality images due to GIF format</i></p>
##Let's start to use Pandora
It requires just 3 steps :
###1. Include
First of all you need to include <b>pandora.js</b> on your .html page :
```html
<script type="text/javascript" src="pandora.js"><script>
```
###2. Set up targets
Pandora requires 3 attributes applied <b>inline</b> on ```<img> ```
- `src` : Contains the path of the image target
- `pandora` : Pandora's class target
- `data-queue` : Contains the queue of <b>Pandora's effects</b> you want to apply

 Let's give an example :
```html
<img src="myImage1.png" class="pandora" data-queue="colorfull();">
<img src="myImage2.png" class="pandora" data-queue="bw();brightness(10);contrast(30);">
...
<img src="myImageX.png" class="pandora" data-queue="colorBalance(40, 20, 20);">
```
Pandora creates off screen canvas and returns a new ```<img>``` with BASE64 url from it which replace the initial one.

###3. Start Pandora
Start Pandora creating a Pandora object in the end of body :
```html
<script type="text/javascript>
  var PandoraBox = new Pandora();
</script>
```
###HTML5 Support
If a browser has some issue with Pandora all your initial images will remain rendered on the screen without effects and <b>without blank screen</b>.

## Pandora Effects
Pandora offers many effects which you can apply over your images

###Presets
A set of compounds effects ready to use without requiring any parameter

Preset | Release | Description
--- | --- | --- |
`bw()` | 1.0 | Black and white effect
`redBw()`| 1.0 | Red B&W preset
`darkBw()`| 1.0 | Dark B&W preset
`brilliantRed()`| 1.0 | High Red and Brown preset
`vintage()`| 1.0 | Vintage preset
`vintage2()`| 1.0 | Vintage preset
`sprite()`| 1.0 | High contrast and colorfull preset
`colorfull()`| 1.0 | Colorfull preset
`fluoNight()`| 1.0 | Colorfull preset perfect for night image (party etc)

###Effects
A set of simple effects

Effect | Parameters | Release | Description
--- | --- | --- | ---
`noise()` | - `value`(optional) : Noise intensity | 1.0 | Noise effect
`invert()` | - `R` : Boolean invert Red channel<br> - `G` : Boolean invert Green channel<br> - `B` : Boolean invert blue channel<br> - `intensity`(optional) : Intensity value adjustment | 1.0 | Invert effect
`blur()` | - `value`(optional) : Blur ratio | 1.0 | Blur effect
`sepia()` |  | 1.0 | Sepia effect
`HDR()` | | 1.0 | HDR effect
`fill()` | - `blendMode` : Blend mode (`source-over`, `source-in`, `source-out`, `source-atop`, `destination-over`, `destination-in`, `destination-out`, `destination-atop`, `lighter`, `copy`, `xor`, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `color-dodge`, `color-burn`, `hard-light`, `soft-light`, `difference`, `exclusion`, `hue`, `saturation`, `color`, `luminosity`)<br><br> - `fillingType` : Filling type (`color` or `gradient`)<br> - `fillingValue` : Filling value<br> - `alpha` : Opacity value| 1.0 | Color or gradient layer with blending

### Adjustments
A set of adjustments

Adjustment | Parameters | Release | Description  
--- | --- | --- | ---
`brightness()` | - `value` : Adjustment value | 1.0 | Brightness adjustment
`contrast()` | - `value` : Contrast value | 1.0 | Contrast adjustment
`colorBalance()` | - `R` : Adjustment value of Red channel [0 to 255]<br> - `G` : Adjustment value of Green channel [0 to 255]<br> - `B` : Adjustment value of Blue channel [0 to 255]| 1.0 | Color balance
`autoAdj()` |  | 1.0 | Brightness and contrast auto adjustment
`exposure()` | - `value` : Exposure value [0 to 1] | 1.0 | Exposure adjustment
`selectiveCorrection()` <b>BETA</b> | - `R`, `C`, `M`, `Y`, `K` : CMYK Adjustment for Red channel<br>- `Y`, `C`, `M`, `Y`, `K` : CMYK Adjustment for Yellow channel<br>- `G`, `C`, `M`, `Y`, `K` : CMYK Adjustment for Green channel<br>- `C`, `C`, `M`, `Y`, `K` : CMYK Adjustment for Cyan channel<br>- `B`, `C`, `M`, `Y`, `K` : CMYK Adjustment for Blue channel<br>- `M`, `C`, `M`, `Y`, `K` : CMYK Adjustment for Magenta channel<br>| 1.0 | Selective color correction similar to Adobe Photoshop (CMYK adjustment values don't correspond with Adobe's tool).





