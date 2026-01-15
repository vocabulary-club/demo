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
	
	init : function() {

		this.pv = pv;

		this.select();

		this.initTable();

		$('input[name="action"]').on('change', function () {
			
			if(testApp.originData.length < 10) {
				alert("There must be more than 10 words at least!");
				return;
			}

			$(`#testWord${testApp.pv}`).empty();
			$('label[for="first' + testApp.pv + '"]').empty();
			$('label[for="second' + testApp.pv + '"]').empty();
			$('label[for="third' + testApp.pv + '"]').empty();
			$('label[for="fourth' + testApp.pv + '"]').empty();
			$('label[for="fifth' + testApp.pv + '"]').empty();
			$(`#regDate${testApp.pv}`).empty();
			$(`#count${testApp.pv}`).empty();
			$(`#answer${testApp.pv}`).empty();
			$('input[name="answer"]').prop('checked', false);
			
			testApp.action = this.value;
			
			if(testApp.action == "start") {

				$(`#wordWrapper${testApp.pv}`).removeClass('hide');
				$(`#tableWrapper${testApp.pv}`).addClass('hide');

				testApp.waitForData(() => {

					const limit = $('input[name="limit"]:checked').val();

					if(limit == "last 10") {
						const data = [];
						const length = testApp.originData.length >= 10 ? 10 : testApp.originData.length;
						for(let i = 0; i < length; i++) {
							data.push(testApp.originData[i]);
						}
						for (let i = data.length - 1; i > 0; i--) {
							const j = Math.floor(Math.random() * (i + 1));
							[data[i], data[j]] = [data[j], data[i]];
						}
						testApp.shuffledData = data;

					}
					else if(limit == "last 50") {
						const data = [];
						const length = testApp.originData.length >= 50 ? 50 : testApp.originData.length;
						for(let i = 0; i < length; i++) {
							data.push(testApp.originData[i]);
						}
						for (let i = data.length - 1; i > 0; i--) {
							const j = Math.floor(Math.random() * (i + 1));
							[data[i], data[j]] = [data[j], data[i]];
						}
						testApp.shuffledData = data;

					}
					else if(limit == "rand 10") {
						const data = [...testApp.originData];
						for (let i = data.length - 1; i > 0; i--) {
							const j = Math.floor(Math.random() * (i + 1));
							[data[i], data[j]] = [data[j], data[i]];
						}
						testApp.shuffledData = [];
						const length = data.length >= 10 ? 10 : data.length;
						for(let i = 0; i < length; i++) {
							testApp.shuffledData.push(data[i]);
						}
					}
					else if(limit == "rand 50") {
						const data = [...testApp.originData];
						for (let i = data.length - 1; i > 0; i--) {
							const j = Math.floor(Math.random() * (i + 1));
							[data[i], data[j]] = [data[j], data[i]];
						}
						testApp.shuffledData = [];
						const length = data.length >= 50 ? 50 : data.length;
						for(let i = 0; i < length; i++) {
							testApp.shuffledData.push(data[i]);
						}
					}
					
					for(let k = 0; k < testApp.shuffledData.length; k++) {
						
						const shuffledData = testApp.shuffledData[k];

						// shuffle
						const data = testApp.originData.filter(x => x.dic_id != shuffledData.dic_id)
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

					testApp.finishedData = [];
					testApp.shuffledIndex = 0;

					testApp.myNext();

				});	
			} else if(testApp.action == "stop") {

				$(`#wordWrapper${testApp.pv}`).addClass('hide');
				$(`#tableWrapper${testApp.pv}`).removeClass('hide');

				testApp.table.setData(testApp.finishedData);

			}

		});

		$('input[name="answer"]').on('change', function () {			
			$(`#answer${testApp.pv}`).removeClass("colorRed colorGreen");
			const i = testApp.shuffledIndex;
			const answerData = testApp.shuffledData[i].answer[parseInt(this.value, 10)];
			if(answerData.dic_id == testApp.shuffledData[i].dic_id) {
				$(`#answer${testApp.pv}`).text("correct");
				$(`#answer${testApp.pv}`).addClass("colorGreen");
				if(!testApp.finishedData[i].result) {
					testApp.finishedData[i].result = "correct";					
				}
			} else {
				$(`#answer${testApp.pv}`).text("wrong");
				$(`#answer${testApp.pv}`).addClass("colorRed");
				if(!testApp.finishedData[i].result) {
					testApp.finishedData[i].result = "wrong";
				}
			}	
			
			// $(`#btnNext${testApp.pv}`).trigger('click');
		});

		$(`#btnNext${testApp.pv}`).on('click', (e) => {
			$('input[name="answer"]').prop('checked', false);
			$(`#answer${testApp.pv}`).empty();
			testApp.shuffledIndex++;
			testApp.myNext();
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

	myNext: function () {

		const i = testApp.shuffledIndex;

		if (testApp.action === "stop" || i >= testApp.shuffledData.length) {
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
			$(`#testWord${testApp.pv}`).text(testApp.shuffledData[i].eng_word);
			$('label[for="first' + testApp.pv + '"]').text(testApp.shuffledData[i].answer[0].mon_word);
			$('label[for="second' + testApp.pv + '"]').text(testApp.shuffledData[i].answer[1].mon_word);
			$('label[for="third' + testApp.pv + '"]').text(testApp.shuffledData[i].answer[2].mon_word);
			$('label[for="fourth' + testApp.pv + '"]').text(testApp.shuffledData[i].answer[3].mon_word);
			$('label[for="fifth' + testApp.pv + '"]').text(testApp.shuffledData[i].answer[4].mon_word);
		} else {
			$(`#testWord${testApp.pv}`).text(testApp.shuffledData[i].mon_word);
			$('label[for="first' + testApp.pv + '"]').text(testApp.shuffledData[i].answer[0].eng_word);
			$('label[for="second' + testApp.pv + '"]').text(testApp.shuffledData[i].answer[1].eng_word);
			$('label[for="third' + testApp.pv + '"]').text(testApp.shuffledData[i].answer[2].eng_word);
			$('label[for="fourth' + testApp.pv + '"]').text(testApp.shuffledData[i].answer[3].eng_word);
			$('label[for="fifth' + testApp.pv + '"]').text(testApp.shuffledData[i].answer[4].eng_word);
		}

		$(`#regDate${testApp.pv}`).text(testApp.shuffledData[i].reg_date);
		$(`#count${testApp.pv}`).text((i + 1) + " / " + testApp.shuffledData.length);

		testApp.finishedData.push(testApp.shuffledData[i]);		
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