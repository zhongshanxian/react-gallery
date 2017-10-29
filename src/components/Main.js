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


class GalleryByReactApp extends React.Component {
  render() {
    return (
      <section className="stage">
      	<section className="img-sec">
      	</section>
      	<nav className="controller-nav">
      	</nav>
      </section>
    );
  }
}

GalleryByReactApp.defaultProps = {
};

//暴露模块
export default GalleryByReactApp;
