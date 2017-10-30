require('normalize.css/normalize.css');
require('styles/App.scss');
import React from 'react';


//获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

//利用自执行函数，奖图片信息转化成URL
imageDatas = (function genImageURL(imageDatasArr) {
	for(let i = 0, j = imageDatasArr.length; i < j;i++) {
		let singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/'+singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

/*
* 获取去见内的一个随机数
*/
function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

/*
* 获取0-30度之间的一个任意正负值
*/
function get30DegRandom() {
	return ((Math.random() > 0.5? '':'-') + Math.ceil(Math.random() * 30));
}

/*
* ImgFigure组件
*/
class ImgFigure extends React.Component {
	/*
	* ImgFigure点击处理函数
	*/
	handleClick=(e)=>{
		this.props.inverse();
		e.stopPropagation();
		e.preventDefault();
	}


  render() {
  	let styleObj = {};

  	//如果props属性中指定了这张图片的位置，则使用
  	if(this.props.range.pos) {
  		styleObj = this.props.range.pos;
  	}

  	//如果图片的角度 有不为0的值，则使用
  	if(this.props.range.rotate) {
  		(['-moz-', '-ms-', '-webkit-', '']).forEach(function(value) {
  			styleObj[value + 'transform'] = 'rotate(' + this.props.range.rotate + 'deg';
  		}.bind(this));
  	}

  	var imgFigureClassName = 'img-figure';
  	imgFigureClassName += this.props.range.isInverse?' is-inverse':'';

    return (
      <figure className={imgFigureClassName} style={styleObj} ref ="figure" onClick={this.handleClick}>
      	<img
      		src={this.props.data.imageURL}
      		alt={this.props.data.title}
      	/>
      	<figcaption>
      		<h2 className="img-title">{this.props.data.title}</h2>
      		<div className="img-back" onClick={this.handleClick}>
      			<p>
      				{this.props.data.desc}
      			</p>
      		</div>
      	</figcaption>
      </figure>
    );
  }
}

/*
* GalleryByReactApp组件
*/
class GalleryByReactApp extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
	    imgsRangeArr: [
		    /*{
		    	pos: {
		    		left: '0',
		    		top: '0'
		    	}
		    	rotate: 0, //旋转角度
		    	isInverse: false  //图片正反面
		    }*/
	    ]
	  };
	}
	Constant = {
		centerPos: {
			left: 0,
			right: 0
		},
		hPosRange: { //水平方向的取值范围
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: { //垂直方向的取值范围
			x: [0, 0],
			topY: [0, 0]
		}
	}

	/*
	* 翻转图片
	* @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
	* @return {function} 这是一个闭包函数，其内return一个真正待被执行的函数
	*/
	inverse = (index) => {
		return function() {
			var imgsRangeArr = this.state.imgsRangeArr;
			imgsRangeArr[index].isInverse = !imgsRangeArr[index].isInverse;
			this.setState({
				imgsRangeArr: imgsRangeArr
			});
		}.bind(this);
	}

	/*
	* 重新排布所有图片
	* @param centerIndex 指定居中排布图片
	*/
	readrange = (centerIndex) => {
		let imgsRangeArr = this.state.imgsRangeArr,
					Constant = this.Constant,
					centerPos = Constant.centerPos,
					hPosRange = Constant.hPosRange,
					vPosRange = Constant.vPosRange,
					hPosRangeLeftSecX = hPosRange.leftSecX,
					hPosRangeRightSecX = hPosRange.rightSecX,
					hPosRangeY = hPosRange.y,
					vPosRangeTopY = vPosRange.topY,
					vPosRangeX = vPosRange.x,

					imgsRangeTopArr = [],
					topImgNum = Math.ceil(Math.random() * 2),
					topImgSpliceIndex = 0,

					imgsRangeCenterArr = imgsRangeArr.splice(centerIndex, 1);

		//首先居中centerIndex的图片
		imgsRangeCenterArr[0].pos = centerPos;

		//居中的centerIndex图片不需要旋转
		imgsRangeCenterArr[0].rotate = 0;

		//取出要布局在上册的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsRangeArr.length - topImgNum));
		imgsRangeTopArr = imgsRangeArr.splice(topImgSpliceIndex, topImgNum);

		//布局位于上侧的图片
		imgsRangeTopArr.forEach(function (value, index) {
			imgsRangeTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom()
			};
		});

		//布局左右两侧的图片
		for( let i=0, j=imgsRangeArr.length, k=j/2; i<j; i++) {
			let hPosRangeLORX =null;

			//前半部分布局左边，右半部分布局右边
			if( i< k) {
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRightSecX;
			}
			imgsRangeArr[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: get30DegRandom()
			};
		}

		if(imgsRangeTopArr && imgsRangeTopArr[0]) {
			imgsRangeArr.splice(topImgSpliceIndex, 0, imgsRangeTopArr[0]);
		}

		imgsRangeArr.splice(centerIndex, 0, imgsRangeCenterArr[0]);

		this.setState({

		});
	}

  //组件加载以后，为每张图片计算其位置范围
	componentDidMount () {
 		//首先拿到舞台的大小
 		var stageDOM = this.refs.stage,
 					stageW = stageDOM.scrollWidth,
 					stageH = stageDOM.scrollHeight,
 					halfStageW = Math.ceil(stageW / 2),
 					halfStageH = Math.ceil(stageH / 2);

 		//拿到imgFigure的大小
 		var imgFigureDOM = this.refs.imgFigure0.refs.figure,
 					imgW = imgFigureDOM.scrollWidth,
 					imgH = imgFigureDOM.scrollHeight,
 					halfImgW = Math.ceil(imgW / 2),
 					halfImgH = Math.ceil(imgH / 2);

 		//计算中心图片的位置点
 		this.Constant.centerPos = {
 			left: halfStageW - halfImgW,
 			top: halfStageH - halfImgH
 		}

 		//计算左侧，右侧图片位置范围
 		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
 		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
 		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
 		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
 		this.Constant.hPosRange.y[0] = -halfImgH;
 		this.Constant.hPosRange.y[1] = halfStageH - halfImgH;

 		//计算上侧图片位置范围
 		this.Constant.vPosRange.topY[0] = -halfImgH;
 		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
 		this.Constant.vPosRange.x[0] = halfStageW - imgW;
 		this.Constant.vPosRange.x[1] = halfStageW;

 		this.readrange(0);

	}

  render() {
  	const controllerUnits = [], imgFigures = [];
  	imageDatas.forEach(function(value, index) {

  		if(!this.state.imgsRangeArr[index]) {
  			this.state.imgsRangeArr[index] = {
  				pos: {
  					left: 0,
  					top: 0
  				},
  				rotate: 0,
  				isInverse: false
  			}
  		}

  		imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} range={this.state.imgsRangeArr[index]} inverse = {this.inverse(index)} />);
  	}.bind(this));
    return (
      <section className="stage" ref="stage">
      	<section className="img-sec">
      		{imgFigures}
      	</section>
      	<nav className="controller-nav">
      		{controllerUnits}
      	</nav>
      </section>
    );
  }
}

GalleryByReactApp.defaultProps = {
};

//暴露模块
export default GalleryByReactApp;
