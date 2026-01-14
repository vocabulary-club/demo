document.addEventListener("DOMContentLoaded", function() {
	testApp.init();
});

var testApp = {

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

				const engWord = document.getElementById(`engWord${testApp.pv}`);		
				const monWord = document.getElementById(`monWord${testApp.pv}`);
				const regDate = document.getElementById(`regDate${testApp.pv}`);
				const count = document.getElementById(`count${testApp.pv}`);

				engWord.textContent = "";
				monWord.textContent = "";
				regDate.textContent = "";
				count.textContent = "";
				
				testApp.action = this.value;
				
				if(this.value == "start") {
					
					const wordWrapper = document.getElementById(`wordWrapper${testApp.pv}`);
					const tableWrapper = document.getElementById(`tableWrapper${testApp.pv}`);
					wordWrapper.classList.remove("hide");
					tableWrapper.classList.add("hide");

					testApp.waitForData(() => {

						const limit = document.querySelector('input[name="limit"]:checked');
						if(limit.value == "last 10") {
							const data = [];
							for(let i = 0; i < 10; i++) {
								data.push(testApp.originData[i]);
							}
							for (let i = data.length - 1; i > 0; i--) {
								const j = Math.floor(Math.random() * (i + 1));
								[data[i], data[j]] = [data[j], data[i]];
							}
							testApp.shuffledData = data;

						}
						else if(limit.value == "last 50") {
							const data = [];
							for(let i = 0; i < 50; i++) {
								data.push(testApp.originData[i]);
							}
							for (let i = data.length - 1; i > 0; i--) {
								const j = Math.floor(Math.random() * (i + 1));
								[data[i], data[j]] = [data[j], data[i]];
							}
							testApp.shuffledData = data;

						}
						else if(limit.value == "rand 10") {
							const data = [...testApp.originData];
							for (let i = data.length - 1; i > 0; i--) {
								const j = Math.floor(Math.random() * (i + 1));
								[data[i], data[j]] = [data[j], data[i]];
							}
							testApp.shuffledData = [];
							for(let i = 0; i < 10; i++) {
								testApp.shuffledData.push(data[i]);
							}
						}
						else if(limit.value == "rand 50") {
							const data = [...testApp.originData];
							for (let i = data.length - 1; i > 0; i--) {
								const j = Math.floor(Math.random() * (i + 1));
								[data[i], data[j]] = [data[j], data[i]];
							}
							testApp.shuffledData = [];
							for(let i = 0; i < 50; i++) {
								testApp.shuffledData.push(data[i]);
							}
						}
						testApp.finishedData = [];
						testApp.shuffledIndex = 0;
						
						const time = document.querySelector('input[name="time"]:checked');
						const timeInSecond = time.value * 1000;

						if (testApp.timer) return; // prevent duplicate intervals

						testApp.myTask();

						testApp.timer = setInterval(testApp.myTask, timeInSecond);

					});	
				} else if(this.value == "stop") {

					const wordWrapper = document.getElementById(`wordWrapper${testApp.pv}`);
					const tableWrapper = document.getElementById(`tableWrapper${testApp.pv}`);
					wordWrapper.classList.add("hide");
					tableWrapper.classList.remove("hide");

					testApp.table.setData(testApp.finishedData);
					clearInterval(testApp.timer);
					testApp.timer = null;

				}
			});
		});

	},

	select : function() {
        fetch('/api/check/select')
            .then(response => response.json())
            .then(data => { testApp.originData = JSON.parse(JSON.stringify(data)); })
            .catch(error => console.error('Error fetching data:', error));
    },

	waitForData : function(callback, timeout = 10000) {
        const start = Date.now();

        function check() {
            if (testApp.originData) {
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

		const i = testApp.shuffledIndex;

		if (testApp.action === "stop" || i >= testApp.shuffledData.length) {			
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

		const engWord = document.getElementById(`engWord${testApp.pv}`);
		const monWord = document.getElementById(`monWord${testApp.pv}`);
		const regDate = document.getElementById(`regDate${testApp.pv}`);
		const count = document.getElementById(`count${testApp.pv}`);

		const language = document.querySelector('input[name="language"]:checked');

		if (language.value === "eng") {
			engWord.textContent = testApp.shuffledData[i].eng_word;
			monWord.textContent = "";
		} else {
			engWord.textContent = "";
			monWord.textContent = testApp.shuffledData[i].mon_word;
		}

		regDate.textContent = testApp.shuffledData[i].reg_date;
		count.textContent = (i + 1) + " / " + testApp.shuffledData.length;

		testApp.finishedData.push(testApp.shuffledData[i]);
		testApp.shuffledIndex++;
	},

	initTable : function() {

        this.table = new Tabulator(`#table${this.pv}`, {
            selectableRows:1,
            layout:"fitColumns",
			history:true,
            pagination: false,
			columnDefaults:{
                tooltip:true,         //show tool tips on cells
            },
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