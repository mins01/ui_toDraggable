/**
* toExchangeable html_node를 드래그하여 서로 바꿀 수 있도록 해준다.
* class = toDraggable-box toDraggable-with-pointer-events-none 가 필수
*/
/**
* toExchangeable
* @param  {html_node} target
* @param  {function} cb_onpointerdown
* @param  {function} cb_onpointermove
* @param  {function} cb_changed
* @param  {string} selectorHover
* @return {object} {"enable":function , "disable":function}
*/
var toExchangeable = function(target,cb_onpointerdown,cb_onpointermove,cb_changed,selectorHover){
	let cb_onpointerup = toExchangeable.generate_cb_onpointerup(cb_changed,selectorHover)
	return toDraggable(target,cb_onpointerdown,cb_onpointermove,cb_onpointerup);
}
// toExchangeable.selectorHover = 'body.toDraggable-body-down .toDraggable-box-hover:not(.toDraggable-box-down)';
toExchangeable.cb_onpointerdown = toDraggable.cb_onpointerdown;
toExchangeable.cb_onpointermove = toDraggable.cb_onpointermove;
toExchangeable.cb_onpointerup = toDraggable.cb_onpointerup;
toExchangeable.generate_cb_onpointerup = function(cb_changed,selectorHover){
	// if(!selectorHover) selectorHover = toExchangeable.selectorHover;
	return function(evt,target,data){
		var hovers = data.hovers
		// var hovers = document.querySelectorAll(selectorHover); //class= toDraggable-with-pointer-events-none 가 있어야만 동작한다.
		if(hovers[0]){
			cb_changed(target,hovers[0]);
		}
		target.classList.remove('toDraggable-pointer-events-none');
		toExchangeable.cb_onpointerup(evt,target,data)
		target.style.left = '0px';
		target.style.top = '0px';
	}
}
toExchangeable.cb_changed = function(from,to){
	console.log(from.dataset.idx ,'=>', to.dataset.idx);
}