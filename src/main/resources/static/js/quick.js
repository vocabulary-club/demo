document.addEventListener("DOMContentLoaded", function() {
	quickApp.init();
});

var quickApp = {

	pv : null,
	table : null,

	originData : null,
	shuffledData : null,
	finishedData : null,
	shuffledIndex : 0,

	action : "stop", // start, stop
	
	init : function() {

		this.pv = pv;

		this.select();

		this.initTable();

		$('input[name="action"]').on('change', function () {
			
			if(quickApp.originData.length < 10) {
				alert("There must be more than 10 words at least!");
				return;
			}

			$(`#testWord${quickApp.pv}`).empty();
			$('label[for="first' + quickApp.pv + '"]').empty();
			$('label[for="second' + quickApp.pv + '"]').empty();
			$('label[for="third' + quickApp.pv + '"]').empty();
			$('label[for="fourth' + quickApp.pv + '"]').empty();
			$('label[for="fifth' + quickApp.pv + '"]').empty();
			$(`#regDate${quickApp.pv}`).empty();
			$(`#count${quickApp.pv}`).empty();
			$('input[name="answer"]').prop('checked', false);
			
			quickApp.action = this.value;
			
			if(quickApp.action == "start") {

				$(`#wordWrapper${quickApp.pv}`).removeClass('hide');
				$(`#tableWrapper${quickApp.pv}`).addClass('hide');

				quickApp.waitForData(() => {

					const limit = $('input[name="limit"]:checked').val();

					if(limit == "last 10") {
						const data = [];
						const length = quickApp.originData.length >= 10 ? 10 : quickApp.originData.length;
						for(let i = 0; i < length; i++) {
							data.push(quickApp.originData[i]);
						}
						for (let i = data.length - 1; i > 0; i--) {
							const j = Math.floor(Math.random() * (i + 1));
							[data[i], data[j]] = [data[j], data[i]];
						}
						quickApp.shuffledData = data;

					}
					else if(limit == "last 50") {
						const data = [];
						const length = quickApp.originData.length >= 50 ? 50 : quickApp.originData.length;
						for(let i = 0; i < length; i++) {
							data.push(quickApp.originData[i]);
						}
						for (let i = data.length - 1; i > 0; i--) {
							const j = Math.floor(Math.random() * (i + 1));
							[data[i], data[j]] = [data[j], data[i]];
						}
						quickApp.shuffledData = data;

					}
					else if(limit == "rand 10") {
						const data = [...quickApp.originData];
						for (let i = data.length - 1; i > 0; i--) {
							const j = Math.floor(Math.random() * (i + 1));
							[data[i], data[j]] = [data[j], data[i]];
						}
						quickApp.shuffledData = [];
						const length = data.length >= 10 ? 10 : data.length;
						for(let i = 0; i < length; i++) {
							quickApp.shuffledData.push(data[i]);
						}
					}
					else if(limit == "rand 50") {
						const data = [...quickApp.originData];
						for (let i = data.length - 1; i > 0; i--) {
							const j = Math.floor(Math.random() * (i + 1));
							[data[i], data[j]] = [data[j], data[i]];
						}
						quickApp.shuffledData = [];
						const length = data.length >= 50 ? 50 : data.length;
						for(let i = 0; i < length; i++) {
							quickApp.shuffledData.push(data[i]);
						}
					}
					
					for(let k = 0; k < quickApp.shuffledData.length; k++) {
						
						const shuffledData = quickApp.shuffledData[k];

						// shuffle
						const data = quickApp.originData.filter(x => x.dic_id != shuffledData.dic_id)
						for (let i = data.length - 1; i > 0; i--) {
							const j = Math.floor(Math.random() * (i + 1));
							[data[i], data[j]] = [data[j], data[i]];
						}

						const answerData = [];
						answerData.push(shuffledData);
						for(let i = 0; i < 4; i++) {
							answerData.push(data[i]);
						}

						for (let i = answerData.length - 1; i > 0; i--) {
							const j = Math.floor(Math.random() * (i + 1));
							[answerData[i], answerData[j]] = [answerData[j], answerData[i]];
						}

						shuffledData.answer = answerData;
					}

					quickApp.finishedData = [];
					quickApp.shuffledIndex = 0;

					quickApp.myNext();

				});	
			} else if(quickApp.action == "stop") {

				$(`#wordWrapper${quickApp.pv}`).addClass('hide');
				$(`#tableWrapper${quickApp.pv}`).removeClass('hide');

				quickApp.table.setData(quickApp.finishedData);

			}

		});

		$('input[name="answer"]').on('change', function () {
			const i = quickApp.shuffledIndex;
			const answerData = quickApp.shuffledData[i].answer[parseInt(this.value, 10)];
			if(answerData.dic_id == quickApp.shuffledData[i].dic_id) {
				if(!quickApp.finishedData[i].result) {
					quickApp.finishedData[i].result = "correct";					
				}
			} else {
				if(!quickApp.finishedData[i].result) {
					quickApp.finishedData[i].result = "wrong";
				}
			}	
			
			$('input[name="answer"]').prop('checked', false);
			quickApp.shuffledIndex++;
			quickApp.myNext();
		});

	},

	select : function() {
        fetch('/api/check/select')
            .then(response => response.json())
            .then(data => { quickApp.originData = JSON.parse(JSON.stringify(data)); })
            .catch(error => console.error('Error fetching data:', error));
    },

	waitForData : function(callback, timeout = 10000) {
        const start = Date.now();

        function check() {
            if (quickApp.originData) {
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

	myNext: function () {

		const i = quickApp.shuffledIndex;

		if (quickApp.action === "stop" || i >= quickApp.shuffledData.length) {
			// trigger event does not work on jquery
			// so use dispatchEvent		
			const actions = document.querySelectorAll('input[name="action"]');
			actions.forEach(item => {
				if(item.value == "stop") {
					item.checked = true;
					item.dispatchEvent(new Event('change'));
				}
			});
			return;
		}

		if ($('input[name="language"]:checked').val() === 'eng') {
			$(`#testWord${quickApp.pv}`).text(quickApp.shuffledData[i].eng_word);
			$('label[for="first' + quickApp.pv + '"]').text(quickApp.shuffledData[i].answer[0].mon_word);
			$('label[for="second' + quickApp.pv + '"]').text(quickApp.shuffledData[i].answer[1].mon_word);
			$('label[for="third' + quickApp.pv + '"]').text(quickApp.shuffledData[i].answer[2].mon_word);
			$('label[for="fourth' + quickApp.pv + '"]').text(quickApp.shuffledData[i].answer[3].mon_word);
			$('label[for="fifth' + quickApp.pv + '"]').text(quickApp.shuffledData[i].answer[4].mon_word);
		} else {
			$(`#testWord${quickApp.pv}`).text(quickApp.shuffledData[i].mon_word);
			$('label[for="first' + quickApp.pv + '"]').text(quickApp.shuffledData[i].answer[0].eng_word);
			$('label[for="second' + quickApp.pv + '"]').text(quickApp.shuffledData[i].answer[1].eng_word);
			$('label[for="third' + quickApp.pv + '"]').text(quickApp.shuffledData[i].answer[2].eng_word);
			$('label[for="fourth' + quickApp.pv + '"]').text(quickApp.shuffledData[i].answer[3].eng_word);
			$('label[for="fifth' + quickApp.pv + '"]').text(quickApp.shuffledData[i].answer[4].eng_word);
		}

		$(`#regDate${quickApp.pv}`).text(quickApp.shuffledData[i].reg_date);
		$(`#count${quickApp.pv}`).text((i + 1) + " / " + quickApp.shuffledData.length);

		quickApp.finishedData.push(quickApp.shuffledData[i]);		
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
			rowFormatter: function (row) {
				const data = row.getData();
				if (data.result === "correct") {
					row.getElement().style.backgroundColor = "#4f44"; // green
				} else if (data.result === "wrong") {
					row.getElement().style.backgroundColor = "#f444"; // red
				}
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