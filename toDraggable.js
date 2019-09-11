/**
* toDraggable html_node를 드래그, 이동 할 수 있도록 해준다.
*/
/**
* toDraggable
* @param  {html_node} target
* @param  {function} cb_onpointerdown
* @param  {function} cb_onpointermove
* @param  {function} cb_onpointerup
* @return {object} {"enable":function , "disable":function}
*/
var toDraggable = function(target,cb_onpointerdown,cb_onpointermove,cb_onpointerup){
	var data={
		"ing":false,
		"x":0,
		"y":0
	}
	var _getXY = function(evt){
		var x = evt.clientX;
		var y = evt.clientY;
		if(evt.isPrimary ){
			var x = evt.clientX;
			var y = evt.clientY;
		}else if(evt.touches && evt.touches[0]){
			var touch = evt.touches[0];
			var x = touch.X;
			var y = touch.Y;
		}else{
			var x = evt.x;
			var y = evt.y;
		}
		return [x,y];
	}
	var _onpointerdown = function(target,data,cb_onpointerdown){
		// var target = evt.target;
		return function(evt){
			data.ing = true;
			var xy = _getXY(evt);
			data.x = xy[0];
			data.y = xy[1];
			
			// evt.preventDefault();evt.stopPropagation(); //이벤트 중지 안시킴
			document.addEventListener('pointermove',_onpointermove);
			document.addEventListener('pointerup',_onpointerup);
			if(cb_onpointerdown) cb_onpointerdown(evt,xy[0],xy[1],target,data);
			return false;
		}
	}(target,data,cb_onpointerdown)
	var _onpointermove = function(target,data,cb_onpointermove){
		return function(evt){
			if(!data.ing){return;}
			var xy = _getXY(evt);
			var gapX = xy[0]-data.x;
			var gapY = xy[1]-data.y;
			data.x = xy[0];
			data.y = xy[1];
			evt.preventDefault();evt.stopPropagation();
			if(cb_onpointermove) cb_onpointermove(evt,gapX,gapY,target,data);
			return false;
		}
	}(target,data,cb_onpointermove)
	var _onpointerup = function(target,data,cb_onpointerup){
		return function(evt){
			if(data.ing){
				data.ing = false;
				document.removeEventListener('pointermove',_onpointermove);
				document.removeEventListener('pointerup',_onpointerup);
				if(cb_onpointerup) cb_onpointerup(evt,target,data);	
			}			
			return false;
		}
	}(target,data,cb_onpointerup)
	var _notouchmove = function(evt){ evt.preventDefault();evt.stopPropagation()	;return false;}
	var _enable = false;
	var setEnsabled = function(isEnabled){
		if(isEnabled){
			target.classList.replace('toDraggable-disabled','toDraggable-enabled')
		}else{
			target.classList.replace('toDraggable-enabled','toDraggable-disabled')
		}
	}
	var _onpointerover = function(evt){ 
		target.classList.add('toDraggable-box-hover')
		// console.log("over");
	}
	var _onpointerout = function(evt){ 
		target.classList.remove('toDraggable-box-hover')
	}
	var enable = function(){
		if(!_enable){
			target.addEventListener('pointerdown',_onpointerdown);
			target.addEventListener('touchmove',_notouchmove);  
			target.addEventListener('selectstart',_notouchmove);
			target.addEventListener('pointerover',_onpointerover);
			target.addEventListener('pointerout',_onpointerout);
			_enable = true;
			setEnsabled(_enable)
		}
		
	}
	var disable = function(){
		if(_enable){
			target.removeEventListener('pointerdown',_onpointerdown);
			target.removeEventListener('touchmove',_notouchmove);
			target.removeEventListener('selectstart',_notouchmove);
			target.removeEventListener('pointerover',_onpointerover);
			target.removeEventListener('pointerout',_onpointerout);
			_enable = false;
			setEnsabled(_enable)
		}
	}
	target.classList.add('toDraggable-enabled')
	enable();
	
	return {"enable":enable,"disable":disable}
}

/**
* cb_onpointerdown 콜백함수 기본형
* @param  {[type]} evt  [description]
* @param  {[type]} gapX [description]
* @param  {[type]} gapY [description]
* @return {[type]}      [description]
*/
toDraggable.cb_onpointerdown = function(evt,x,y,target,data){
	target.classList.add('toDraggable-box-down')
	target.ownerDocument.body.classList.add('toDraggable-body-down')
}
toDraggable.cb_onpointermove = function(evt,gapX,gapY,target,data){
	// console.log(evt);
	target.style.left = parseInt(target.style.left,10)+gapX+'px';
	target.style.top = parseInt(target.style.top,10)+gapY+'px';
	target.classList.add('toDraggable-box-move');
	target.ownerDocument.body.classList.add('toDraggable-body-move')
	return false;
}
toDraggable.cb_onpointerup = function(evt,target,data){
	target.classList.remove('toDraggable-box-down','toDraggable-box-move')
	target.ownerDocument.body.classList.remove('toDraggable-body-down','toDraggable-body-move')
}
toDraggable.getHited = function(target){
	'toDraggable-box'
}