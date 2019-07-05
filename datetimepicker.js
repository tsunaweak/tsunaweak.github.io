function datetimepicker(element){
	var self = {};
	self.element = element;
	var date = new Date();
	var monthArr =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var calHeaderText = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	self.document = function(selector){
		return document.querySelector(selector);
	}
	self.init = function(){
		let holder = document.querySelector(self.element);
		if(!holder){
			throw new Error("Element not exist.");
		}else{
			if(holder.nodeName.toLowerCase() == "input"){
				holder.setAttribute('readonly', 'true');
				holder.addEventListener('click', function(e){
					//check of calContainer if already exist
					if(self.document('#calWrap')){
						//remove style and calContainer if exist
						self.document('#calWrap').remove();
						self.document('style').remove();
					}
					self.setStyles().drawCalContainer(e).drawBody().drawCalDaysBody().eventListener();
				});
			}else{
				throw new Error("Selected element is not an input.");
			}
		}
		return this;
	}
	self.setStyles = function(){
		let style = document.createElement('style');
		let calStyle = 'input[type=number]{-moz-appearance:textfield!important}input::-webkit-inner-spin-button,input::-webkit-outer-spin-button{-webkit-appearance:none!important}#calWrap{width:260px;border:1px solid #bbb}#calWrapper{position:relative}#calContainer{position:relative;width:inherit;height:inherit}#calHeader{display:flex;width:100%;justify-content:space-around;align-items:center;height:100%;border-bottom:1px solid #bbb}#calDaysHeader{margin:0;padding:10px 0;font-size:13px;font-weight:700;border-bottom:1px solid #bbb}#calDaysBody{margin:0;padding:5px 0;border-bottom:1px solid #bbb}.calDateNow{font-size:15px;background:#ccc;font-weight:700}#calDays{display:inline-block;width:14.28%;text-align:center;font-size:15px;cursor:pointer}#calDays:hover{font-size:15px;background:#ddd;font-weight:700}#timeContainer{width:100%;display:flex;justify-content:center;text-align:center;font-weight:700;font-size:15px}#timeText{padding:5px 5px}#calHeaderOption{font-weight:700;padding:15px;display:flex}.headText{padding:0 10px;font-weight:700}#calHeaderText{display:inline-block;width:14.28%;color:#666;font-weight:700;text-align:center}#calClose{position:absolute;display:block;right:0;margin-top:-20px;margin-right:-8px;border-radius:50%;cursor:pointer;background:#ddd;padding:0 3px;font-size:12px}.calPointer{cursor:pointer!important}.timeInput{width:20px;border:1px solid #bbb;text-align:center;font-weight:700}.calArrow{padding:0 5px;cursor:pointer}.calArrow:hover{background:#d9d4d1;font-weight:bolder}.from_prev_month{color:#696969;}.from_next_month{color:#696969;}';
		style.innerHTML = calStyle;
		document.head.appendChild(style);
		return this;
	}
	self.drawCalContainer = function(e){
        var calWrap = document.createElement("div");
		calWrap.style.display = 'block'; 
        calWrap.style.position = 'fixed';
        calWrap.style.width = '260px';
        calWrap.style.zIndex = '99999999';
        calWrap.id = 'calWrap';
		let pos = e.target.getBoundingClientRect();
		calWrap.style.top = pos.top + e.target.offsetHeight + 'px';
		calWrap.style.left = pos.left + 'px';
		document.body.appendChild(calWrap);
        self.document('#calWrap').innerHTML = '<div id="calWrapper"><div id="calContainer"></div></div>';
		return this;
	}
	self.drawBody = function(){
		let calContainer = self.document('#calContainer');
		let calBody = '<div id="calHeader"><div id="calHeaderOption"><span id="prevMonth" class="calPointer calArrow">&#171;</span><span id="MonthVal" class="headText">'+ monthArr[date.getMonth()]+'</span><span id="nextMonth" class="calPointer calArrow">&#187;</span></div><div id="calHeaderOption"><span id="prevYear" class="calPointer calArrow">&#171;</span><span id="yearVal" class="headText">'+ date.getFullYear() +'</span><span id="nextYear" class="calPointer calArrow">&#187;</span></div><span id="calClose">&#x274C;</span></div>';
		calBody += '<div id="calDaysHeader">';
		for(let i = 0; i < calHeaderText.length; i++){
			calBody += '<div id="calHeaderText">' + calHeaderText[i] + '</div>';
		}
		calBody += '</div></div><div id="calDaysBody"></div>';
		let hour = (date.getHours() > 12 || date.getHours == 0)? date.getHours() - 12 : "12";
		let minute = date.getMinutes();
		let amOrPm = (date.getHours() > 12)? 'PM' : 'AM';
		calBody += '<div id="timeContainer"><div id="timeText"><span id="addHour" class="calPointer">&#x25B2;</span><input type="number" class="timeInput" id="hourText" value='+ self.padNumber(self.setHour(hour)) +'><span id="subHour" class="calPointer">&#x25BC;</span></div><span id="timeText">:</span><div id="timeText"><span id="addMinute" class="calPointer">&#x25B2;</span><input type="number"  class="timeInput" id="minuteText" value='+ self.padNumber(self.setMinutes(minute)) +'><span id="subMinute" class="calPointer">&#x25BC;</span></div><span id="timeText">:</span><div id="timeText"><span id="timeAnte" class="calPointer">&#x25B2;</span><span id="amOrpmText">'+ amOrPm +'</span><span id="timePost" class="calPointer">&#x25BC;</span></div></div>';
		let month = self.document('#MonthVal');
		let year = self.document('#yearVal');
		calContainer.innerHTML = calBody;
		return this;	
	}
	self.drawCalDaysBody = function(){
		let month = parseInt(monthArr.indexOf(self.document('#MonthVal').innerHTML));
		let year = parseInt(self.document('#yearVal').innerHTML);
		let prevMonthDays  = new Date(year, month, 0).getDate();
		let presMonthDays  = new Date(year, month + 1, 0).getDate();
		let nextMonthDays  = new Date(year, month + 2, 0).getDate();
		let firstDay = monthArr[month] + " " + "1" + " " + year;
		let weekDayCount = new Date(firstDay).getDay();
		let calDaysBody = self.document('#calDaysBody');
		calDaysBody.innerHTML = '';
		let days = '';
		for (let x = 1, y = 1; x <= 42; x++) {
			let prevDays = prevMonthDays - (weekDayCount - x);
			if(weekDayCount >= x){
				days += '<div id="calDays" class="from_prev_month">' + prevDays + '</div>';
			}else if(x >= weekDayCount && x <= presMonthDays + weekDayCount){
				let currDate = monthArr[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
				let loopDate = monthArr[month] + " " + (x - weekDayCount) + " " + year;
				if(currDate == loopDate){
					days += '<div id="calDays" class="calDateNow">' + (x - weekDayCount) + '</div>';
				}else{
					days += '<div id="calDays">' + (x - weekDayCount) + '</div>';
				}
			}else{
				days += '<div id="calDays" class="from_next_month">' + y + '</div>';
				y++;
			}
		}
		calDaysBody.innerHTML = days;
		return this;
	}
	self.setEvent = function(selector, callback){
		let element = document.querySelector(selector);
		element.onclick = callback;
	}
	self.setChange = function(selector, callback){
		let element = document.querySelector(selector);
		element.oninput = callback;
	}
	self.eventListener = function(){
		//close
		self.setEvent('#calClose', function(){
			let hour = self.document('#hourText').value;
			if(hour.length == 0){
				hour = self.padNumber(self.setHour(date.getHours()));
			}
			self.document('#hourText').value = self.padNumber(hour);
			let minute = self.document('#minuteText').value;
			if(minute.length == 0){
				minute = self.padNumber(self.setHour(date.getMinutes()));
			}
			self.document('#minuteText').value = self.padNumber(minute);
			self.setOutput();
			self.document('#calWrap').remove();
			self.document('style').remove();
		});
		//Month
		self.setEvent('#nextMonth', function(){
			let currMonth = self.document('#MonthVal');
			currMonth = parseInt(monthArr.indexOf(currMonth.innerHTML) + 1);
			if(currMonth == 12){
				currMonth = 0;
			}
			self.selectedMonth = monthArr[currMonth];
			self.document('#MonthVal').innerHTML = monthArr[currMonth];
			self.drawCalDaysBody();
			self.setOutput();
		});
		self.setEvent('#prevMonth', function(){
			let currMonth = self.document('#MonthVal');
			currMonth = parseInt(monthArr.indexOf(currMonth.innerHTML) - 1);
			if(currMonth < 0){
				currMonth = 11;
			}
			self.selectedMonth = monthArr[currMonth];
			self.document('#MonthVal').innerHTML = monthArr[currMonth];
			self.drawCalDaysBody();
			self.setOutput();
		});
		//Year
		self.setEvent('#nextYear', function(){
			let currYear = parseInt(self.document('#yearVal').innerHTML) + 1;
			self.document('#yearVal').innerHTML = currYear;
			self.drawCalDaysBody();
			self.setOutput();
		});
		self.setEvent('#prevYear', function(){
			let currYear = parseInt(self.document('#yearVal').innerHTML) - 1;
			self.document('#yearVal').innerHTML = currYear;
			self.drawCalDaysBody();
			self.setOutput();
		});

		//Hour
		self.setEvent('#addHour', function(){
			let hourVal = parseInt(self.document('#hourText').value) + 1;
			self.document('#hourText').value = self.padNumber(self.setHour(hourVal));
			self.setOutput();
		});
		self.setEvent('#subHour', function(){
			let hourVal = parseInt(self.document('#hourText').value) - 1;
			self.document('#hourText').value = self.padNumber(self.setHour(hourVal, 'sub'));
			self.setOutput();
		});
		self.setChange('#hourText', function(){
			let hourText = self.document('#hourText').value;
			//limit the string
			if(hourText.length > 2){
				hourText = hourText.substring(0, 1);
			}
			//max number
			if(hourText > 12){
				hourText = 12;
			}
			self.document('#hourText').value = hourText;
			self.setOutput();
		});
		//Minute
		self.setEvent('#addMinute', function(){
			let minuteVal = parseInt(self.document('#minuteText').value) + 1;
			self.document('#minuteText').value = self.padNumber(self.setMinutes(minuteVal));
			self.setOutput();
		});
		self.setEvent('#subMinute', function(){
			let minuteVal = parseInt(self.document('#minuteText').value) - 1;
			self.document('#minuteText').value = self.padNumber(self.setMinutes(minuteVal, 'sub'));
			self.setOutput();
		});
		self.setChange('#minuteText', function(){
			let minuteText = self.document('#minuteText').value;
			//limit the string
			if(minuteText.length > 2){
				minuteText = minuteText.substring(0, 1);
			}
			//max number
			if(minuteText > 60){
				minuteText = 60;
			}
			self.document('#minuteText').value = minuteText;
			self.setOutput();
		});
		//AMorPM
		self.setEvent('#timePost', function(){
			let amOrpm = self.document('#amOrpmText');
			if(amOrpm.innerHTML == 'AM'){
				amOrpm.innerHTML = 'PM'
			}else{
				amOrpm.innerHTML = 'AM'
			}
			self.setOutput();
		});
		self.setEvent('#timeAnte', function(){
			let amOrpm = self.document('#amOrpmText');
			if(amOrpm.innerHTML == 'AM'){
				amOrpm.innerHTML = 'PM'
			}else{
				amOrpm.innerHTML = 'AM'
			}
			self.setOutput();
		});
		//select date
		self.setEvent('#calDaysBody', function(e){
			let el = e.target;
			let xl = e.currentTarget;
			if(el != xl){
				let month = monthArr.indexOf(self.document('#MonthVal').innerHTML);
				if(el.className == 'from_prev_month'){
					if(month != 0){
						month = monthArr[month -1];
					}else{
						month = monthArr[11];
					}
				}else if(el.className == 'from_next_month'){
					if(month == 11){
						month = monthArr[0];
					}else{
						month = monthArr[month + 1];
					}
				}else{
					month = monthArr[month];
				}
				self.selectedDay = el.innerHTML;
				self.selectedMonth = month;
				self.setOutput();
			}
		});
	}
	self.setHour = function(hour, option=""){
		if(option == "sub"){
			if(hour == 0){
				hour = 12;
			}
		}else{
			if(hour > 12){
				hour = hour - 12;
			}
		}
		return hour;
	}
	self.setMinutes = function(minute, option=""){
		if(option == "sub"){
			if(minute < 0){
				minute = 60;
			}
		}else{
			if(minute > 60){
				minute = '00';
			}
		}
		return minute;
	}
	self.padNumber = function(num){
		let s = num+'';	
		(s.length == 1)? s = '0'+s : s = s;
		return s;
	}
	self.setOutput = function(){
		if(self.selectedMonth == undefined){
			self.selectedMonth = monthArr[date.getMonth()];
		}
		if(self.selectedDay == undefined){
			self.selectedDay = date.getDate();
		}
		let output =  self.selectedMonth + " " + self.selectedDay + " " + self.document('#yearVal').innerHTML + " " + self.document('#hourText').value + ":" + self.document('#minuteText').value + " " + self.document('#amOrpmText').innerHTML;
		self.document(self.element).value = output;
	}
	return self.init();

}