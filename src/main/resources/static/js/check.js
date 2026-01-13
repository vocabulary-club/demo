document.addEventListener("DOMContentLoaded", function() {
	checkApp.init();
});

var checkApp = {

	pv : null,
	table : null,

	originData : null,
	shuffledData : null,
	shuffledIndex : 0,

	action : 0, // 0:start, 1:pause, 2:stop
	
	init : function() {

		this.pv = pv;

		this.initTable();

		const actions = document.querySelectorAll('input[name="action"]');
		actions.forEach(item => {
			item.addEventListener('change', function () {
				checkApp.action = this.value;
				if(this.value == "start") {
					checkApp.select();
					checkApp.waitForData(() => {
						checkApp.shuffledIndex = 0;
						checkApp.myTask();
					});	
				} else if(this.value == "stop") {
					checkApp.shuffledIndex = 0;
					checkApp.myTask();
				}
			});
		});

	},

	select : function() {
		const limit = document.querySelector('input[name="limit"]:checked');
		const value = parseInt(limit.value, 10);
		const data = { "limit" : value, };
        fetch('/api/check/select', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data)
			})
            .then(response => response.json())
            .then(data => {
				checkApp.originData = JSON.parse(JSON.stringify(data));				
				checkApp.shuffledData = JSON.parse(JSON.stringify(data));
				checkApp.shuffle();
            })
            .catch(error => console.error('Error fetching data:', error));
    },

	shuffle: function () {
		const data = [...checkApp.shuffledData];
		for (let i = data.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[data[i], data[j]] = [data[j], data[i]];
		}
		checkApp.shuffledData = data;
	},

	waitForData : function(callback, timeout = 10000) {
        const start = Date.now();

        function check() {
            if (checkApp.shuffledData) {
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

		const engWord = document.getElementById(`engWord${checkApp.pv}`);		
		const monWord = document.getElementById(`monWord${checkApp.pv}`);
		const regDate = document.getElementById(`regDate${checkApp.pv}`);
		const count = document.getElementById(`count${checkApp.pv}`);

		const wordWrapper = document.getElementById(`wordWrapper${checkApp.pv}`);
		const tableWrapper = document.getElementById(`tableWrapper${checkApp.pv}`);

		const language = document.querySelector('input[name="language"]:checked');
		const time = document.querySelector('input[name="time"]:checked');
		const timeInSecond = time.value * 1000;

		const i = checkApp.shuffledIndex;		
		if(checkApp.action == "stop") { 
			
			engWord.textContent = "";
			monWord.textContent = "";
			regDate.textContent = ""; 
			count.textContent = "";

			checkApp.table.setData(checkApp.shuffledData);

			wordWrapper.classList.add("hide");
			tableWrapper.classList.remove("hide");
			
			return;

		} else if(checkApp.action == "start") {
			wordWrapper.classList.remove("hide");
			tableWrapper.classList.add("hide");
		};

		if(i >= checkApp.shuffledData.length) { 
			
			checkApp.table.setData(checkApp.shuffledData);

			wordWrapper.classList.add("hide");
			tableWrapper.classList.remove("hide");
			
			return;

		};

        console.log(i, "task is at", new Date().toLocaleTimeString());

		if(language.value == "eng") {
			engWord.textContent = checkApp.shuffledData[i].eng_word;
			monWord.textContent = "";
		} else if(language.value == "mon") {
			engWord.textContent = "";
			monWord.textContent = checkApp.shuffledData[i].mon_word;
		} else if(language.value == "all") {
			engWord.textContent = checkApp.shuffledData[i].eng_word;
			monWord.textContent = checkApp.shuffledData[i].mon_word;
		}
		regDate.textContent = checkApp.shuffledData[i].reg_date;
		count.textContent = (1 + i) + " / " + checkApp.shuffledData.length;

		checkApp.shuffledIndex++;

        setTimeout(checkApp.myTask, timeInSecond);
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
                    width: 32,
                },
                // {title:"ID", field:"dic_id", width: 120, },
                {title:"English", field:"eng_word", },
                {title:"Mongolian", field:"mon_word", },
                // {title:"Date", field:"reg_date", width: 120, },
            ],
        });

        this.table.on("tableBuilt", function(){ });

        this.table.on("rowClick", function(e, row){ });

        this.table.on("rowSelected", function(row){ });

        this.table.on("rowDeselected", function(row){ });

    },
}