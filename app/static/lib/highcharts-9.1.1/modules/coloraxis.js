/*
 Highcharts JS v9.1.1 (2021-06-03)

 ColorAxis module

 (c) 2012-2021 Pawel Potaczek

 License: www.highcharts.com/license
*/
'use strict';(function(b){"object"===typeof module&&module.exports?(b["default"]=b,module.exports=b):"function"===typeof define&&define.amd?define("highcharts/modules/color-axis",["highcharts"],function(n){b(n);b.Highcharts=n;return b}):b("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(b){function n(b,g,p,q){b.hasOwnProperty(g)||(b[g]=q.apply(null,p))}b=b?b._modules:{};n(b,"Mixins/ColorSeries.js",[],function(){return{colorPointMixin:{setVisible:function(b){var g=this,p=b?"show":"hide";
g.visible=g.options.visible=!!b;["graphic","dataLabel"].forEach(function(b){if(g[b])g[b][p]()});this.series.buildKDTree()}},colorSeriesMixin:{optionalAxis:"colorAxis",colorAxis:0,translateColors:function(){var b=this,g=this.options.nullColor,p=this.colorAxis,q=this.colorKey;(this.data.length?this.data:this.points).forEach(function(k){var r=k.getNestedProperty(q);(r=k.options.color||(k.isNull||null===k.value?g:p&&"undefined"!==typeof r?p.toColor(r,k):k.color||b.color))&&k.color!==r&&(k.color=r,"point"===
b.options.legendType&&k.legendItem&&b.chart.legend.colorizeItem(k,k.visible))})}}}});n(b,"Core/Axis/ColorAxis.js",[b["Core/Axis/Axis.js"],b["Core/Chart/Chart.js"],b["Core/Color/Color.js"],b["Mixins/ColorSeries.js"],b["Core/Animation/Fx.js"],b["Core/Globals.js"],b["Core/Legend.js"],b["Mixins/LegendSymbol.js"],b["Core/Color/Palette.js"],b["Core/Series/Point.js"],b["Core/Series/Series.js"],b["Core/Utilities.js"]],function(b,g,p,q,k,r,n,C,z,D,w,t){var E=this&&this.__extends||function(){var b=function(d,
a){b=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,f){a.__proto__=f}||function(a,f){for(var c in f)f.hasOwnProperty(c)&&(a[c]=f[c])};return b(d,a)};return function(d,a){function c(){this.constructor=d}b(d,a);d.prototype=null===a?Object.create(a):(c.prototype=a.prototype,new c)}}(),x=p.parse;p=q.colorPointMixin;q=q.colorSeriesMixin;var F=r.noop,u=t.addEvent,A=t.extend,G=t.isNumber,B=t.merge,v=t.pick,H=t.splat;"";A(w.prototype,q);A(D.prototype,p);g.prototype.collectionsWithUpdate.push("colorAxis");
g.prototype.collectionsWithInit.colorAxis=[g.prototype.addColorAxis];var y=function(b){function d(a,c){var f=b.call(this,a,c)||this;f.beforePadding=!1;f.chart=void 0;f.coll="colorAxis";f.dataClasses=void 0;f.legendItem=void 0;f.legendItems=void 0;f.name="";f.options=void 0;f.stops=void 0;f.visible=!0;f.init(a,c);return f}E(d,b);d.prototype.init=function(a,c){var f=a.options.legend||{},e=c.layout?"vertical"!==c.layout:"vertical"!==f.layout;f=B(d.defaultColorAxisOptions,c,{showEmpty:!1,title:null,visible:f.enabled&&
(c?!1!==c.visible:!0)});this.coll="colorAxis";this.side=c.side||e?2:1;this.reversed=c.reversed||!e;this.opposite=!e;b.prototype.init.call(this,a,f);c.dataClasses&&this.initDataClasses(c);this.initStops();this.horiz=e;this.zoomEnabled=!1};d.prototype.initDataClasses=function(a){var c=this.chart,f,e=0,b=c.options.chart.colorCount,d=this.options,h=a.dataClasses.length;this.dataClasses=f=[];this.legendItems=[];a.dataClasses.forEach(function(a,m){a=B(a);f.push(a);if(c.styledMode||!a.color)"category"===
d.dataClassColor?(c.styledMode||(m=c.options.colors,b=m.length,a.color=m[e]),a.colorIndex=e,e++,e===b&&(e=0)):a.color=x(d.minColor).tweenTo(x(d.maxColor),2>h?.5:m/(h-1))})};d.prototype.hasData=function(){return!!(this.tickPositions||[]).length};d.prototype.setTickPositions=function(){if(!this.dataClasses)return b.prototype.setTickPositions.call(this)};d.prototype.initStops=function(){this.stops=this.options.stops||[[0,this.options.minColor],[1,this.options.maxColor]];this.stops.forEach(function(a){a.color=
x(a[1])})};d.prototype.setOptions=function(a){b.prototype.setOptions.call(this,a);this.options.crosshair=this.options.marker};d.prototype.setAxisSize=function(){var a=this.legendSymbol,c=this.chart,f=c.options.legend||{},e,b;a?(this.left=f=a.attr("x"),this.top=e=a.attr("y"),this.width=b=a.attr("width"),this.height=a=a.attr("height"),this.right=c.chartWidth-f-b,this.bottom=c.chartHeight-e-a,this.len=this.horiz?b:a,this.pos=this.horiz?f:e):this.len=(this.horiz?f.symbolWidth:f.symbolHeight)||d.defaultLegendLength};
d.prototype.normalizedValue=function(a){this.logarithmic&&(a=this.logarithmic.log2lin(a));return 1-(this.max-a)/(this.max-this.min||1)};d.prototype.toColor=function(a,c){var f=this.dataClasses,e=this.stops,b;if(f)for(b=f.length;b--;){var d=f[b];var h=d.from;e=d.to;if(("undefined"===typeof h||a>=h)&&("undefined"===typeof e||a<=e)){var l=d.color;c&&(c.dataClass=b,c.colorIndex=d.colorIndex);break}}else{a=this.normalizedValue(a);for(b=e.length;b--&&!(a>e[b][0]););h=e[b]||e[b+1];e=e[b+1]||h;a=1-(e[0]-
a)/(e[0]-h[0]||1);l=h.color.tweenTo(e.color,a)}return l};d.prototype.getOffset=function(){var a=this.legendGroup,c=this.chart.axisOffset[this.side];a&&(this.axisParent=a,b.prototype.getOffset.call(this),this.added||(this.added=!0,this.labelLeft=0,this.labelRight=this.width),this.chart.axisOffset[this.side]=c)};d.prototype.setLegendColor=function(){var a=this.reversed,c=a?1:0;a=a?0:1;c=this.horiz?[c,0,a,0]:[0,a,0,c];this.legendColor={linearGradient:{x1:c[0],y1:c[1],x2:c[2],y2:c[3]},stops:this.stops}};
d.prototype.drawLegendSymbol=function(a,c){var b=a.padding,e=a.options,m=this.horiz,l=v(e.symbolWidth,m?d.defaultLegendLength:12),h=v(e.symbolHeight,m?12:d.defaultLegendLength),g=v(e.labelPadding,m?16:30);e=v(e.itemDistance,10);this.setLegendColor();c.legendSymbol=this.chart.renderer.rect(0,a.baseline-11,l,h).attr({zIndex:1}).add(c.legendGroup);this.legendItemWidth=l+b+(m?e:g);this.legendItemHeight=h+b+(m?g:0)};d.prototype.setState=function(a){this.series.forEach(function(c){c.setState(a)})};d.prototype.setVisible=
function(){};d.prototype.getSeriesExtremes=function(){var a=this.series,c=a.length,b;this.dataMin=Infinity;for(this.dataMax=-Infinity;c--;){var e=a[c];var d=e.colorKey=v(e.options.colorKey,e.colorKey,e.pointValKey,e.zoneAxis,"y");var l=e.pointArrayMap;var h=e[d+"Min"]&&e[d+"Max"];if(e[d+"Data"])var g=e[d+"Data"];else if(l){g=[];l=l.indexOf(d);var k=e.yData;if(0<=l&&k)for(b=0;b<k.length;b++)g.push(v(k[b][l],k[b]))}else g=e.yData;h?(e.minColorValue=e[d+"Min"],e.maxColorValue=e[d+"Max"]):(g=w.prototype.getExtremes.call(e,
g),e.minColorValue=g.dataMin,e.maxColorValue=g.dataMax);"undefined"!==typeof e.minColorValue&&(this.dataMin=Math.min(this.dataMin,e.minColorValue),this.dataMax=Math.max(this.dataMax,e.maxColorValue));h||w.prototype.applyExtremes.call(e)}};d.prototype.drawCrosshair=function(a,c){var d=c&&c.plotX,e=c&&c.plotY,l=this.pos,g=this.len;if(c){var h=this.toPixels(c.getNestedProperty(c.series.colorKey));h<l?h=l-2:h>l+g&&(h=l+g+2);c.plotX=h;c.plotY=this.len-h;b.prototype.drawCrosshair.call(this,a,c);c.plotX=
d;c.plotY=e;this.cross&&!this.cross.addedToColorAxis&&this.legendGroup&&(this.cross.addClass("highcharts-coloraxis-marker").add(this.legendGroup),this.cross.addedToColorAxis=!0,this.chart.styledMode||"object"!==typeof this.crosshair||this.cross.attr({fill:this.crosshair.color}))}};d.prototype.getPlotLinePath=function(a){var c=this.left,d=a.translatedValue,e=this.top;return G(d)?this.horiz?[["M",d-4,e-6],["L",d+4,e-6],["L",d,e],["Z"]]:[["M",c,d],["L",c-6,d+6],["L",c-6,d-6],["Z"]]:b.prototype.getPlotLinePath.call(this,
a)};d.prototype.update=function(a,c){var d=this.chart.legend;this.series.forEach(function(a){a.isDirtyData=!0});(a.dataClasses&&d.allItems||this.dataClasses)&&this.destroyItems();b.prototype.update.call(this,a,c);this.legendItem&&(this.setLegendColor(),d.colorizeItem(this,!0))};d.prototype.destroyItems=function(){var a=this.chart;this.legendItem?a.legend.destroyItem(this):this.legendItems&&this.legendItems.forEach(function(c){a.legend.destroyItem(c)});a.isDirtyLegend=!0};d.prototype.destroy=function(){this.chart.isDirtyLegend=
!0;this.destroyItems();b.prototype.destroy.apply(this,[].slice.call(arguments))};d.prototype.remove=function(a){this.destroyItems();b.prototype.remove.call(this,a)};d.prototype.getDataClassLegendSymbols=function(){var a=this,c=a.chart,b=a.legendItems,d=c.options.legend,l=d.valueDecimals,g=d.valueSuffix||"",h;b.length||a.dataClasses.forEach(function(d,e){var f=!0,m=d.from,k=d.to,n=c.numberFormatter;h="";"undefined"===typeof m?h="< ":"undefined"===typeof k&&(h="> ");"undefined"!==typeof m&&(h+=n(m,
l)+g);"undefined"!==typeof m&&"undefined"!==typeof k&&(h+=" - ");"undefined"!==typeof k&&(h+=n(k,l)+g);b.push(A({chart:c,name:h,options:{},drawLegendSymbol:C.drawRectangle,visible:!0,setState:F,isDataClass:!0,setVisible:function(){f=a.visible=!f;a.series.forEach(function(a){a.points.forEach(function(a){a.dataClass===e&&a.setVisible(f)})});c.legend.colorizeItem(this,f)}},d))});return b};d.defaultLegendLength=200;d.defaultColorAxisOptions={lineWidth:0,minPadding:0,maxPadding:0,gridLineWidth:1,tickPixelInterval:72,
startOnTick:!0,endOnTick:!0,offset:0,marker:{animation:{duration:50},width:.01,color:z.neutralColor40},labels:{overflow:"justify",rotation:0},minColor:z.highlightColor10,maxColor:z.highlightColor100,tickLength:5,showInLegend:!0};d.keepProps=["legendGroup","legendItemHeight","legendItemWidth","legendItem","legendSymbol"];return d}(b);Array.prototype.push.apply(b.keepProps,y.keepProps);r.ColorAxis=y;["fill","stroke"].forEach(function(b){k.prototype[b+"Setter"]=function(){this.elem.attr(b,x(this.start).tweenTo(x(this.end),
this.pos),null,!0)}});u(g,"afterGetAxes",function(){var b=this,d=b.options;this.colorAxis=[];d.colorAxis&&(d.colorAxis=H(d.colorAxis),d.colorAxis.forEach(function(a,c){a.index=c;new y(b,a)}))});u(w,"bindAxes",function(){var b=this.axisTypes;b?-1===b.indexOf("colorAxis")&&b.push("colorAxis"):this.axisTypes=["colorAxis"]});u(n,"afterGetAllItems",function(b){var d=this,a=[],c,f,e=function(a){a=b.allItems.indexOf(a);-1!==a&&(d.destroyItem(b.allItems[a]),b.allItems.splice(a,1))};(this.chart.colorAxis||
[]).forEach(function(b){(c=b.options)&&c.showInLegend&&(c.dataClasses&&c.visible?a=a.concat(b.getDataClassLegendSymbols()):c.visible&&a.push(b),b.series.forEach(function(a){if(!a.options.showInLegend||c.dataClasses)"point"===a.options.legendType?a.points.forEach(function(a){e(a)}):e(a)}))});for(f=a.length;f--;)b.allItems.unshift(a[f])});u(n,"afterColorizeItem",function(b){b.visible&&b.item.legendColor&&b.item.legendSymbol.attr({fill:b.item.legendColor})});u(n,"afterUpdate",function(){var b=this.chart.colorAxis;
b&&b.forEach(function(b,a,c){b.update({},c)})});u(w,"afterTranslate",function(){(this.chart.colorAxis&&this.chart.colorAxis.length||this.colorAttribs)&&this.translateColors()});return y});n(b,"masters/modules/coloraxis.src.js",[],function(){})});
//# sourceMappingURL=coloraxis.js.map