/* Pandora HTML5 Image processing
 * VERSION: 1.0
 * DATE: 2016-08-05
 * UPDATE AND DOCS AT: https://github.com/Marcotrombino/Pandora
 * @Copyright (C) 2016 Marco Trombino
 * @author: Marco Trombino

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see http://www.gnu.org/licenses.
*/

    var Pandora = function() {
        this.sources = [];
        this.start();
    };

    Pandora.prototype.check = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    // fill Pandora's sources
    Pandora.prototype.initialize = function() {
        var DOM = document.getElementsByClassName("pandora");

        for(var i=0; i < DOM.length; i++) {
            var queue = [];
            var dataQueue = DOM[i].dataset.queue.substring(0, DOM[i].dataset.queue.length-1).replace(' ','').replace(/ /g,'').replace(/(\r\n|\n|\r)/gm,"").split(";");

            for(j=0; j< dataQueue.length; j++) {
                var partial = dataQueue[j].split("(");
                if(typeof partial[1] == 'undefined')
                  console.error("Error occurred during queue list loading : check syntax.");

                var partial2 = partial[1].split(")");
                var params = partial2[0].split(',');

                if(params.length==1 && params[0] == ""){
                  params = [];
                }

                var queueNode = {
                    effect : partial[0],
                    params : params
                };
                queue.push(queueNode);
            }

           var node = DOM[i];
           var src = DOM[i].src;

           var source = {
               node : node,
               src : src,
               queue : queue
           };
           this.sources.push(source);
        }
    };

    Pandora.prototype.scene = function() {
        var _ = this;
        var count = 0;

        this.sources.forEach(function() {
            var canvas = document.createElement("canvas");
                canvas.id = "pandora_canvas_" + count;
            var ctx = canvas.getContext("2d");
            var imgObj = new Image();
                imgObj.src = _.sources[count].src;
                imgObj.index = count;
                imgObj.sources = _.sources;

            var queue = this.sources[count].queue;
            var i = 0;

            imgObj.onload = function() {
                canvas.width = imgObj.width;
                canvas.height = imgObj.height;
                ctx.drawImage(imgObj, 0, 0);

                queue.forEach(function() {
                    var effect = this.sources[imgObj.index].queue[i].effect;
                    var params = this.sources[imgObj.index].queue[i].params;
                    if (typeof this[effect] == 'function') this[effect](canvas, ctx, params);
                    else console.error(effect + "() effect doesn't exit.")
                    i++;
                }.bind(this));

                var node = imgObj.sources[imgObj.index].node;
                var imgCanvas = document.createElement("img");
                  imgCanvas.src = canvas.toDataURL();
                node.parentNode.replaceChild(imgCanvas, node);
            }.bind(this);

            imgObj.onerror = function() {
                console.error("Error occurred during " + imgObj.src +" loading.");
            }

            count++;
        }.bind(this));
    };

    Pandora.prototype.start = function() {
        if(this.check()) {
          this.initialize();
          this.scene();
        }
        else console.error("canvas not supported");
    };

    Pandora.prototype.trucate = function(value) {
        if(value < 0) {
            value = 0;
        }
        if(value > 255) {
            value = 255;
        }
        return value;
    };

/////////////////////////////// RESOURCES

    Pandora.prototype.gradients = function(canvas, ctx, gradient) {
      switch (gradient) {
        case "blackToWhite":
          var grd = ctx.createLinearGradient(0, canvas.height, canvas.width, canvas.height);
          grd.addColorStop(0,"black");
          grd.addColorStop(1,"white");
          return grd;
        break;

        case "whiteToBlack":
          var grd = ctx.createLinearGradient(0, canvas.height, canvas.width, canvas.height);
          grd.addColorStop(0,"white");
          grd.addColorStop(1,"black");
          return grd;
        break;

        case "pannacotta":
          var grd = ctx.createLinearGradient(0, canvas.height, canvas.width, canvas.height);
          grd.addColorStop(0, 'rgba(220, 43, 59, 1.000)');
          grd.addColorStop(1, 'rgba(175, 214, 211, 1.000)');
          return grd;
        break;

        case "light-brick":
          var grd = ctx.createLinearGradient(0, canvas.height, canvas.width, canvas.height);
          grd.addColorStop(0, 'rgba(220, 43, 59, 1.000)');
          grd.addColorStop(1, 'rgba(147, 96, 92, 1.000)');
          return grd;
        break;

        case "brick":
          var grd = ctx.createLinearGradient(0, canvas.height, canvas.width, canvas.height);
          grd.addColorStop(0, 'rgba(220, 43, 59, 1.000)');
          grd.addColorStop(1, 'rgba(147, 96, 92, 1.000)');
          return grd;
        break;

        case "sprite":
        var grd = ctx.createLinearGradient(0, canvas.height, canvas.width, canvas.height);
        grd.addColorStop(0, 'rgba(78, 145, 246, 1.000)');
        grd.addColorStop(1, 'rgba(241, 251, 54, 1.000)');
        return grd;
      break;

    }};

    Pandora.prototype.RGBtoHSV = function(r, g, b) {
          r = parseFloat(r) / 255;
          g = parseFloat(g) / 255;
          b = parseFloat(b) / 255;
          var max = Math.max(r, g, b);
          var min = Math.min(r, g, b);
          var v = max;
          var delta = max - min;
          if(max != 0)
            var s = delta / max;
          else {
            var s = 0;
            var h = -1;
          }
          if(r == max)
            var h = (g - b) / delta;
          else if(g == max)
            var h = 2 + (b - r) / delta;
          else
            var h = 4 + (r - g) / delta;
          var h = h * 60;
          if(h < 0)
            h += 360;

          return {
             h: h,
             s: s,
             v: v
          };
    };

    Pandora.prototype.MAXMIN = function(elems) {
        var max = elems[0];
        var min = elems[0];
        for(var i=0; i<elems.length; i++) {
          if(elems[i] > max)
            max = elems[i];
          else if(elems[i] < min)
            min = elems[i];
        }

        return {
          max : max,
          min : min
        };

    };

    Pandora.prototype.RGBtoCMYK = function(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        var max = this.MAXMIN([r, g, b]).max;
        var min = this.MAXMIN([r, g, b]).min;
        var k = 1 - max;
        var c = (1 - r - k) / (1 - k);
        var m = (1 - g - k) / (1 - k);
        var y = (1 - b - k) / (1 - k);
        return {
          c : c,
          m : m,
          y : y,
          k : k
        };
    };

    Pandora.prototype.CMYKtoRGB = function(c, m, y, k) {
        return {
          r :  255 *(1 - c) * (1 - k),
          g : 255 *(1 - m) * (1 - k),
          b : 255 *(1 - y) * (1 - k)
        };
    };

    Pandora.prototype.changeSinContrast = function(par) {
        var dPow = 4;
        var iMid = 128;

        if (par > 0 && par < iMid) {
            par = Math.sin( Math.PI * ((90-(par/dPow)) / 180)) * par;
        } else if (par >= iMid) {
            par = Math.sin( Math.PI * ((90-((256-par))/dPow)/180) ) * par;
        }
        return par;
    };

    //------ StackBlur github.com/flozz/StackBlur
    Pandora.prototype.boxBlurCanvasRGBA = function( canvas, context, top_x, top_y, width, height, radius, iterations ){
      var mul_table = [ 1,57,41,21,203,34,97,73,227,91,149,62,105,45,39,137,241,107,3,173,39,71,65,238,219,101,187,87,81,151,141,133,249,117,221,209,197,187,177,169,5,153,73,139,133,127,243,233,223,107,103,99,191,23,177,171,165,159,77,149,9,139,135,131,253,245,119,231,224,109,211,103,25,195,189,23,45,175,171,83,81,79,155,151,147,9,141,137,67,131,129,251,123,30,235,115,113,221,217,53,13,51,50,49,193,189,185,91,179,175,43,169,83,163,5,79,155,19,75,147,145,143,35,69,17,67,33,65,255,251,247,243,239,59,29,229,113,111,219,27,213,105,207,51,201,199,49,193,191,47,93,183,181,179,11,87,43,85,167,165,163,161,159,157,155,77,19,75,37,73,145,143,141,35,138,137,135,67,33,131,129,255,63,250,247,61,121,239,237,117,29,229,227,225,111,55,109,216,213,211,209,207,205,203,201,199,197,195,193,48,190,47,93,185,183,181,179,178,176,175,173,171,85,21,167,165,41,163,161,5,79,157,78,154,153,19,75,149,74,147,73,144,143,71,141,140,139,137,17,135,134,133,66,131,65,129,1];
      var shg_table = [0,9,10,10,14,12,14,14,16,15,16,15,16,15,15,17,18,17,12,18,16,17,17,19,19,18,19,18,18,19,19,19,20,19,20,20,20,20,20,20,15,20,19,20,20,20,21,21,21,20,20,20,21,18,21,21,21,21,20,21,17,21,21,21,22,22,21,22,22,21,22,21,19,22,22,19,20,22,22,21,21,21,22,22,22,18,22,22,21,22,22,23,22,20,23,22,22,23,23,21,19,21,21,21,23,23,23,22,23,23,21,23,22,23,18,22,23,20,22,23,23,23,21,22,20,22,21,22,24,24,24,24,24,22,21,24,23,23,24,21,24,23,24,22,24,24,22,24,24,22,23,24,24,24,20,23,22,23,24,24,24,24,24,24,24,23,21,23,22,23,24,24,24,22,24,24,24,23,22,24,24,25,23,25,25,23,24,25,25,24,22,25,25,25,24,23,24,25,25,25,25,25,25,25,25,25,25,25,25,23,25,23,24,25,25,25,25,25,25,25,25,25,24,22,25,25,23,25,25,20,24,25,24,25,25,22,24,25,24,25,24,25,25,24,25,25,25,25,22,25,25,25,24,25,24,25,18];
    	if ( isNaN(radius) || radius < 1 ) return;

    	radius |= 0;

    	if ( isNaN(iterations) ) iterations = 1;
    	iterations |= 0;
    	if ( iterations > 3 ) iterations = 3;
    	if ( iterations < 1 ) iterations = 1;

    	var imageData;

    	try {
    	  try {
    		imageData = context.getImageData( top_x, top_y, width, height );
    	  } catch(e) {

    		// NOTE: this part is supposedly only needed if you want to work with local files
    		// so it might be okay to remove the whole try/catch block and just use
    		// imageData = context.getImageData( top_x, top_y, width, height );
    		try {
    			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
    			imageData = context.getImageData( top_x, top_y, width, height );
    		} catch(e) {
    			alert("Cannot access local image");
    			throw new Error("unable to access local image data: " + e);
    			return;
    		}
    	  }
    	} catch(e) {
    	  alert("Cannot access image");
    	  throw new Error("unable to access image data: " + e);
    	  return;
    	}

    	var pixels = imageData.data;

    	var rsum,gsum,bsum,asum,x,y,i,p,p1,p2,yp,yi,yw,idx,pa;
    	var wm = width - 1;
      	var hm = height - 1;
        var wh = width * height;
    	var rad1 = radius + 1;

    	var mul_sum = mul_table[radius];
    	var shg_sum = shg_table[radius];

    	var r = [];
        var g = [];
        var b = [];
    	var a = [];

    	var vmin = [];
    	var vmax = [];

    	while ( iterations-- > 0 ){
    		yw = yi = 0;

    		for ( y=0; y < height; y++ ){
    			rsum = pixels[yw]   * rad1;
    			gsum = pixels[yw+1] * rad1;
    			bsum = pixels[yw+2] * rad1;
    			asum = pixels[yw+3] * rad1;


    			for( i = 1; i <= radius; i++ ){
    				p = yw + (((i > wm ? wm : i )) << 2 );
    				rsum += pixels[p++];
    				gsum += pixels[p++];
    				bsum += pixels[p++];
    				asum += pixels[p]
    			}

    			for ( x = 0; x < width; x++ ) {
    				r[yi] = rsum;
    				g[yi] = gsum;
    				b[yi] = bsum;
    				a[yi] = asum;

    				if( y==0) {
    					vmin[x] = ( ( p = x + rad1) < wm ? p : wm ) << 2;
    					vmax[x] = ( ( p = x - radius) > 0 ? p << 2 : 0 );
    				}

    				p1 = yw + vmin[x];
    				p2 = yw + vmax[x];

    				rsum += pixels[p1++] - pixels[p2++];
    				gsum += pixels[p1++] - pixels[p2++];
    				bsum += pixels[p1++] - pixels[p2++];
    				asum += pixels[p1]   - pixels[p2];

    				yi++;
    			}
    			yw += ( width << 2 );
    		}

    		for ( x = 0; x < width; x++ ) {
    			yp = x;
    			rsum = r[yp] * rad1;
    			gsum = g[yp] * rad1;
    			bsum = b[yp] * rad1;
    			asum = a[yp] * rad1;

    			for( i = 1; i <= radius; i++ ) {
    			  yp += ( i > hm ? 0 : width );
    			  rsum += r[yp];
    			  gsum += g[yp];
    			  bsum += b[yp];
    			  asum += a[yp];
    			}

    			yi = x << 2;
    			for ( y = 0; y < height; y++) {

    				pixels[yi+3] = pa = (asum * mul_sum) >>> shg_sum;
    				if ( pa > 0 )
    				{
    					pa = 255 / pa;
    					pixels[yi]   = ((rsum * mul_sum) >>> shg_sum) * pa;
    					pixels[yi+1] = ((gsum * mul_sum) >>> shg_sum) * pa;
    					pixels[yi+2] = ((bsum * mul_sum) >>> shg_sum) * pa;
    				} else {
    					pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
    				}
    				if( x == 0 ) {
    					vmin[y] = ( ( p = y + rad1) < hm ? p : hm ) * width;
    					vmax[y] = ( ( p = y - radius) > 0 ? p * width : 0 );
    				}

    				p1 = x + vmin[y];
    				p2 = x + vmax[y];

    				rsum += r[p1] - r[p2];
    				gsum += g[p1] - g[p2];
    				bsum += b[p1] - b[p2];
    				asum += a[p1] - a[p2];

    				yi += width << 2;
    			}
    		}
    	}

    	context.putImageData( imageData, top_x, top_y );

    };


/////////////////////////////// ADJUSTMENTS

    // Brightness ADJUSTMENT  0 -
    Pandora.prototype.brightness = function(canvas, ctx, params) {
        var adjustment = parseInt(params[0]);
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var px = imgData.data;

        for (var i=0; i<px.length; i+=4) {
            px[i] = this.trucate(px[i] + adjustment);
            px[i+1] = this.trucate(px[i+1] + adjustment);
            px[i+2] = this.trucate(px[i+2] + adjustment);
        }
        ctx.putImageData(imgData, 0, 0);
    };

    // Contrast ADJUSTMENT 0 -
    Pandora.prototype.contrast = function(canvas, ctx, params) {
        var contrast = parseInt(params[0]);
        var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var px = imgData.data;

        for (var i = 0; i < px.length; i += 4) {
          px[i] = factor * (px[i] - 128) + 128;
          px[i+1] = factor * (px[i+1] - 128) + 128;
          px[i+2] = factor * (px[i+2] - 128) + 128;
        }
        ctx.putImageData(imgData, 0, 0);
    };

    // Color balance ADJUSTMENT
    Pandora.prototype.colorBalance = function(canvas, ctx, params) {
        var R_ADJ = parseInt(params[0]);
        var G_ADJ = parseInt(params[1]);
        var B_ADJ = parseInt(params[2]);

        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var px = imgData.data;

        for (var i=0; i<px.length; i+=4) {
            px[i] = this.trucate(px[i] + R_ADJ);
            px[i+1] = this.trucate(px[i+1] + G_ADJ);
            px[i+2] = this.trucate(px[i+2] + B_ADJ);
        }
        ctx.putImageData(imgData, 0, 0);
    };

    // Exposure ADJUSTMENT  0-100
    Pandora.prototype.exposure = function(canvas, ctx, params) {
        var value = parseFloat(params[0]) / 100;
        if(value < 0) value = 0;
        else if(value > 1) value = 1;
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var px = imgData.data;

        for (var i = 0; i < px.length; i += 4) {
          px[i] = Math.pow(px[i], (1 + value));
          px[i+1] = Math.pow(px[i+1], (1 + value));
          px[i+2] = Math.pow(px[i+2], (1 + value));
        }
        ctx.putImageData(imgData, 0, 0);
    };

    // Brightness and Contrast Auto ADJUSTMENT
    Pandora.prototype.autoAdj = function(canvas, ctx, params) {
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var px = imgData.data;
        var lum = 0;
        for(var i = 0; i < px.length; i += 4) {
          lum += (px[i] + px[i+1] + px[i+2])/3;
        }
        var diff = Math.round(127 - (lum / (px.length/4)));

        if(diff < -45)                      diff -= (diff * 70) / 100;
        else if(diff >= -45 && diff < -20)   diff = -10;
        else if(diff >= -20 && diff <= 10)  diff = 0;
        else if(diff > 45)                  diff -= (diff * 40) / 100;

        this.brightness(canvas, ctx, [parseInt(diff)]);
        this.contrast(canvas, ctx, [parseInt(diff)]);
    };

    // Brightness ADJUSTMENT  0 -
    Pandora.prototype.brightness = function(canvas, ctx, params) {
        var adjustment = parseInt(params[0]);
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var px = imgData.data;

        for (var i=0; i<px.length; i+=4) {
            px[i] = this.trucate(px[i] + adjustment);
            px[i+1] = this.trucate(px[i+1] + adjustment);
            px[i+2] = this.trucate(px[i+2] + adjustment);
        }
        ctx.putImageData(imgData, 0, 0);
    };

    // Contrast ADJUSTMENT 0 -
    Pandora.prototype.contrast = function(canvas, ctx, params) {
        var contrast = parseInt(params[0]);
        var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var px = imgData.data;

        for (var i = 0; i < px.length; i += 4) {
          px[i] = factor * (px[i] - 128) + 128;
          px[i+1] = factor * (px[i+1] - 128) + 128;
          px[i+2] = factor * (px[i+2] - 128) + 128;
        }
        ctx.putImageData(imgData, 0, 0);
    };

    // Color balance ADJUSTMENT
    Pandora.prototype.colorBalance = function(canvas, ctx, params) {
        var R_ADJ = parseInt(params[0]);
        var G_ADJ = parseInt(params[1]);
        var B_ADJ = parseInt(params[2]);

        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var px = imgData.data;

        for (var i=0; i<px.length; i+=4) {
            px[i] = this.trucate(px[i] + R_ADJ);
            px[i+1] = this.trucate(px[i+1] + G_ADJ);
            px[i+2] = this.trucate(px[i+2] + B_ADJ);
        }
        ctx.putImageData(imgData, 0, 0);
    };

    // Exposure ADJUSTMENT  0-100
    Pandora.prototype.exposure = function(canvas, ctx, params) {
        var value = parseFloat(params[0]) / 100;
        if(value < 0) value = 0;
        else if(value > 1) value = 1;
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var px = imgData.data;

        for (var i = 0; i < px.length; i += 4) {
          px[i] = Math.pow(px[i], (1 + value));
          px[i+1] = Math.pow(px[i+1], (1 + value));
          px[i+2] = Math.pow(px[i+2], (1 + value));
        }
        ctx.putImageData(imgData, 0, 0);
    };

    // Brightness and Contrast Auto ADJUSTMENT
    Pandora.prototype.autoAdj = function(canvas, ctx, params) {
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var px = imgData.data;
        var lum = 0;
        for(var i = 0; i < px.length; i += 4) {
          lum += (px[i] + px[i+1] + px[i+2])/3;
        }
        var diff = Math.round(127 - (lum / (px.length/4)));

        if(diff < -45)                      diff -= (diff * 70) / 100;
        else if(diff >= -45 && diff < -20)   diff = -10;
        else if(diff >= -20 && diff <= 10)  diff = 0;
        else if(diff > 45)                  diff -= (diff * 40) / 100;

        this.brightness(canvas, ctx, [parseInt(diff)]);
        this.contrast(canvas, ctx, [parseInt(diff)]);
    };

    // Selective color correction ADJUSTMENT BETA
    Pandora.prototype.selectiveCorrection = function(canvas, ctx, params) {
        var channel = params[0];
          var c = params[1] / 100;
          var m = params[2] / 100;
          var y = params[3] / 100;
          var k = params[4] / 100;

        var RGB, HSV, HUE, CMYK = 0;

        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var px = imgData.data;

        for (var i = 0; i < px.length; i += 4) {
          var check = false;
          HSV = this.RGBtoHSV(px[i], px[i+1], px[i+2]);
          HUE = HSV.h;
          CMYK = this.RGBtoCMYK(px[i], px[i+1], px[i+2]);

          if(channel == "R" && (HUE > 330 || HUE <= 30) && HSV.s > 0.56)  check = true;
          if(channel == "Y" && HUE > 30 && HUE <= 70)     check = true;
          if(channel == "G" && HUE > 70 && HUE <= 150)     check = true;
          if(channel == "C" && HUE > 150 && HUE <= 210)    check = true;
          if(channel == "B" && HUE > 210 && HUE <= 270)    check = true;
          if(channel == "M" && HUE > 270 && HUE <= 330)    check = true;
          //if(channel == "N" && (HSV.v > 0.1 && HSV.v < 0.9))    check = true;

          if(check) {
            RGB = this.CMYKtoRGB(CMYK.c + c, CMYK.m + m, CMYK.y + y, CMYK.k + k);
              px[i] = RGB.r;
              px[i+1] = RGB.g;
              px[i+2] = RGB.b;
          }
          else {
            px[i] = 255;
            px[i+1] = 255;
            px[i+2] = 255;
            px[i+3] = 0;
          }
        }
        var offcanvas = document.createElement("canvas");
        var offctx = offcanvas.getContext("2d");
        offcanvas.width = canvas.width;
        offcanvas.height = canvas.height;
          offctx.putImageData(imgData, 0, 0);
          this.blur(offcanvas, offctx, [1]);

        ctx.globalCompositeOperation = "soft-light";
        ctx.globalAlpha = 0.6;
        ctx.drawImage(offcanvas,0,0);
    };

/////////////////////////////// EFFECTS

    // Blend effect
    Pandora.prototype.fill = function(canvas, ctx, params) {
      var blendMode = params[0];
      var fillingType = params[1];
      var fillingValue = params[2];
      var alpha = params[3];

      // set blending mode
      ctx.globalCompositeOperation = blendMode;
      ctx.beginPath();

      // draw rect over all canvas
      ctx.rect(0, 0, canvas.width, canvas.height);

      if(fillingType=="gradient")
        var fillingValue = this.gradients(canvas, ctx, fillingValue);

      ctx.fillStyle = fillingValue;
      ctx.globalAlpha = alpha;
      ctx.fill();
    };

    // Black & White effect
    Pandora.prototype.bw = function(canvas, ctx, params) {
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var px = imgData.data;

        for (var i = 0; i < px.length; i += 4) {
            var grayscale = px[i] * .3 + px[i+1] * .59 + px[i+2] * .11;
            px[i] = grayscale;
            px[i+1] = grayscale;
            px[i+2] = grayscale;
        }
        ctx.putImageData(imgData, 0, 0);
    };

    // Noise effect
    Pandora.prototype.noise = function(canvas, ctx, params) {
      var layerCanvas = document.createElement("canvas");
      var layerCtx = layerCanvas.getContext("2d");
      var imgData = layerCtx.getImageData(0, 0, canvas.width, canvas.height);
      layerCanvas.width = canvas.width;
      layerCanvas.height = canvas.height;

      if(params[0] != "" && typeof params[0] !== 'undefined')
        var alpha = params[0];
      else
        var alpha = 0.1;

      if(params[1] !== 'undefined') {
        var blendMode = params[1];
        ctx.globalCompositeOperation = blendMode;
      }

      var px = imgData.data;

      for (var i = 0; i < px.length; i += 4) {
          var color = Math.round(Math.random() * 255);
          px[i] = px[i+1] = px[i+2] = color;
          px[i+3] =  parseInt(255 * alpha);
      }
      layerCtx.putImageData(imgData, 0, 0);
      ctx.drawImage(layerCanvas, 0, 0);
    };

    // Invert effect
    Pandora.prototype.invert = function(canvas, ctx, params) {
        var activeChannels = [];
        var optionalValue = 255;
        if(params[0] !== 'undefined'&& params[0] == "true")   activeChannels.push(0);
        if(params[1] !== 'undefined'&& params[1] == "true")   activeChannels.push(1);
        if(params[2] !== 'undefined'&& params[2] == "true")   activeChannels.push(2);
        if(typeof params[3] !== 'undefined')  optionalValue = parseInt(params[3]);

        if(activeChannels.length == 0)  activeChannels.push(0,1,2);

        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var px = imgData.data;

        for (var i = 0; i < px.length / 4; i++) {
          var pixelSelected = i * 4;
          for(var j = 0; j < activeChannels.length; j++) {
            px[pixelSelected + activeChannels[j]] = this.trucate(optionalValue - px[pixelSelected + activeChannels[j]]);
          }
        }
        ctx.putImageData(imgData, 0, 0);
    };

    // Blur effect (StackBlur script)
    Pandora.prototype.blur = function(canvas, ctx, params) {
      var ratio = 1;
      if(typeof params[0] != 'undefined' && params[0] != "")
        ratio = params[0];

        this.boxBlurCanvasRGBA(canvas, ctx, 0, 0, canvas.width, canvas.height, 10, ratio);
    };

    // Sepia effect
    Pandora.prototype.sepia = function(canvas, ctx, params) {
      var r = [0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 17, 18, 19, 19, 20, 21, 22, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 40, 41, 42, 44, 45, 47, 48, 49, 52, 54, 55, 57, 59, 60, 62, 65, 67, 69, 70, 72, 74, 77, 79, 81, 83, 86, 88, 90, 92, 94, 97, 99, 101, 103, 107, 109, 111, 112, 116, 118, 120, 124, 126, 127, 129, 133, 135, 136, 140, 142, 143, 145, 149, 150, 152, 155, 157, 159, 162, 163, 165, 167, 170, 171, 173, 176, 177, 178, 180, 183, 184, 185, 188, 189, 190, 192, 194, 195, 196, 198, 200, 201, 202, 203, 204, 206, 207, 208, 209, 211, 212, 213, 214, 215, 216, 218, 219, 219, 220, 221, 222, 223, 224, 225, 226, 227, 227, 228, 229, 229, 230, 231, 232, 232, 233, 234, 234, 235, 236, 236, 237, 238, 238, 239, 239, 240, 241, 241, 242, 242, 243, 244, 244, 245, 245, 245, 246, 247, 247, 248, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255];
	    var g = [0, 0, 1, 2, 2, 3, 5, 5, 6, 7, 8, 8, 10, 11, 11, 12, 13, 15, 15, 16, 17, 18, 18, 19, 21, 22, 22, 23, 24, 26, 26, 27, 28, 29, 31, 31, 32, 33, 34, 35, 35, 37, 38, 39, 40, 41, 43, 44, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 83, 84, 85, 86, 88, 89, 90, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 105, 106, 107, 108, 109, 111, 113, 114, 115, 117, 118, 119, 120, 122, 123, 124, 126, 127, 128, 129, 131, 132, 133, 135, 136, 137, 138, 140, 141, 142, 144, 145, 146, 148, 149, 150, 151, 153, 154, 155, 157, 158, 159, 160, 162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174, 175, 176, 177, 178, 179, 181, 182, 183, 184, 186, 186, 187, 188, 189, 190, 192, 193, 194, 195, 195, 196, 197, 199, 200, 201, 202, 202, 203, 204, 205, 206, 207, 208, 208, 209, 210, 211, 212, 213, 214, 214, 215, 216, 217, 218, 219, 219, 220, 221, 222, 223, 223, 224, 225, 226, 226, 227, 228, 228, 229, 230, 231, 232, 232, 232, 233, 234, 235, 235, 236, 236, 237, 238, 238, 239, 239, 240, 240, 241, 242, 242, 242, 243, 244, 245, 245, 246, 246, 247, 247, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 255];
	    var b = [53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 57, 57, 57, 58, 58, 58, 59, 59, 59, 60, 61, 61, 61, 62, 62, 63, 63, 63, 64, 65, 65, 65, 66, 66, 67, 67, 67, 68, 69, 69, 69, 70, 70, 71, 71, 72, 73, 73, 73, 74, 74, 75, 75, 76, 77, 77, 78, 78, 79, 79, 80, 81, 81, 82, 82, 83, 83, 84, 85, 85, 86, 86, 87, 87, 88, 89, 89, 90, 90, 91, 91, 93, 93, 94, 94, 95, 95, 96, 97, 98, 98, 99, 99, 100, 101, 102, 102, 103, 104, 105, 105, 106, 106, 107, 108, 109, 109, 110, 111, 111, 112, 113, 114, 114, 115, 116, 117, 117, 118, 119, 119, 121, 121, 122, 122, 123, 124, 125, 126, 126, 127, 128, 129, 129, 130, 131, 132, 132, 133, 134, 134, 135, 136, 137, 137, 138, 139, 140, 140, 141, 142, 142, 143, 144, 145, 145, 146, 146, 148, 148, 149, 149, 150, 151, 152, 152, 153, 153, 154, 155, 156, 156, 157, 157, 158, 159, 160, 160, 161, 161, 162, 162, 163, 164, 164, 165, 165, 166, 166, 167, 168, 168, 169, 169, 170, 170, 171, 172, 172, 173, 173, 174, 174, 175, 176, 176, 177, 177, 177, 178, 178, 179, 180, 180, 181, 181, 181, 182, 182, 183, 184, 184, 184, 185, 185, 186, 186, 186, 187, 188, 188, 188, 189, 189, 189, 190, 190, 191, 191, 192, 192, 193, 193, 193, 194, 194, 194, 195, 196, 196, 196, 197, 197, 197, 198, 199];

      var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var px = imgData.data;

      for (var i = 0; i < px.length; i += 4) {
          px[i] = r[px[i]];
          px[i+1] = g[px[i+1]];
          px[i+2] = b[px[i+2]];
      }
      ctx.putImageData(imgData, 0, 0);
    };

    // HDR effect
    Pandora.prototype.HDR = function(canvas, ctx, params) {
      var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var px = imgData.data;
      var iMid = 128;
      var dPow = 3;

      for (var i=0; i < px.length; i+=4) {
          px[i] = this.changeSinContrast(px[i]);
          px[i+1] = this.changeSinContrast(px[i+1]);
          px[i+2] = this.changeSinContrast(px[i+2]);
      }
      ctx.putImageData(imgData, 0, 0);
    };

/////////////////////////////// PRESETS

    Pandora.prototype.brilliantRed = function(canvas, ctx, params) {
      this.fill(canvas, ctx, ['difference', 'color', '#dc2b3b', 0.22]);
      this.fill(canvas, ctx, ['soft-light', 'gradient', 'pannacotta', 1]);
      this.fill(canvas, ctx, ['luminosity', 'gradient', 'brick', 0.22]);
      this.fill(canvas, ctx, ['color-burn', 'color', '#93605c', 0.25]);
      this.fill(canvas, ctx, ['saturation', 'gradient', 'light-brick', 0.22]);
      this.contrast(canvas, ctx, ['20']);
    };

    Pandora.prototype.redBw = function(canvas, ctx, params) {
      this.bw(canvas, ctx, []);
      this.colorBalance(canvas, ctx, [40, 20, 20]);
      this.fill(canvas, ctx, ['lighten', 'color', '#ff0000', 0.08]);
      this.fill(canvas, ctx, ['lighten', 'color', '#406562', 0.5]);
      this.contrast(canvas, ctx, [13]);
    };

    Pandora.prototype.darkBw = function(canvas, ctx, params) {
      this.bw(canvas, ctx, []);
      this.fill(canvas, ctx, ['soft-light', 'color', '#000000', 1]);
      this.contrast(canvas, ctx, [10]);
    };

    Pandora.prototype.vintage = function(canvas, ctx, params) {
      this.fill(canvas, ctx, ['exclusion', 'color', '#0a0a30', 1]);
      this.fill(canvas, ctx, ['overlay', 'color', '#e76c79', 1]);
      this.fill(canvas, ctx, ['multiply', 'color', '#b8dff4', 0.4]);
      this.fill(canvas, ctx, ['overlay', 'color', '#4fef3e', 0.26]);
      this.fill(canvas, ctx, ['overlay', 'color', '#00baff', 0.35]);
      this.contrast(canvas, ctx, [15]);
    };

    Pandora.prototype.sprite = function(canvas, ctx, params) {
      this.fill(canvas, ctx, ['multiply', 'color', '#f7d9ad', 1]);
      this.fill(canvas, ctx, ['soft-light', 'color', '#4e91f6', 0.61]);
      this.fill(canvas, ctx, ['color-dodge', 'color', '#93615d', 0.35]);
      this.fill(canvas, ctx, ['soft-light', 'gradient', 'sprite', 0.59]);
      this.brightness(canvas, ctx, [-6]);
      this.contrast(canvas, ctx, [40]);
      this.colorBalance(canvas, ctx, [0, 35, 60]);
    };

    Pandora.prototype.vintage2 = function(canvas, ctx, params) {
      this.autoAdj(canvas, ctx, []);
      this.exposure(canvas, ctx, [3]);
      this.fill(canvas, ctx, ['soft-light', 'color', '#ffb6e5', 0.6]);
      this.fill(canvas, ctx, ['soft-light', 'color', '#001b70', 1]);
      this.fill(canvas, ctx, ['exclusion', 'color', '#00353b', 0.8]);
      this.fill(canvas, ctx, ['color-dodge', 'color', '#8fe1ff', 0.3]);
    };

    Pandora.prototype.fluoNight = function(canvas, ctx, params) {
      this.fill(canvas, ctx, ['soft-light', 'color', '#03dbf0', 0.43]);
      this.fill(canvas, ctx, ['overlay', 'color', '#9c4b4b', 0.70]);
      this.fill(canvas, ctx, ['difference', 'color', '#293268', 0.30]);
      this.selectiveCorrection(canvas, ctx, ['R', '-20','20','15','5']);
      this.selectiveCorrection(canvas, ctx, ['G', '20','-20','20','0']);
      this.selectiveCorrection(canvas, ctx, ['Y', '-20','0','30','0']);
      this.selectiveCorrection(canvas, ctx, ['C', '20','10','-20','15']);
      this.selectiveCorrection(canvas, ctx, ['B', '20','20','0','10']);
      this.selectiveCorrection(canvas, ctx, ['M', '-10','18','-18','0']);
      this.fill(canvas, ctx, ['lighter', 'color', '#293268', 0.05]);
    };

    Pandora.prototype.colorfull = function(canvas, ctx, params) {
      this.selectiveCorrection(canvas, ctx, ['R', '0','8','20','0']);
      this.selectiveCorrection(canvas, ctx, ['G', '20','-20','20','0']);
      this.selectiveCorrection(canvas, ctx, ['Y', '10','0','10','0']);
      this.selectiveCorrection(canvas, ctx, ['C', '20','0','-20','0']);
      this.selectiveCorrection(canvas, ctx, ['B', '20','20','0','0']);
      this.selectiveCorrection(canvas, ctx, ['M', '20','20','0','0']);
    };

    Pandora.prototype.newpreset = function(canvas, ctx, params) {
      this.selectiveCorrection(canvas, ctx, ['R', '0','8','20','0']);
      this.selectiveCorrection(canvas, ctx, ['G', '20','-20','20','0']);
      this.selectiveCorrection(canvas, ctx, ['Y', '10','0','10','0']);
      this.selectiveCorrection(canvas, ctx, ['C', '20','0','-20','0']);
      this.selectiveCorrection(canvas, ctx, ['B', '20','20','0','0']);
      this.selectiveCorrection(canvas, ctx, ['M', '20','20','0','0']);
    };
