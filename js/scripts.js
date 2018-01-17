$( document ).ready(function(){
	var canvas = document.getElementById("1");
	var	c = canvas.getContext("2d");
	var w = window.innerWidth;
	var h = window.innerHeight;
	var	PosX, oldPosX;
	var	PosY, oldPosY;
	var click;
	var lineWidth = 5;
	var cookies = Cookies.getJSON('settings');
	console.log(cookies);

	//settings
	if (typeof cookies === 'undefined') {
		console.log(settings);
		var settings = new Object();
		settings['symmetry'] = true;
		settings['rainbowColor'] = true;
		settings['increment'] = true;
		settings['negativeIncrement'] = true;
		settings['stripes'] = false;
		settings['lineWidth'] = 20;
		settings['menuOpen'] = false;
	} else {
		settings = cookies;
		console.log(settings);
	}

	


	//shortcuts
	var toggleModifierShortcuts = {
		'r': 'rainbowColor',
		's': 'symmetry',
		'i': 'increment',
		'n': 'negativeIncrement',
		'l': 'stripes',
		'esc': 'menuToggle',
	}

	var actionShortcuts = {		
		'z': 'undo',
		']': 'lineWidthPlus',
		'[': 'lineWidthMin',
		'c': 'clear',
	}

	function collect() {
	  var ret = {};
	  var len = arguments.length;
	  for (var i=0; i<len; i++) {
	    for (p in arguments[i]) {
	      if (arguments[i].hasOwnProperty(p)) {
	        ret[p] = arguments[i][p];
	      }
	    }
	  }
	  return ret;
	}

	allShortcuts = collect(toggleModifierShortcuts, actionShortcuts);

	for (var key in allShortcuts) {
	  if (allShortcuts.hasOwnProperty(key)) {
	  	$('menu #shortcuts').append('<div class="menu-item"><div class="shortcut">' + key +'</div><p>' + allShortcuts[key] + '</p></div>')
	  }
	}

	for (var key in toggleModifierShortcuts) {
	  if (toggleModifierShortcuts.hasOwnProperty(key)) {
	  	$('menu #toggle-btns').append('<button class="toggle-btn menu-item" setting="' + toggleModifierShortcuts[key] + '"><div class="shortcut">' + key + '</div><p>' + toggleModifierShortcuts[key] + '</p><span class="fa"></span></button>')
	  }
	}
	


	//var settings = {
	//	symmetry: false,
	//	rainbowColor: true
	//}
	var $input = $('input');
	var red = 255;
	var green = 0;
	var blue = 0;
	var id = 1;
	var oldPosX;
	var newPosX;
	var oldPosY;
	var newPosY;
	var mousePosX;
	var mousePosY;
	var avePos;
	var firstLine;
	var stripe = 1;
	var undoHistory = []






	//check mobile version
	if(typeof window.orientation !== 'undefined'){$('body').addClass('mobile'); mobile = true;}else{mobile = false;}
	//alert(mobile);

	//update symmetry cursor
	function updateSettings() {
		if (settings['symmetry'] == true) {
			$('.cursor-right').remove();
			$('#cursors').append('<div class="cursor-right"></div>');
		} else {
			$('.cursor-right').remove();
		}
	}

	


	//fit canvas on screen

	$('#paper canvas').attr('height', h + 'px').attr('width', w + 'px');

	$('#paper').on('mouseleave', function() {			
		$('#cursors').removeClass('visible');
		firstLine = true;
	})

	$('#paper').on('mouseenter', function() {		
		$('#cursors').addClass('visible');
	})

	$("#paper").on('touchstart mousedown', function() {
		// if (mobile == false) {
		// 	id++;

		// 	$('#paper').append('<canvas id="' + id + '" height="' + h + 'px" width="' + w +'px">')

		// 	canvas = document.getElementById(id);
		// 	c = canvas.getContext("2d");

			
		// }

		
		click = 1;
	});

	$(window).on('touchend mouseup', function() {
		click = 0;
		console.log('mouseup')
		saveToUndoHistory();

	});


		//when clicked once make a sphere
	$('#paper').on('mousedown touchstart', function (e) {
		
		c.beginPath();
		c.arc(PosX,PosY,settings['lineWidth'] / 2,0,2*Math.PI);

		c.fillStyle="rgb(" + red + "," + green + "," + blue + ")";
		if (settings['symmetry'] == true) {
			c.arc((w - PosX),PosY,settings['lineWidth'] / 2,0,2*Math.PI);
		};
		c.fill();
		if (mobile == false) {
			PosX = e.clientX;
			PosY = e.clientY;
		};
		if (mobile == true) {
			PosX = e.originalEvent.touches[0].pageX;
			PosY = e.originalEvent.touches[0].pageY;
		};

		c.lineCap = 'round';
		c.strokeStyle = 'black';
		c.lineWidth = settings['lineWidth'];
		c.beginPath();
		c.moveTo(PosX, PosY);
		c.lineTo(PosX + 1, PosY + 1);
		console.log('asdasd')
	});

	

	$('#paper').on('mousemove touchmove', function (e) {

		// MODIFIERS //

		// stripes
		if (settings['stripes'] == true) {
			if (stripe == 1) {
				stripe = 0;
			} else {
				stripe = 1;
			}
		} else {
			stripe = 1;
		}




		//get position data	
		oldPosY = PosY;
		oldPosX = PosX;

		if (mobile == false) {
			PosX = e.clientX;
			PosY = e.clientY;
		};
		if (mobile == true) {
			PosX = e.originalEvent.touches[0].pageX;
			PosY = e.originalEvent.touches[0].pageY;		

		};

		

		//if clicked draw path
		if (click == 1) {
			if (settings['rainbowColor'] == true) {
				if (red >= 255 && green <= 0) {
					blue = blue + 1
				};
				if (green <= 0 && blue >= 255) {
					red = red - 1
				};
				if (red <= 0 && blue >= 255) {
					green = green + 1
				};
				if (red <= 0 && green >= 255) {
					blue = blue - 1
				};
				if (blue <= 0 && green >= 255) {
					red = red + 1
				};
				if (blue <= 0 && red >= 255) {
					green = green - 1
				};
			}

			
			
			
			if (mobile == false) {
				newPosX = mousePosX = e.clientX;
			};
			if (mobile == true) {
				newPosX = mousePosX = e.originalEvent.touches[0].pageX;
				//alert(mousePosY + ', ' + mousePosX)
			};
			
			if (mobile == false) {
				newPosY = mousePosY = e.clientY;
			};
			if (mobile == true) {
				newPosY = mousePosY = e.originalEvent.touches[0].pageY;
				//alert(mousePosY + ', ' + mousePosX)
			};	


			if (settings['increment'] == true) {
				difPosX = (oldPosX - newPosX);
				difPosXab = Math.abs(difPosX);
				difPosY = (oldPosY - newPosY);
				difPosYab = Math.abs(difPosY);

				//console.log((difPosXab + difPosYab) / 2 + lineWidth)
				if (settings['negativeIncrement'] == true) {
					avePos = ((difPosXab + difPosYab));
					//console.log(avePos)
					avePos = -0.1 * avePos + settings['lineWidth'];
				} else {					
					avePos = (difPosXab + difPosYab) / 2 + settings['lineWidth'];
				}
				//console.log('(difPosXab: ' + difPosXab + ' + difPosYab: ' + difPosYab + ' ) / 2 + ' + 'lineWidth: ' + lineWidth + ' = ' + avePos)
			} else {
				avePos = settings['lineWidth'];
			}
			
			if (stripe == 1 && firstLine == false) {
				c.lineCap = 'round';
				c.strokeStyle = 'rgb(' + red + ','  + green + ',' + blue + ')';
				c.lineWidth = avePos;

				c.beginPath();
				c.moveTo(oldPosX, oldPosY);
				c.lineTo(PosX, PosY);
				c.stroke();
				if (settings['symmetry'] == true) {
					c.beginPath();
					c.moveTo((w - oldPosX), oldPosY);
					c.lineTo((w - PosX), PosY);
					c.stroke();
				}
			}
			firstLine = false;

			//c.fillStyle= "rgba(255,255,255,0.01)";
			//c.fillRect(0,0,4300,2560);

		};

		//move custom cursor to mouse position
		updateCursor();
	});

	//detect when ']' is pressed
	$(window).keypress(function(e) {
		if (e.keyCode == 0 || e.keyCode == 93) {
			settings['lineWidth']++;
			updateLineThicknessInput();
			updateCursor();
			openTextNotification('lineWidth is now ' + settings['lineWidth'] + 'px');
		}
	});

	$(window).keyup(function(e) {
		if (e.keyCode === 27) {			
			toggleMenu();
		}
	});

	//detect when '[' is pressed
	$(window).keypress(function(e) {
		if (e.keyCode == 0 || e.keyCode == 91) {
			if (settings['lineWidth'] > 1) {
				settings['lineWidth']--;
			}
			console.log(settings['lineWidth'])
			updateLineThicknessInput();
			updateCursor();
			openTextNotification('lineWidth is now ' + settings['lineWidth'] + 'px');
		}
	});


	// DEBUG MENU //
	var i = 1;

	$('.menu-toggle').click(function(){
		$(this).parent().toggleClass('closed');
	});

	$('#hide-menu').on('click',function(){
		toggleMenu();
	})

	function toggleMenu() {
		if ( settings['menuOpen'] == false ) {
			settings['menuOpen'] = true;
			$('menu').addClass('active');
			Cookies.set('settings', settings);
		} else {			
			settings['menuOpen'] = false;
			$('menu').removeClass('active');
			Cookies.set('settings', settings);
		}
		console.log(settings)
	}

	//update menu toggles on load
	updateMenuToggles();
	updateMenuValues();
	updateMenuState();

	// update option buttons to display correct setting
	function updateMenuToggles() {
		for (var i = 1; i < $('#toggle-btns').children().length + 1; i++) {
			var $this = $('#toggle-btns .toggle-btn:nth-child(' + i + ')')
			//console.log(i + ' buttons');
			setting = $this.attr('setting');
			//console.log(setting)
			if (settings[setting] == true) {
				$this.addClass('active')
			} else {
				$this.removeClass('active')
			}
		}
	}

	function updateMenuValues() {
		$('#lineThickness').val(settings['lineWidth'])
	}

	function updateMenuState() {
		if (settings['menuOpen'] == true) {
			$('menu').addClass('active');
		}
	}

	// toggle symmetry
	$('.toggle-btn').on('click', function(){
		setting = $(this).attr('setting');
		if (settings[setting] == true) {
			settings[setting] = false;
			$(this).addClass('active')
		} else {
			settings[setting] = true;
			$(this).removeClass('active')
		}
		$(this).toggleClass('active')
		console.log(settings[setting]);
		openSettingsNotification(setting);
		updateSettings();
	})


	$('#line-properties input').on('input', function() {
		getInput(this);
	})

	function getInput(input) {
		
		var input = $(input).val();
		console.log(settings['lineWidth'])/*
		if (input > 0) {			
			settings['lineWidth'] = parseInt(input);
		};*/
		console.log(lineWidth)
		updateLineThicknessInput();
		updateCursor();

	}



	// SHORTCUTS //

	//check when key is pressed
	$(document).keydown(function(evt) {
		var key = evt.keyCode;
		key = String.fromCharCode(key).toLowerCase();
		if (toggleModifierShortcuts[key]) {
			key = toggleModifierShortcuts[key];
			console.log('iets anders')
			toggleSettings(key);
		} 
		if (actionShortcuts[key]) {
			key = actionShortcuts[key];
			console.log(key)
			actionSettings(key);
		}
		updateSettings();
	});

	// action settings
	function actionSettings(setting) {
		//console.log(key)
		if ( setting == 'undo' ) {
			openTextNotification('undo');
			undoLastAction();
		}

		if ( setting == 'lineWidthPlus' ) {
			lineWidth++;			
			openTextNotification('lineWidth is now ' + lineWidth + 'px');
			updateLineThicknessInput();
			updateCursor();
		}

		if ( setting == 'lineWidthMin' ) {
			lineWidth--;			
			openTextNotification('lineWidth is now ' + lineWidth + 'px');
			updateLineThicknessInput();
			updateCursor();
		}

		if ( setting == 'clear' ) {
			openTextNotification("canvas cleared");
			clearCanvas();
		}
	}

	// toggle settings
	function toggleSettings(setting) {
		//console.log(key)
		if (settings[setting] == true) {
			settings[setting] = false;
		} else {
			settings[setting] = true;
		}
		openSettingsNotification(setting);
	}


	// BOTTOM MENU BUTTONS

	$('#bottom-menu div').on('click', function(e){
		setting = $(this).attr('setting');
		console.log(setting)
		actionSettings(setting);
		undoHistory.splice(-1,1)	
	})

	//redo
	function redoLastAction(key) {
		openTextNotification('redo');
				c.clearRect(0, 0, canvas.width, canvas.height);
			var img = new Image;
			img.src = undoHistory[undoHistory.length - 2];
			  c.drawImage(img,0,0); // Or at whatever offset you like
			console.log('undo')
			undoHistory.pop();
	}


	//undo
	function undoLastAction(key) {
		console.log(c)
		c.clearRect(0, 0, canvas.width, canvas.height);
		var img = new Image;
		img.src = undoHistory[undoHistory.length - 2];
		  c.drawImage(img,0,0); // Or at whatever offset you like
		console.log('undo')
		undoHistory.pop();
	}

	function clearCanvas() {
		c.clearRect(0, 0, canvas.width, canvas.height);
	}


	function saveToUndoHistory() {
		var can = document.getElementsByTagName("canvas");
		var src = can[0].toDataURL("image/png");
		undoHistory[undoHistory.length] = src;
	}



	// NOTIFICATIONS //

	var myVar;

	// show the defined text in notification
	function openTextNotification(text) {
		Cookies.set('settings', settings);
		console.log('cooookies!!!');
		$('#notifications').html('<div class="notification"><p>' + text + '</p></div>')
		clearTimeout(myVar);
		myVar = setTimeout(fadeoutNotifications, 3000); // fadeout time
	}

	// show changed setting in notification
	function openSettingsNotification(setting) {
		Cookies.set('settings', settings);
		console.log('cooookies!!!');
		$('#notifications').html('<div class="notification"><p>' + setting + ' is set to ' + settings[setting] + '</p></div>');
		clearTimeout(myVar);
		myVar = setTimeout(fadeoutNotifications, 3000); // fadeout time
		updateMenuToggles()
	}

	// fadeout notification
	function fadeoutNotifications() {
		$('#notifications .notification').addClass('fadeout').delay( 1000 ).queue(function() {
      $(this).remove();
		});
	}




	function updateCursor() {
		$('.cursor').css({
			'transform'					:	'translate3d(' + (PosX - (settings['lineWidth'] / 2)) + 'px, ' + (PosY - (settings['lineWidth'] / 2)) + 'px, 0)',
			'background-color'	: 'rgb(' + red + ','  + green + ',' + blue + ')',
			'height'						: settings['lineWidth'] + 'px',
			'width'							:	settings['lineWidth'] + 'px'
		});
		$('.cursor-right').css({
			'transform'					: 'translate3d(' + ((w - PosX) - (settings['lineWidth'] / 2)) + 'px, ' + (PosY - (settings['lineWidth'] / 2)) + 'px, 0)', 
			'background-color'	: 'rgb(' + red + ','  + green + ',' + blue + ')',
			'height'						: settings['lineWidth'] + 'px',
			'width'							: settings['lineWidth'] + 'px'
		})
	}

	function updateLineThicknessInput() {
		$( "menu #line-properties input").val(settings['lineWidth']);
	}

	
	updateSettings();

});