// pages/map/overlay/overlay.js
import {CDN_PATH} from '../../../config/appConfig';
const INIT_POLYLINE = {
	points: [
		{latitude: 40.038540, longitude: 116.272389},
		{latitude: 40.041407, longitude: 116.274738}
	],
	color: '#3875FF',
	width: 8,
	dottedLine: false,
	borderWidth: 2
};

const INIT_POLYGON = {
	points: [
		{latitude: 40.041054, longitude: 116.272303},
		{latitude: 40.039419, longitude: 116.272721},
		{latitude: 40.039764, longitude: 116.274824},
		{latitude: 40.041374, longitude: 116.274491}
	],
	strokeWidth: 2,
};

const INIT_CIRCLE = {
	latitude: 40.040415,
	longitude: 116.273511,
	radius: 200,
	strokeWidth: 2
};

Page({
	data: {
		imgs: {
			rightArrow: `${CDN_PATH}/iconArrowRight@3x.png`
		},
		tabList: [{
			name: '线形'
		},{
			name: '多边形'
		},{
			name: '圆形'
		}],
		polylineColors: [
			{text: '', value: '#3875FF', icon: `${CDN_PATH}/iconLinecolorBlue@3x.png`},
			{text: '', value: '#00C562', icon: `${CDN_PATH}/iconLinecolorGreen@3x.png`},
			{text: '', value: '#F74A14', icon: `${CDN_PATH}/iconLinecolorRed@3x.png`},
		],
		polylineColorMap: {
			'#3875FF': `${CDN_PATH}/iconLinecolorBlue@3x.png`,
			'#00C562': `${CDN_PATH}/iconLinecolorGreen@3x.png`,
			'#F74A14': `${CDN_PATH}/iconLinecolorRed@3x.png`
		},
		widthImgs: [{
			normal: `${CDN_PATH}/iconLinewidthS_Normal@3x.png`,
			active: `${CDN_PATH}/iconLinewidthS_Activated@3x.png`,
			value: 6
		},{
			normal: `${CDN_PATH}/iconLinewidthM_Normal@3x.png`,
			active: `${CDN_PATH}/iconLinewidthM_Activated@3x.png`,
			value: 8
		},{
			normal: `${CDN_PATH}/iconLinewidthL_Normal@3x.png`,
			active: `${CDN_PATH}/iconLinewidthL_Activated@3x.png`,
			value: 10
		}],
		arrowImgs: [{
			normal: `${CDN_PATH}/iconArrow1_Normal@3x.png`,
			active: `${CDN_PATH}/iconArrow1_Activated@3x.png`,
		},{
			normal: `${CDN_PATH}/iconArrow2_Normal@3x.png`,
			active: `${CDN_PATH}/iconArrow2_Activated@3x.png`,
		},{
			normal: `${CDN_PATH}/iconArrow3_Normal@3x.png`,
			active: `${CDN_PATH}/iconArrow3_Activated@3x.png?t=1`,
		}],
		polylineBorderColors: [
			{text: '', value: '#224699', icon: `${CDN_PATH}/iconBordercolorBlue@3x.png`},
			{text: '', value: '#006633', icon: `${CDN_PATH}/iconBordercolorGreen@3x.png`},
			{text: '', value: '#992E0C', icon: `${CDN_PATH}/iconBordercolorRed@3x.png`},
			{text: '无', value: '', icon: ''},
		],
		polylineBorderColorMap: {
			'#224699': `${CDN_PATH}/iconBordercolorBlue@3x.png`,
			'#006633': `${CDN_PATH}/iconBordercolorGreen@3x.png`,
			'#992E0C': `${CDN_PATH}/iconBordercolorRed@3x.png`
		},
		polygonBgColors: [
			{text: '', value: '#3875FF'},
			{text: '', value: '#00C562'},
			{text: '', value: '#ffffff'},
			{text: '无', value: ''}
		],
		polygonColors: [
			{text: '', value: '#3875FF', icon: `${CDN_PATH}/iconLinecolorBlue@3x.png`},
			{text: '', value: '#00C562', icon: `${CDN_PATH}/iconLinecolorGreen@3x.png`},
			{text: '', value: '#F74A14', icon: `${CDN_PATH}/iconLinecolorRed@3x.png`},
			{text: '默认颜色', value: ''}
		],
		polygonColorMap: {
			'#3875FF': `${CDN_PATH}/iconLinecolorBlue@3x.png`,
			'#00C562': `${CDN_PATH}/iconLinecolorGreen@3x.png`,
			'#F74A14': `${CDN_PATH}/iconLinecolorRed@3x.png`
		},
		polygonWidthImgs: [{
			normal: `${CDN_PATH}/iconLinewidthS_Normal@3x.png`,
			active: `${CDN_PATH}/iconLinewidthS_Activated@3x.png`,
			value: 1
		},{
			normal: `${CDN_PATH}/iconLinewidthM_Normal@3x.png`,
			active: `${CDN_PATH}/iconLinewidthM_Activated@3x.png`,
			value: 2
		},{
			normal: `${CDN_PATH}/iconLinewidthL_Normal@3x.png`,
			active: `${CDN_PATH}/iconLinewidthL_Activated@3x.png`,
			value: 3
		}],
		circleBgColors: [
			{text: '', value: '#3875FF'},
			{text: '', value: '#00C562'},
			{text: '', value: '#ffffff'},
			{text: '无', value: ''}
		],
		circleColors: [
			{text: '', value: '#3875FF', icon: `${CDN_PATH}/iconLinecolorBlue@3x.png`},
			{text: '', value: '#00C562', icon: `${CDN_PATH}/iconLinecolorGreen@3x.png`},
			{text: '', value: '#F74A14', icon: `${CDN_PATH}/iconLinecolorRed@3x.png`},
			{text: '默认颜色', value: ''}
		],
		circleColorMap: {
			'#3875FF': `${CDN_PATH}/iconLinecolorBlue@3x.png`,
			'#00C562': `${CDN_PATH}/iconLinecolorGreen@3x.png`,
			'#F74A14': `${CDN_PATH}/iconLinecolorRed@3x.png`
		},
		polyline: [{
			...INIT_POLYLINE
		}],
		polygons: [{
			...INIT_POLYGON
		}],
		circles: [{
			...INIT_CIRCLE
		}],
		tabIndex: 0,
		polylineWidthIndex: 1,
		polylineArrowIndex: 0,
		polygonWidthIndex: 1,
		circleWidthIndex: 1,
		showPolylineColorActionsheet: false,
		showPolylineBorderColorActionsheet: false,
		showPolygonBgColorActionsheet: false,
		showPolygonBorderColorActionsheet: false,
		showCircleBgColorActionsheet: false,
		showCircleColorActionsheet: false
	},
	onClickTab (event) {
		this.setData({
			tabIndex: event.detail.current
		});
	},
	ontriggerSelectPolylineColor () {
		this.setData({
			showPolylineColorActionsheet: true
		});
	},
	onSelectPolylineColor (event) {
		const {value} = event.detail;
		this.setData({
			showPolylineColorActionsheet: false,
			'polyline[0].color': value
		});
	},
	onSelectPolylineWidth (event) {
		const {index} = event.currentTarget.dataset;
		if (index === this.data.polylineWidthIndex) {
			return;
		}
		this.setData({
			polylineWidthIndex: index,
			'polyline[0].width': this.data.widthImgs[index].value
		});
	},
	onChangeShowDotted (event) {
		this.setData({
			polylineArrowIndex: -1,
			'polyline[0].dottedLine': event.detail.value,
			'polyline[0].arrowLine': false
		});
	},
	onSelectPolylineArrow (event) {
		const {index} = event.currentTarget.dataset;
		if (index === this.data.polylineArrowIndex) {
			return;
		}
		this.setData({
			polylineArrowIndex: index,
			'polyline[0].arrowLine': true,
			'polyline[0].dottedLine': false,
			'polyline[0].arrowIconPath': this.data.arrowImgs[index].active
		});
	},
	ontriggerSelectPolylineBorderColor () {
		this.setData({
			showPolylineBorderColorActionsheet: true
		});
	},
	onSelectPolylineBorderColor (event) {
		const {value} = event.detail;
		if (value) {
			this.setData({
				showPolylineBorderColorActionsheet: false,
				'polyline[0].borderColor': value
			});
		} else {
			const polyline = {...this.data.polyline[0]};
			delete polyline.borderColor;
			this.setData({
				showPolylineBorderColorActionsheet: false,
				'polyline[0]': {
					...polyline
				}
			});
		}
	},
	ontriggerSelectPolygonBgColor () {
		this.setData({
			showPolygonBgColorActionsheet: true
		});
	},
	onSelectPolygonBgColor (event) {
		const {value} = event.detail;
		if (value) {
			this.setData({
				showPolygonBgColorActionsheet: false,
				'polygons[0].fillColor': value
			});
		} else {
			const polygon = {...this.data.polygons[0]};
			delete polygon.fillColor;
			this.setData({
				showPolygonBgColorActionsheet: false,
				'polygons[0]': {
					...polygon
				}
			});
		}
	},
	ontriggerSelectPolygonBorderColor () {
		this.setData({
			showPolygonBorderColorActionsheet: true
		});
	},
	onSelectPolygonBorderColor (event) {
		const {value} = event.detail;
		if (value) {
			this.setData({
				showPolygonBorderColorActionsheet: false,
				'polygons[0].strokeColor': value
			});
		} else {
			const polygon = {...this.data.polygons[0]};
			delete polygon.strokeColor;
			this.setData({
				showPolygonBorderColorActionsheet: false,
				'polygons[0]': {
					...polygon
				}
			});
		}
	},
	onSelectPolygonWidth (event) {
		const {index} = event.currentTarget.dataset;
		if (index === this.data.polygonWidthIndex) {
			return;
		}
		this.setData({
			polygonWidthIndex: index,
			'polygons[0].strokeWidth': this.data.polygonWidthImgs[index].value
		});
	},
	ontriggerSelectCircleBgColor () {
		this.setData({
			showCircleBgColorActionsheet: true
		});
	},
	onSelectCircleBgColor (event) {
		const {value} = event.detail;
		if (value) {
			this.setData({
				showCircleBgColorActionsheet: false,
				'circles[0].fillColor': value
			});
		} else {
			const circle = {...this.data.circles[0]};
			delete circle.fillColor;
			this.setData({
				showCircleBgColorActionsheet: false,
				'circles[0]': {
					...circle
				}
			});
		}
	},
	ontriggerSelectCircleColor () {
		this.setData({
			showCircleColorActionsheet: true
		});
	},
	onSelectCircleColor (event) {
		const {value} = event.detail;
		if (value) {
			this.setData({
				showCircleColorActionsheet: false,
				'circles[0].color': value
			});
		} else {
			const circle = {...this.data.circles[0]};
			delete circle.color;
			this.setData({
				showCircleColorActionsheet: false,
				'circles[0]': {
					...circle
				}
			});
		}
	},
	onSelectCircleWidth (event) {
		const {index} = event.currentTarget.dataset;
		if (index === this.data.circleWidthIndex) {
			return;
		}
		this.setData({
			circleWidthIndex: index,
			'circles[0].strokeWidth': this.data.polygonWidthImgs[index].value
		});
	},
	onInputChange (event) {
		const {value} = event.detail;
		this.setData({
			'circles[0].radius': parseInt(value)
		});
	},
	onResetPolylineConfig () {
		this.setData({
			'polyline[0]': {
				...INIT_POLYLINE
			},
			polylineArrowIndex: 0,
			polylineWidthIndex: 1
		});
	},
	onResetPolygonConfig () {
		this.setData({
			'polygons[0]': {
				...INIT_POLYGON
			},
			polygonWidthIndex: 1
		});
	},
	onResetCircleConfig () {
		this.setData({
			'circles[0]': {
				...INIT_CIRCLE
			},
			circleWidthIndex: 1
		});
	},
	onShareAppMessage: function () {

	}
});
