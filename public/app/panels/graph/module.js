/*! grafana - v2.6.0 - 2015-12-14
 * Copyright (c) 2015 Torkel Ödegaard; Licensed Apache-2.0 */

define(["angular","lodash","moment","app/core/utils/kbn","app/core/time_series","app/features/panel/panel_meta","./seriesOverridesCtrl","./graph","./legend"],function(a,b,c,d,e,f){"use strict";var g=a.module("grafana.panels.graph");g.directive("grafanaPanelGraph",function(){return{controller:"GraphCtrl",templateUrl:"app/panels/graph/module.html"}}),g.controller("GraphCtrl",["$scope","$rootScope","panelSrv","annotationsSrv","panelHelper","$q",function(a,g,h,i,j,k){a.panelMeta=new f({panelName:"Graph",editIcon:"fa fa-bar-chart",fullscreen:!0,metricsEditor:!0}),a.panelMeta.addEditorTab("Axes & Grid","app/panels/graph/axisEditor.html"),a.panelMeta.addEditorTab("Display Styles","app/panels/graph/styleEditor.html"),a.panelMeta.addEditorTab("Time range","app/features/panel/partials/panelTime.html"),a.panelMeta.addExtendedMenuItem("Export CSV","","exportCsv()"),a.panelMeta.addExtendedMenuItem("Toggle legend","","toggleLegend()");var l={datasource:null,renderer:"flot","x-axis":!0,"y-axis":!0,y_formats:["short","short"],grid:{leftLogBase:1,leftMax:null,rightMax:null,leftMin:null,rightMin:null,rightLogBase:1,threshold1:null,threshold2:null,threshold1Color:"rgba(216, 200, 27, 0.27)",threshold2Color:"rgba(234, 112, 112, 0.22)"},lines:!0,fill:1,linewidth:2,points:!1,pointradius:5,bars:!1,stack:!1,percentage:!1,legend:{show:!0,values:!1,min:!1,max:!1,current:!1,total:!1,avg:!1},nullPointMode:"connected",steppedLine:!1,tooltip:{value_type:"cumulative",shared:!0},timeFrom:null,timeShift:null,targets:[{}],aliasColors:{},seriesOverrides:[]};b.defaults(a.panel,l),b.defaults(a.panel.tooltip,l.tooltip),b.defaults(a.panel.annotate,l.annotate),b.defaults(a.panel.grid,l.grid),b.defaults(a.panel.legend,l.legend),a.logScales={linear:1,"log (base 2)":2,"log (base 10)":10,"log (base 32)":32,"log (base 1024)":1024},a.hiddenSeries={},a.seriesList=[],a.unitFormats=d.getUnitFormats(),a.setUnitFormat=function(b,c){a.panel.y_formats[b]=c.value,a.render()},a.refreshData=function(b){return j.updateTimeRange(a),a.annotationsPromise=i.getAnnotations(a.dashboard),j.issueMetricQuery(a,b).then(a.dataHandler,function(b){throw a.seriesList=[],a.render([]),b})},a.loadSnapshot=function(b){j.updateTimeRange(a),a.annotationsPromise=k.when([]),a.dataHandler(b)},a.dataHandler=function(c){return b.isString(c)?void a.render(c):(a.datapointsWarning=!1,a.datapointsCount=0,a.datapointsOutside=!1,a.seriesList=b.map(c.data,a.seriesHandler),a.datapointsWarning=0===a.datapointsCount||a.datapointsOutside,void a.annotationsPromise.then(function(b){a.panelMeta.loading=!1,a.seriesList.annotations=b,a.render(a.seriesList)},function(){a.panelMeta.loading=!1,a.render(a.seriesList)}))},a.seriesHandler=function(b,d){var f=b.datapoints,h=b.target,i=d%g.colors.length,j=a.panel.aliasColors[h]||g.colors[i],k=new e({datapoints:f,alias:h,color:j});if(f&&f.length>0){var l=c.utc(f[f.length-1][1]),m=c.utc(a.range.from);-1e4>l-m&&(a.datapointsOutside=!0),a.datapointsCount+=f.length}return k},a.render=function(b){j.broadcastRender(a,b)},a.changeSeriesColor=function(b,c){b.color=c,a.panel.aliasColors[b.alias]=b.color,a.render()},a.toggleSeries=function(b,c){c.ctrlKey||c.metaKey||c.shiftKey?a.hiddenSeries[b.alias]?delete a.hiddenSeries[b.alias]:a.hiddenSeries[b.alias]=!0:a.toggleSeriesExclusiveMode(b),a.render()},a.toggleSeriesExclusiveMode=function(c){var d=a.hiddenSeries;d[c.alias]&&delete d[c.alias];var e=b.every(a.seriesList,function(a){return a.alias===c.alias?!0:d[a.alias]});e?b.each(a.seriesList,function(b){delete a.hiddenSeries[b.alias]}):b.each(a.seriesList,function(b){b.alias!==c.alias&&(a.hiddenSeries[b.alias]=!0)})},a.toggleYAxis=function(c){var d=b.findWhere(a.panel.seriesOverrides,{alias:c.alias});d||(d={alias:c.alias},a.panel.seriesOverrides.push(d)),d.yaxis=2===c.yaxis?1:2,a.render()},a.addSeriesOverride=function(b){a.panel.seriesOverrides.push(b||{})},a.removeSeriesOverride=function(c){a.panel.seriesOverrides=b.without(a.panel.seriesOverrides,c),a.render()},a.toggleLegend=function(){a.panel.legend.show=!a.panel.legend.show,a.get_data()},a.legendValuesOptionChanged=function(){var b=a.panel.legend;b.values=b.min||b.max||b.avg||b.current||b.total,a.render()},a.exportCsv=function(){d.exportSeriesListToCsv(a.seriesList)},h.init(a)}])});