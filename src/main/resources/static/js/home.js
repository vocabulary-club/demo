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

        this.table.on("tableBuilt", function(){
            homeApp.select();
        });
    },

    select : function() {
		const day = document.querySelector('input[name="day"]:checked');
		const data = { "day" : day.value, };
		fetch('/api/home/select', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data)
			})
            .then(response => response.json())
            .then(data => {
				homeApp.table.setData(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    },
}