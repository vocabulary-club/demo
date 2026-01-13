document.addEventListener("DOMContentLoaded", function() {
	homeApp.init();
});

var homeApp = {

	pv : null,
	table : null,
	
	init : function() {

		this.pv = pv;

		this.initTable();

		const days = document.querySelectorAll('input[name="day"]');
		days.forEach(item => {
			item.addEventListener('change', function () {
				homeApp.select();
			});
		});
		
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

        this.table.on("tableBuilt", function(){
            homeApp.select();
        });

        this.table.on("rowClick", function(e, row){ });

        this.table.on("rowSelected", function(row){ });

        this.table.on("rowDeselected", function(row){ });
    },

    select : function() {
		const day = document.querySelector('input[name="day"]:checked');
		const data = { "day" : day.value, };
		fetch("/api/home/select", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
		.then(function (response) {
			if (!response.ok) {
				throw new Error("HTTP error " + response.status);
			}
			return response.json();
		})
		.then(function (data) {
			homeApp.table.setData(data); 
		})
		.catch(function (error) {
			
		});
    },
}