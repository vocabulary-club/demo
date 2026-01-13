document.addEventListener("DOMContentLoaded", function() {
	checkApp.init();
});

var checkApp = {

	pv : null,
	table : null,

	originData : null,
	shuffledData : null,
	finishedData : null,
	shuffledIndex : 0,

	action : "stop", // start, stop
	timer : null,
	
	init : function() {

		this.pv = pv;

		this.select();

		this.initTable();

		const actions = document.querySelectorAll('input[name="action"]');
		actions.forEach(item => {
			item.addEventListener('change', function () {

				const engWord = document.getElementById(`engWord${checkApp.pv}`);		
				const monWord = document.getElementById(`monWord${checkApp.pv}`);
				const regDate = document.getElementById(`regDate${checkApp.pv}`);
				const count = document.getElementById(`count${checkApp.pv}`);

				engWord.textContent = "";
				monWord.textContent = "";
				regDate.textContent = "";
				count.textContent = "";
				
				checkApp.action = this.value;
				
				if(this.value == "start") {
					
					const wordWrapper = document.getElementById(`wordWrapper${checkApp.pv}`);
					const tableWrapper = document.getElementById(`tableWrapper${checkApp.pv}`);
					wordWrapper.classList.remove("hide");
					tableWrapper.classList.add("hide");

					checkApp.waitForData(() => {

						const limit = document.querySelector('input[name="limit"]:checked');
						if(limit.value == "last 10") {
							const data = [];
							for(let i = 0; i < 10; i++) {
								data.push(checkApp.originData[i]);
							}
							for (let i = data.length - 1; i > 0; i--) {
								const j = Math.floor(Math.random() * (i + 1));
								[data[i], data[j]] = [data[j], data[i]];
							}
							checkApp.shuffledData = data;

						}
						else if(limit.value == "last 50") {
							const data = [];
							for(let i = 0; i < 50; i++) {
								data.push(checkApp.originData[i]);
							}
							for (let i = data.length - 1; i > 0; i--) {
								const j = Math.floor(Math.random() * (i + 1));
								[data[i], data[j]] = [data[j], data[i]];
							}
							checkApp.shuffledData = data;

						}
						else if(limit.value == "rand 10") {
							const data = [...checkApp.originData];
							for (let i = data.length - 1; i > 0; i--) {
								const j = Math.floor(Math.random() * (i + 1));
								[data[i], data[j]] = [data[j], data[i]];
							}
							checkApp.shuffledData = [];
							for(let i = 0; i < 10; i++) {
								checkApp.shuffledData.push(data[i]);
							}
						}
						else if(limit.value == "rand 50") {
							const data = [...checkApp.originData];
							for (let i = data.length - 1; i > 0; i--) {
								const j = Math.floor(Math.random() * (i + 1));
								[data[i], data[j]] = [data[j], data[i]];
							}
							checkApp.shuffledData = [];
							for(let i = 0; i < 50; i++) {
								checkApp.shuffledData.push(data[i]);
							}
						}
						checkApp.finishedData = [];
						checkApp.shuffledIndex = 0;
						
						const time = document.querySelector('input[name="time"]:checked');
						const timeInSecond = time.value * 1000;

						if (checkApp.timer) return; // prevent duplicate intervals

						checkApp.myTask();

						checkApp.timer = setInterval(checkApp.myTask, timeInSecond);

					});	
				} else if(this.value == "stop") {

					const wordWrapper = document.getElementById(`wordWrapper${checkApp.pv}`);
					const tableWrapper = document.getElementById(`tableWrapper${checkApp.pv}`);
					wordWrapper.classList.add("hide");
					tableWrapper.classList.remove("hide");

					checkApp.table.setData(checkApp.finishedData);
					clearInterval(checkApp.timer);
					checkApp.timer = null;

				}
			});
		});

	},

	select : function() {
        fetch('/api/check/select')
            .then(response => response.json())
            .then(data => { checkApp.originData = JSON.parse(JSON.stringify(data)); })
            .catch(error => console.error('Error fetching data:', error));
    },

	waitForData : function(callback, timeout = 10000) {
        const start = Date.now();

        function check() {
            if (checkApp.originData) {
                callback();
            } else if (Date.now() - start >= timeout) {
                console.error("Could not be done within timeout, stopping.");
                return; // stop retrying
            } else {
                setTimeout(check, 100);
            }
        }
        check();
    },

	myTask: function () {

		const i = checkApp.shuffledIndex;

		if (checkApp.action === "stop" || i >= checkApp.shuffledData.length) {			
			const actions = document.querySelectorAll('input[name="action"]');
			actions.forEach(item => {
				if(item.value == "stop") {
					item.checked = true;
					item.dispatchEvent(new Event('change'));
				}
			});
			return;
		}

		console.log(i, "task is at", new Date().toLocaleTimeString());

		const engWord = document.getElementById(`engWord${checkApp.pv}`);
		const monWord = document.getElementById(`monWord${checkApp.pv}`);
		const regDate = document.getElementById(`regDate${checkApp.pv}`);
		const count = document.getElementById(`count${checkApp.pv}`);

		const language = document.querySelector('input[name="language"]:checked');

		if (language.value === "eng") {
			engWord.textContent = checkApp.shuffledData[i].eng_word;
			monWord.textContent = "";
		} else {
			engWord.textContent = "";
			monWord.textContent = checkApp.shuffledData[i].mon_word;
		}

		regDate.textContent = checkApp.shuffledData[i].reg_date;
		count.textContent = (i + 1) + " / " + checkApp.shuffledData.length;

		checkApp.finishedData.push(checkApp.shuffledData[i]);
		checkApp.shuffledIndex++;
	},

	initTable : function() {

        this.table = new Tabulator(`#table${this.pv}`, {
            selectableRows:1,
            layout:"fitColumns",
            pagination: false,
            columns:[
                {
                    formatter: "rowSelection", 
                    hozAlign: "center",
                    headerSort: false,
                    frozen: true,
                    headerHozAlign: "center",
                    width: 32,
                },
                {title:"English", field:"eng_word", },
                {title:"Mongolian", field:"mon_word", },
            ],
        });

        this.table.on("tableBuilt", function(){ });
    },
}