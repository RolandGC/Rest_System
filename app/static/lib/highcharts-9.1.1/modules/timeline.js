/*
 Highcharts JS v9.1.1 (2021-06-03)

 Timeline series

 (c) 2010-2021 Highsoft AS
 Author: Daniel Studencki

 License: www.highcharts.com/license
*/
'use strict';(function(a){"object"===typeof module&&module.exports?(a["default"]=a,module.exports=a):"function"===typeof define&&define.amd?define("highcharts/modules/timeline",["highcharts"],function(k){a(k);a.Highcharts=k;return a}):a("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(a){function k(a,f,k,r){a.hasOwnProperty(f)||(a[f]=r.apply(null,k))}a=a?a._modules:{};k(a,"Series/Timeline/TimelinePoint.js",[a["Core/Series/SeriesRegistry.js"],a["Core/Utilities.js"]],function(a,f){var k=
this&&this.__extends||function(){var a=function(c,d){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,d){a.__proto__=d}||function(a,d){for(var c in d)d.hasOwnProperty(c)&&(a[c]=d[c])};return a(c,d)};return function(c,d){function v(){this.constructor=c}a(c,d);c.prototype=null===d?Object.create(d):(v.prototype=d.prototype,new v)}}(),r=a.seriesTypes.pie.prototype.pointClass,y=f.defined,h=f.isNumber,z=f.merge,q=f.objectEach,w=f.pick;return function(a){function c(){var d=null!==a&&a.apply(this,
arguments)||this;d.options=void 0;d.series=void 0;return d}k(c,a);c.prototype.alignConnector=function(){var a=this.series,c=this.connector,m=this.dataLabel,h=this.dataLabel.options=z(a.options.dataLabels,this.options.dataLabels),g=this.series.chart,p=c.getBBox(),e=p.x+m.translateX;p=p.y+m.translateY;g.inverted?p-=m.options.connectorWidth/2:e+=m.options.connectorWidth/2;g=g.isInsidePlot(e,p);c[g?"animate":"attr"]({d:this.getConnectorPath()});a.chart.styledMode||c.attr({stroke:h.connectorColor||this.color,
"stroke-width":h.connectorWidth,opacity:m[y(m.newOpacity)?"newOpacity":"opacity"]})};c.prototype.drawConnector=function(){var a=this.series;this.connector||(this.connector=a.chart.renderer.path(this.getConnectorPath()).attr({zIndex:-1}).add(this.dataLabel));this.series.chart.isInsidePlot(this.dataLabel.x,this.dataLabel.y)&&this.alignConnector()};c.prototype.getConnectorPath=function(){var a=this.series.chart,c=this.series.xAxis.len,m=a.inverted,f=m?"x2":"y2",g=this.dataLabel,p=g.targetPosition,e=
{x1:this.plotX,y1:this.plotY,x2:this.plotX,y2:h(p.y)?p.y:g.y},b=(g.alignAttr||g)[f[0]]<this.series.yAxis.len/2;m&&(e={x1:this.plotY,y1:c-this.plotX,x2:p.x||g.x,y2:c-this.plotX});b&&(e[f]+=g[m?"width":"height"]);q(e,function(b,a){e[a]-=(g.alignAttr||g)[a[0]]});return a.renderer.crispLine([["M",e.x1,e.y1],["L",e.x2,e.y2]],g.options.connectorWidth)};c.prototype.init=function(){var c=a.prototype.init.apply(this,arguments);c.name=w(c.name,"Event");c.y=1;return c};c.prototype.isValid=function(){return null!==
this.options.y};c.prototype.setState=function(){var c=a.prototype.setState;this.isNull||c.apply(this,arguments)};c.prototype.setVisible=function(a,c){var d=this.series;c=w(c,d.options.ignoreHiddenPoint);r.prototype.setVisible.call(this,a,!1);d.processData();c&&d.chart.redraw()};return c}(a.series.prototype.pointClass)});k(a,"Series/Timeline/TimelineSeries.js",[a["Mixins/LegendSymbol.js"],a["Core/Color/Palette.js"],a["Core/Series/SeriesRegistry.js"],a["Core/Renderer/SVG/SVGElement.js"],a["Series/Timeline/TimelinePoint.js"],
a["Core/Utilities.js"]],function(a,f,k,r,y,h){var z=this&&this.__extends||function(){var a=function(c,b){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(b,a){b.__proto__=a}||function(b,a){for(var l in a)a.hasOwnProperty(l)&&(b[l]=a[l])};return a(c,b)};return function(c,b){function l(){this.constructor=c}a(c,b);c.prototype=null===b?Object.create(b):(l.prototype=b.prototype,new l)}}(),q=k.seriesTypes,w=q.column,A=q.line,c=h.addEvent,d=h.arrayMax,v=h.arrayMin,m=h.defined;q=h.extend;
var x=h.merge,g=h.pick;h=function(a){function e(){var b=null!==a&&a.apply(this,arguments)||this;b.data=void 0;b.options=void 0;b.points=void 0;b.userOptions=void 0;b.visibilityMap=void 0;return b}z(e,a);e.prototype.alignDataLabel=function(b,l,c,e){var n=this.chart.inverted,d=this.visibilityMap.filter(function(a){return a}),t=this.visiblePointsCount,u=d.indexOf(b);d=this.options.dataLabels;var g=b.userDLOptions||{};u=d.alternate?u&&u!==t-1?2:1.5:1;t=Math.floor(this.xAxis.len/t);var f=l.padding;if(b.visible){var h=
Math.abs(g.x||b.options.dataLabels.x);n?(n=2*(h-f)-b.itemHeight/2,n={width:n+"px",textOverflow:l.width/n*l.height/2>t*u?"ellipsis":"none"}):n={width:(g.width||d.width||t*u-2*f)+"px"};l.css(n);this.chart.styledMode||l.shadow(d.shadow)}a.prototype.alignDataLabel.apply(this,arguments)};e.prototype.bindAxes=function(){var b=this;a.prototype.bindAxes.call(b);["xAxis","yAxis"].forEach(function(a){"xAxis"!==a||b[a].userOptions.type||(b[a].categories=b[a].hasNames=!0)})};e.prototype.distributeDL=function(){var a=
this,c=a.options.dataLabels,n,d,e={},g=1,f=c.distance;a.points.forEach(function(b){b.visible&&!b.isNull&&(n=b.options,d=b.options.dataLabels,a.hasRendered||(b.userDLOptions=x({},d)),e[a.chart.inverted?"x":"y"]=c.alternate&&g%2?-f:f,n.dataLabels=x(e,b.userDLOptions),g++)})};e.prototype.generatePoints=function(){var b=this;a.prototype.generatePoints.apply(b);b.points.forEach(function(a,c){a.applyOptions({x:b.xData[c]},b.xData[c])})};e.prototype.getVisibilityMap=function(){return(this.data.length?this.data:
this.userOptions.data).map(function(a){return a&&!1!==a.visible&&!a.isNull?a:!1})};e.prototype.getXExtremes=function(a){var b=this;a=a.filter(function(a,c){return b.points[c].isValid()&&b.points[c].visible});return{min:v(a),max:d(a)}};e.prototype.init=function(){var b=this;a.prototype.init.apply(b,arguments);b.eventsToUnbind.push(c(b,"afterTranslate",function(){var a,c=Number.MAX_VALUE;b.points.forEach(function(b){b.isInside=b.isInside&&b.visible;b.visible&&!b.isNull&&(m(a)&&(c=Math.min(c,Math.abs(b.plotX-
a))),a=b.plotX)});b.closestPointRangePx=c}));b.eventsToUnbind.push(c(b,"drawDataLabels",function(){b.distributeDL()}));b.eventsToUnbind.push(c(b,"afterDrawDataLabels",function(){var a;b.points.forEach(function(b){if(a=b.dataLabel)return a.animate=function(a){this.targetPosition&&(this.targetPosition=a);return r.prototype.animate.apply(this,arguments)},a.targetPosition||(a.targetPosition={}),b.drawConnector()})}));b.eventsToUnbind.push(c(b.chart,"afterHideOverlappingLabel",function(){b.points.forEach(function(a){a.connector&&
a.dataLabel&&a.dataLabel.oldOpacity!==a.dataLabel.newOpacity&&a.alignConnector()})}))};e.prototype.markerAttribs=function(b,c){var d=this.options.marker,e=b.marker||{},f=e.symbol||d.symbol,h=g(e.width,d.width,this.closestPointRangePx),l=g(e.height,d.height),k=0;if(this.xAxis.dateTime)return a.prototype.markerAttribs.call(this,b,c);c&&(d=d.states[c]||{},c=e.states&&e.states[c]||{},k=g(c.radius,d.radius,k+(d.radiusPlus||0)));b.hasImage=f&&0===f.indexOf("url");return{x:Math.floor(b.plotX)-h/2-k/2,y:b.plotY-
l/2-k/2,width:h+k,height:l+k}};e.prototype.processData=function(){var b=0,c;this.visibilityMap=this.getVisibilityMap();this.visibilityMap.forEach(function(a){a&&b++});this.visiblePointsCount=b;for(c=0;c<this.xData.length;c++)this.yData[c]=1;a.prototype.processData.call(this,arguments)};e.defaultOptions=x(A.defaultOptions,{colorByPoint:!0,stickyTracking:!1,ignoreHiddenPoint:!0,legendType:"point",lineWidth:4,tooltip:{headerFormat:'<span style="color:{point.color}">\u25cf</span> <span style="font-size: 10px"> {point.key}</span><br/>',
pointFormat:"{point.description}"},states:{hover:{lineWidthPlus:0}},dataLabels:{enabled:!0,allowOverlap:!0,alternate:!0,backgroundColor:f.backgroundColor,borderWidth:1,borderColor:f.neutralColor40,borderRadius:3,color:f.neutralColor80,connectorWidth:1,distance:100,formatter:function(){var a=this.series.chart.styledMode?"<span>\u25cf </span>":'<span style="color:'+this.point.color+'">\u25cf </span>';return a+='<span class="highcharts-strong">'+(this.key||"")+"</span><br/>"+(this.point.label||"")},
style:{textOutline:"none",fontWeight:"normal",fontSize:"12px"},shadow:!1,verticalAlign:"middle"},marker:{enabledThreshold:0,symbol:"square",radius:6,lineWidth:2,height:15},showInLegend:!1,colorKey:"x"});return e}(A);q(h.prototype,{drawLegendSymbol:a.drawRectangle,drawTracker:w.prototype.drawTracker,pointClass:y,trackerGroups:["markerGroup","dataLabelsGroup"]});k.registerSeriesType("timeline",h);"";"";return h});k(a,"masters/modules/timeline.src.js",[],function(){})});
//# sourceMappingURL=timeline.js.map