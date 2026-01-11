document.addEventListener("DOMContentLoaded", function() {
	homeApp.init();
});

var homeApp = {

	pv : null,
	table : null,

	originData : null,
	shuffledData : null,
	finishedData : [],
	shuffledIndex : 0,

	action : 0, // 0:start, 1:pause, 2:stop
	
	init : function() {

		this.pv = pv;

		this.initTable();

		this.selectVocDic();

		const btnStart = document.getElementById(`btnStart${this.pv}`);
		const btnPause = document.getElementById(`btnPause${this.pv}`);
		const btnStop = document.getElementById(`btnStop${this.pv}`);

		btnStart.addEventListener("click", function() {
            homeApp.waitForData(() => {
				if(homeApp.action == 1) {
					homeApp.action = 0;
					homeApp.myTask();
				} else if(homeApp.action == 2) {
					homeApp.finishedData = [];
					homeApp.shuffle();
					homeApp.shuffledIndex = 0;
					homeApp.action = 0;
					homeApp.myTask();
				} else {
					homeApp.finishedData = [];
					homeApp.shuffle();
					homeApp.shuffledIndex = 0;
					homeApp.action = 0;
					homeApp.myTask();	
				}
			});	
        });
		btnPause.addEventListener("click", function() {
            homeApp.waitForData(() => {
				homeApp.action = 1;
			});	
        });
		btnStop.addEventListener("click", function() {
            homeApp.waitForData(() => {
				homeApp.action = 2;
			});	
        });
			
	},

	selectVocDic : function() {
        fetch('/api/home/selectVocDic')
            .then(response => response.json())
            .then(data => {
				homeApp.originData = JSON.parse(JSON.stringify(data));				
				homeApp.shuffledData = JSON.parse(JSON.stringify(data));
				homeApp.shuffle();
            })
            .catch(error => console.error('Error fetching data:', error));
    },

	shuffle: function () {
		const data = [...homeApp.shuffledData];
		for (let i = data.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[data[i], data[j]] = [data[j], data[i]];
		}
		homeApp.shuffledData = data;
	},

	waitForData : function(callback, timeout = 10000) {
        const start = Date.now();

        function check() {
            if (homeApp.shuffledData) {
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

	myTask : function () {

		if(homeApp.action == 1 || homeApp.action == 2) return;

		const i = homeApp.shuffledIndex;
		
		if(i >= homeApp.shuffledData.length) {
			return;
		}

        console.log(i, "task is at", new Date().toLocaleTimeString());

		const engWord = document.getElementById(`engWord${homeApp.pv}`);		
		const monWord = document.getElementById(`monWord${homeApp.pv}`);
		const regDate = document.getElementById(`regDate${homeApp.pv}`);
		const language = document.querySelector('input[name="language"]:checked');
		const time = document.querySelector('input[name="time"]:checked');
		const second = time.value * 1000;

		if(language.value == "english") {
			engWord.textContent = homeApp.shuffledData[i].eng_word;
			monWord.textContent = "";
		} else if(language.value == "mongolian") {
			engWord.textContent = "";
			monWord.textContent = homeApp.shuffledData[i].mon_word;
		} else if(language.value == "both") {
			engWord.textContent = homeApp.shuffledData[i].eng_word;
			monWord.textContent = homeApp.shuffledData[i].mon_word;
		}
		regDate.textContent = homeApp.shuffledData[i].reg_date;

		homeApp.finishedData.push(homeApp.shuffledData[i]);
		homeApp.table.setData(homeApp.finishedData);

		homeApp.shuffledIndex++;

        setTimeout(homeApp.myTask, second);
    },

	initTable : function() {

        this.table = new Tabulator(`#table${this.pv}`, {
            selectableRows:1,
            layout:"fitColumns",      //fit columns to width of table
            responsiveLayout:"hide",  //hide columns that don't fit on the table
            addRowPos:"top",          //when adding a new row, add it to the top of the table
            history:true,             //allow undo and redo actions on the table
            pagination:"local",       //paginate the data
            paginationSize:32,         //allow 7 rows per page of data
            paginationCounter:"rows", //display count of paginated rows in footer
            movableColumns:true,      //allow column order to be changed
            initialSort:[             //set the initial sort order of the data
                {column:"reg_date", dir:"desc"},
            ],
            columnDefaults:{
                tooltip:true,         //show tool tips on cells
            },
            columns:[                 //define the table columns
                {
                    formatter: "rowSelection", 
                    //titleFormatter: "rowSelection", 
                    hozAlign: "center", // Horizontal alignment of cell contents
                    headerSort: false,  // Disable sorting on this column
                    frozen: true,        // Freeze the column in place
                    headerHozAlign: "center",
                    width: 60,
                },
                {title:"ID", field:"dic_id", width: 120, },
                {title:"English", field:"eng_word", },
                {title:"Mongolian", field:"mon_word", },
                {title:"Date", field:"reg_date", width: 120, },
            ],
        });

        this.table.on("tableBuilt", function(){ });

        this.table.on("rowClick", function(e, row){ });

        this.table.on("rowSelected", function(row){ });

        this.table.on("rowDeselected", function(row){ });

    },
}