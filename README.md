# Pandora
<b>Pandora.js</b> processes images using HTML5 canvas and applies filters like Instagram, Facebook or other apps which allow to customize your images. Pandora takes a queue list and processes the source image applying effects layer over layer. That means you can use multiple effects on your images and obtain new effects time by time!
##Let's start to use Pandora
The concept behind Pandora's structure is permitting users to apply their filters in the less steps possible :
###1. Include
First of all you need to include <b>pandora.js</b> on your .html page :
```html
<script type="text/javascript" src="YOUR_PATH/pandora.js"><script>
```
###2. Set up targets
Choose your html elements target where apply Pandora effects.
Pandora will take <b>all</b> HTML elements where is applied <b>pandora</b> class and it will process your images taking two attributes :

- `data-src` : Contains the path of the image target
- `data-queue` : Contains the queue of <b>Pandora's effects</b> you want to apply
<br><br>Pandora will provide to create an HTML5 canvas inside each Pandora's target.

 Let's give an example :
```html
<div class="pandora" data-src="YOUR_PATH/myimage1.png" data-queue="bw();contrast(30);"></div>
<div class="pandora" data-src="YOUR_PATH/myimage2.png" data-queue="brightness(15);"></div>
...
<div class="pandora" data-src="YOUR_PATH/myimage3.png" data-queue="RGBAdj(20,30,10);contrast(30);"></div>
```

###3. Start Pandora
Start Pandora creating a Pandora object in the end of body :
```html
<script type="text/javascript>
  var PandoraBox = new Pandora();
</script>
```
##Effects

Effect | Parameters | Type | Description 
--- | --- | --- | ---
`brightness()` | - `value` : The adjustment value you want to apply | <b>Adjustment</b> | Brightness adjustment
`contrast()` | - `value` : The contrast value you want to apply | <b>Adjustment</b> | Contrast adjustment
`RGBAdj()` | - `R` : The adjustment value of Red channel <br> - `G` : The adjustment value of Green channel <br> - `B` : The adjustment value of Blue channel | <b>Adjustment</b> | RGB Channels adjustment
`bw()` |  | <b>Filter</b> | Black and White filter
`highBw()` |  | <b>Filter</b> | Black and White filter more contrasted

