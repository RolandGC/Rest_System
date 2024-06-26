/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Accessibility component for chart info region and table.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import AST from '../../Core/Renderer/HTML/AST.js';
import Chart from '../../Core/Chart/Chart.js';
import F from '../../Core/FormatUtilities.js';
var format = F.format;
import H from '../../Core/Globals.js';
var doc = H.doc;
import U from '../../Core/Utilities.js';
var extend = U.extend, pick = U.pick;
import AccessibilityComponent from '../AccessibilityComponent.js';
import Announcer from '../Utils/Announcer.js';
import AnnotationsA11y from './AnnotationsA11y.js';
var getAnnotationsInfoHTML = AnnotationsA11y.getAnnotationsInfoHTML;
import ChartUtilities from '../Utils/ChartUtilities.js';
var getAxisDescription = ChartUtilities.getAxisDescription, getAxisRangeDescription = ChartUtilities.getAxisRangeDescription, getChartTitle = ChartUtilities.getChartTitle, unhideChartElementFromAT = ChartUtilities.unhideChartElementFromAT;
import HTMLUtilities from '../Utils/HTMLUtilities.js';
var addClass = HTMLUtilities.addClass, escapeStringForHTML = HTMLUtilities.escapeStringForHTML, getElement = HTMLUtilities.getElement, getHeadingTagNameForElement = HTMLUtilities.getHeadingTagNameForElement, setElAttrs = HTMLUtilities.setElAttrs, stripHTMLTagsFromString = HTMLUtilities.stripHTMLTagsFromString, visuallyHideElement = HTMLUtilities.visuallyHideElement;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * @private
 */
function stripEmptyHTMLTags(str) {
    return str.replace(/<(\w+)[^>]*?>\s*<\/\1>/g, '');
}
/**
 * @private
 */
function getTypeDescForMapChart(chart, formatContext) {
    return formatContext.mapTitle ?
        chart.langFormat('accessibility.chartTypes.mapTypeDescription', formatContext) :
        chart.langFormat('accessibility.chartTypes.unknownMap', formatContext);
}
/**
 * @private
 */
function getTypeDescForCombinationChart(chart, formatContext) {
    return chart.langFormat('accessibility.chartTypes.combinationChart', formatContext);
}
/**
 * @private
 */
function getTypeDescForEmptyChart(chart, formatContext) {
    return chart.langFormat('accessibility.chartTypes.emptyChart', formatContext);
}
/**
 * @private
 */
function buildTypeDescriptionFromSeries(chart, types, context) {
    var firstType = types[0], typeExplaination = chart.langFormat('accessibility.seriesTypeDescriptions.' + firstType, context), multi = chart.series && chart.series.length < 2 ? 'Single' : 'Multiple';
    return (chart.langFormat('accessibility.chartTypes.' + firstType + multi, context) ||
        chart.langFormat('accessibility.chartTypes.default' + multi, context)) + (typeExplaination ? ' ' + typeExplaination : '');
}
/**
 * @private
 */
function getTableSummary(chart) {
    return chart.langFormat('accessibility.table.tableSummary', { chart: chart });
}
/**
 * Return simplified explaination of chart type. Some types will not be familiar
 * to most users, but in those cases we try to add an explaination of the type.
 *
 * @private
 * @function Highcharts.Chart#getTypeDescription
 * @param {Array<string>} types The series types in this chart.
 * @return {string} The text description of the chart type.
 */
Chart.prototype.getTypeDescription = function (types) {
    var firstType = types[0], firstSeries = this.series && this.series[0] || {}, formatContext = {
        numSeries: this.series.length,
        numPoints: firstSeries.points && firstSeries.points.length,
        chart: this,
        mapTitle: firstSeries.mapTitle
    };
    if (!firstType) {
        return getTypeDescForEmptyChart(this, formatContext);
    }
    if (firstType === 'map') {
        return getTypeDescForMapChart(this, formatContext);
    }
    if (this.types.length > 1) {
        return getTypeDescForCombinationChart(this, formatContext);
    }
    return buildTypeDescriptionFromSeries(this, types, formatContext);
};
/**
 * The InfoRegionsComponent class
 *
 * @private
 * @class
 * @name Highcharts.InfoRegionsComponent
 */
var InfoRegionsComponent = function () { };
InfoRegionsComponent.prototype = new AccessibilityComponent();
extend(InfoRegionsComponent.prototype, /** @lends Highcharts.InfoRegionsComponent */ {
    /**
     * Init the component
     * @private
     */
    init: function () {
        var chart = this.chart;
        var component = this;
        this.initRegionsDefinitions();
        this.addEvent(chart, 'aftergetTableAST', function (e) {
            component.onDataTableCreated(e);
        });
        this.addEvent(chart, 'afterViewData', function (tableDiv) {
            component.dataTableDiv = tableDiv;
            // Use small delay to give browsers & AT time to register new table
            setTimeout(function () {
                component.focusDataTable();
            }, 300);
        });
        this.announcer = new Announcer(chart, 'assertive');
    },
    /**
     * @private
     */
    initRegionsDefinitions: function () {
        var component = this;
        this.screenReaderSections = {
            before: {
                element: null,
                buildContent: function (chart) {
                    var formatter = chart.options.accessibility
                        .screenReaderSection.beforeChartFormatter;
                    return formatter ? formatter(chart) :
                        component.defaultBeforeChartFormatter(chart);
                },
                insertIntoDOM: function (el, chart) {
                    chart.renderTo.insertBefore(el, chart.renderTo.firstChild);
                },
                afterInserted: function () {
                    if (typeof component.sonifyButtonId !== 'undefined') {
                        component.initSonifyButton(component.sonifyButtonId);
                    }
                    if (typeof component.dataTableButtonId !== 'undefined') {
                        component.initDataTableButton(component.dataTableButtonId);
                    }
                }
            },
            after: {
                element: null,
                buildContent: function (chart) {
                    var formatter = chart.options.accessibility.screenReaderSection
                        .afterChartFormatter;
                    return formatter ? formatter(chart) :
                        component.defaultAfterChartFormatter();
                },
                insertIntoDOM: function (el, chart) {
                    chart.renderTo.insertBefore(el, chart.container.nextSibling);
                }
            }
        };
    },
    /**
     * Called on chart render. Have to update the sections on render, in order
     * to get a11y info from series.
     */
    onChartRender: function () {
        var component = this;
        this.linkedDescriptionElement = this.getLinkedDescriptionElement();
        this.setLinkedDescriptionAttrs();
        Object.keys(this.screenReaderSections).forEach(function (regionKey) {
            component.updateScreenReaderSection(regionKey);
        });
    },
    /**
     * @private
     */
    getLinkedDescriptionElement: function () {
        var chartOptions = this.chart.options, linkedDescOption = chartOptions.accessibility.linkedDescription;
        if (!linkedDescOption) {
            return;
        }
        if (typeof linkedDescOption !== 'string') {
            return linkedDescOption;
        }
        var query = format(linkedDescOption, this.chart), queryMatch = doc.querySelectorAll(query);
        if (queryMatch.length === 1) {
            return queryMatch[0];
        }
    },
    /**
     * @private
     */
    setLinkedDescriptionAttrs: function () {
        var el = this.linkedDescriptionElement;
        if (el) {
            el.setAttribute('aria-hidden', 'true');
            addClass(el, 'highcharts-linked-description');
        }
    },
    /**
     * @private
     * @param {string} regionKey The name/key of the region to update
     */
    updateScreenReaderSection: function (regionKey) {
        var chart = this.chart, region = this.screenReaderSections[regionKey], content = region.buildContent(chart), sectionDiv = region.element = (region.element || this.createElement('div')), hiddenDiv = (sectionDiv.firstChild || this.createElement('div'));
        this.setScreenReaderSectionAttribs(sectionDiv, regionKey);
        AST.setElementHTML(hiddenDiv, content);
        sectionDiv.appendChild(hiddenDiv);
        region.insertIntoDOM(sectionDiv, chart);
        visuallyHideElement(hiddenDiv);
        unhideChartElementFromAT(chart, hiddenDiv);
        if (region.afterInserted) {
            region.afterInserted();
        }
    },
    /**
     * @private
     * @param {Highcharts.HTMLDOMElement} sectionDiv The section element
     * @param {string} regionKey Name/key of the region we are setting attrs for
     */
    setScreenReaderSectionAttribs: function (sectionDiv, regionKey) {
        var labelLangKey = ('accessibility.screenReaderSection.' + regionKey + 'RegionLabel'), chart = this.chart, labelText = chart.langFormat(labelLangKey, { chart: chart }), sectionId = 'highcharts-screen-reader-region-' + regionKey + '-' +
            chart.index;
        setElAttrs(sectionDiv, {
            id: sectionId,
            'aria-label': labelText
        });
        // Sections are wrapped to be positioned relatively to chart in case
        // elements inside are tabbed to.
        sectionDiv.style.position = 'relative';
        if (chart.options.accessibility.landmarkVerbosity === 'all' &&
            labelText) {
            sectionDiv.setAttribute('role', 'region');
        }
    },
    /**
     * @private
     * @return {string}
     */
    defaultBeforeChartFormatter: function () {
        var chart = this.chart, format = chart.options.accessibility
            .screenReaderSection.beforeChartFormat, axesDesc = this.getAxesDescription(), shouldHaveSonifyBtn = (chart.sonify &&
            chart.options.sonification &&
            chart.options.sonification.enabled), sonifyButtonId = 'highcharts-a11y-sonify-data-btn-' +
            chart.index, dataTableButtonId = 'hc-linkto-highcharts-data-table-' +
            chart.index, annotationsList = getAnnotationsInfoHTML(chart), annotationsTitleStr = chart.langFormat('accessibility.screenReaderSection.annotations.heading', { chart: chart }), context = {
            headingTagName: getHeadingTagNameForElement(chart.renderTo),
            chartTitle: getChartTitle(chart),
            typeDescription: this.getTypeDescriptionText(),
            chartSubtitle: this.getSubtitleText(),
            chartLongdesc: this.getLongdescText(),
            xAxisDescription: axesDesc.xAxis,
            yAxisDescription: axesDesc.yAxis,
            playAsSoundButton: shouldHaveSonifyBtn ?
                this.getSonifyButtonText(sonifyButtonId) : '',
            viewTableButton: chart.getCSV ?
                this.getDataTableButtonText(dataTableButtonId) : '',
            annotationsTitle: annotationsList ? annotationsTitleStr : '',
            annotationsList: annotationsList
        }, formattedString = H.i18nFormat(format, context, chart);
        this.dataTableButtonId = dataTableButtonId;
        this.sonifyButtonId = sonifyButtonId;
        return stripEmptyHTMLTags(formattedString);
    },
    /**
     * @private
     * @return {string}
     */
    defaultAfterChartFormatter: function () {
        var chart = this.chart, format = chart.options.accessibility
            .screenReaderSection.afterChartFormat, context = {
            endOfChartMarker: this.getEndOfChartMarkerText()
        }, formattedString = H.i18nFormat(format, context, chart);
        return stripEmptyHTMLTags(formattedString);
    },
    /**
     * @private
     * @return {string}
     */
    getLinkedDescription: function () {
        var el = this.linkedDescriptionElement, content = el && el.innerHTML || '';
        return stripHTMLTagsFromString(content);
    },
    /**
     * @private
     * @return {string}
     */
    getLongdescText: function () {
        var chartOptions = this.chart.options, captionOptions = chartOptions.caption, captionText = captionOptions && captionOptions.text, linkedDescription = this.getLinkedDescription();
        return (chartOptions.accessibility.description ||
            linkedDescription ||
            captionText ||
            '');
    },
    /**
     * @private
     * @return {string}
     */
    getTypeDescriptionText: function () {
        var chart = this.chart;
        return chart.types ?
            chart.options.accessibility.typeDescription ||
                chart.getTypeDescription(chart.types) : '';
    },
    /**
     * @private
     * @param {string} buttonId
     * @return {string}
     */
    getDataTableButtonText: function (buttonId) {
        var chart = this.chart, buttonText = chart.langFormat('accessibility.table.viewAsDataTableButtonText', { chart: chart, chartTitle: getChartTitle(chart) });
        return '<button id="' + buttonId + '">' + buttonText + '</button>';
    },
    /**
     * @private
     * @param {string} buttonId
     * @return {string}
     */
    getSonifyButtonText: function (buttonId) {
        var chart = this.chart;
        if (chart.options.sonification &&
            chart.options.sonification.enabled === false) {
            return '';
        }
        var buttonText = chart.langFormat('accessibility.sonification.playAsSoundButtonText', { chart: chart, chartTitle: getChartTitle(chart) });
        return '<button id="' + buttonId + '">' + buttonText + '</button>';
    },
    /**
     * @private
     * @return {string}
     */
    getSubtitleText: function () {
        var subtitle = (this.chart.options.subtitle);
        return stripHTMLTagsFromString(subtitle && subtitle.text || '');
    },
    /**
     * @private
     * @return {string}
     */
    getEndOfChartMarkerText: function () {
        var chart = this.chart, markerText = chart.langFormat('accessibility.screenReaderSection.endOfChartMarker', { chart: chart }), id = 'highcharts-end-of-chart-marker-' + chart.index;
        return '<div id="' + id + '">' + markerText + '</div>';
    },
    /**
     * @private
     * @param {Highcharts.Dictionary<string>} e
     */
    onDataTableCreated: function (e) {
        var chart = this.chart;
        if (chart.options.accessibility.enabled) {
            if (this.viewDataTableButton) {
                this.viewDataTableButton.setAttribute('aria-expanded', 'true');
            }
            var attributes = e.tree.attributes || {};
            attributes.tabindex = -1;
            attributes.summary = getTableSummary(chart);
            e.tree.attributes = attributes;
        }
    },
    /**
     * @private
     */
    focusDataTable: function () {
        var tableDiv = this.dataTableDiv, table = tableDiv && tableDiv.getElementsByTagName('table')[0];
        if (table && table.focus) {
            table.focus();
        }
    },
    /**
     * @private
     * @param {string} sonifyButtonId
     */
    initSonifyButton: function (sonifyButtonId) {
        var _this = this;
        var el = this.sonifyButton = getElement(sonifyButtonId);
        var chart = this.chart;
        var defaultHandler = function (e) {
            if (el) {
                el.setAttribute('aria-hidden', 'true');
                el.setAttribute('aria-label', '');
            }
            e.preventDefault();
            e.stopPropagation();
            var announceMsg = chart.langFormat('accessibility.sonification.playAsSoundClickAnnouncement', { chart: chart });
            _this.announcer.announce(announceMsg);
            setTimeout(function () {
                if (el) {
                    el.removeAttribute('aria-hidden');
                    el.removeAttribute('aria-label');
                }
                if (chart.sonify) {
                    chart.sonify();
                }
            }, 1000); // Delay to let screen reader speak the button press
        };
        if (el && chart) {
            setElAttrs(el, {
                tabindex: -1
            });
            el.onclick = function (e) {
                var onPlayAsSoundClick = (chart.options.accessibility &&
                    chart.options.accessibility.screenReaderSection.onPlayAsSoundClick);
                (onPlayAsSoundClick || defaultHandler).call(this, e, chart);
            };
        }
    },
    /**
     * Set attribs and handlers for default viewAsDataTable button if exists.
     * @private
     * @param {string} tableButtonId
     */
    initDataTableButton: function (tableButtonId) {
        var el = this.viewDataTableButton = getElement(tableButtonId), chart = this.chart, tableId = tableButtonId.replace('hc-linkto-', '');
        if (el) {
            setElAttrs(el, {
                tabindex: -1,
                'aria-expanded': !!getElement(tableId)
            });
            el.onclick = chart.options.accessibility
                .screenReaderSection.onViewDataTableClick ||
                function () {
                    chart.viewData();
                };
        }
    },
    /**
     * Return object with text description of each of the chart's axes.
     * @private
     * @return {Highcharts.Dictionary<string>}
     */
    getAxesDescription: function () {
        var chart = this.chart, shouldDescribeColl = function (collectionKey, defaultCondition) {
            var axes = chart[collectionKey];
            return axes.length > 1 || axes[0] &&
                pick(axes[0].options.accessibility &&
                    axes[0].options.accessibility.enabled, defaultCondition);
        }, hasNoMap = !!chart.types && chart.types.indexOf('map') < 0, hasCartesian = !!chart.hasCartesianSeries, showXAxes = shouldDescribeColl('xAxis', !chart.angular && hasCartesian && hasNoMap), showYAxes = shouldDescribeColl('yAxis', hasCartesian && hasNoMap), desc = {};
        if (showXAxes) {
            desc.xAxis = this.getAxisDescriptionText('xAxis');
        }
        if (showYAxes) {
            desc.yAxis = this.getAxisDescriptionText('yAxis');
        }
        return desc;
    },
    /**
     * @private
     * @param {string} collectionKey
     * @return {string}
     */
    getAxisDescriptionText: function (collectionKey) {
        var chart = this.chart;
        var axes = chart[collectionKey];
        return chart.langFormat('accessibility.axis.' + collectionKey + 'Description' + (axes.length > 1 ? 'Plural' : 'Singular'), {
            chart: chart,
            names: axes.map(function (axis) {
                return getAxisDescription(axis);
            }),
            ranges: axes.map(function (axis) {
                return getAxisRangeDescription(axis);
            }),
            numAxes: axes.length
        });
    },
    /**
     * Remove component traces
     */
    destroy: function () {
        if (this.announcer) {
            this.announcer.destroy();
        }
    }
});
export default InfoRegionsComponent;
