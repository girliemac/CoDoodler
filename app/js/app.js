(function() {
	
	/* Canvas */

	var canvas = document.getElementById('drawCanvas');
	var ctx = canvas.getContext('2d');

	var w = Math.min(document.documentElement.clientWidth, window.innerWidth || 300);
	var h = Math.min(document.documentElement.clientHeight, window.innerHeight || 300);
	
	canvas.width = w;
	canvas.height = h;
  	
	ctx.strokeStyle = document.querySelector(':checked').value;
	ctx.lineWidth = '3';

	/* Drawing Events */
	
	var isActive = false;

	document.getElementById('colorSwatch').addEventListener('click', function() {
		ctx.strokeStyle = document.querySelector(':checked').value;
	}, false);
	
	var isTouchSupported = 'ontouchstart' in window;
	var isPointerSupported = navigator.pointerEnabled;
	var isMSPointerSupported =  navigator.msPointerEnabled;
	
	var downEvent = isTouchSupported ? 'touchstart' : (isPointerSupported ? 'pointerdown' : (isMSPointerSupported ? 'MSPointerDown' : 'mousedown'));
	var moveEvent = isTouchSupported ? 'touchmove' : (isPointerSupported ? 'pointermove' : (isMSPointerSupported ? 'MSPointerMove' : 'mousemove'));
	var upEvent = isTouchSupported ? 'touchend' : (isPointerSupported ? 'pointerup' : (isMSPointerSupported ? 'MSPointerUp' : 'mouseup'));
	 	  
	canvas.addEventListener(downEvent, startDraw, false);
	canvas.addEventListener(moveEvent, draw, false);
	canvas.addEventListener(upEvent, endDraw, false);

	/* Pubnub */

	var pChannel = 'draw';

	var pubnub = PUBNUB.init({
		publish_key: 'pub-c-a0f0e6b6-38c6-4428-8f28-9174783b6338',
		subscribe_key: 'sub-c-c6b57680-e3be-11e3-bff7-02ee2ddab7fe'
	});

	pubnub.subscribe({
		channel: pChannel,
		callback: function (message) {
			console.log(message);
			if(message.plots.length < 1) return;
			
			ctx.strokeStyle = message.color;
			ctx.beginPath();

			var i = 0;                    

			function tracePath() {
			   setTimeout(function () {
			      drawOnCanvas(message.plots[i].x, message.plots[i].y);
			      i++;
			      if (i < message.plots.length) {
			         tracePath(); 
			      }
			   }, 5) // give 5 millisec delay on each path
			}
			tracePath();
		}
	});

	function publish(data) {
		pubnub.publish({
			channel : pChannel,
			message : data
		})
     }

    /* Draw on canvas */

    var plots = [];

    function drawOnCanvas(x, y) {
    	ctx.lineTo(x, y);
	    ctx.stroke();
    }

	function draw(e) {
	  e.preventDefault();
	  if(isActive) {
	    var x = isTouchSupported ? (e.targetTouches[0].pageX - canvas.offsetLeft) : (e.offsetX || e.layerX - canvas.offsetLeft);
	    var y = isTouchSupported ? (e.targetTouches[0].pageY - canvas.offsetTop) : (e.offsetY || e.layerY - canvas.offsetTop);

	    drawOnCanvas(x, y);
	    plots.push({x: x, y: y});
	  }
	}
	
	function startDraw(e) {
	  e.preventDefault();
	  isActive = true;
	  ctx.beginPath();
	}
	
	function endDraw(e) {
	  e.preventDefault();
	  isActive = false;
	  
	  publish({
	  	color: document.querySelector(':checked').value,
	  	plots: plots
	  });

	  plots = [];
	}
})();