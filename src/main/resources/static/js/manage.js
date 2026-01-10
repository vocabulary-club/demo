document.addEventListener("DOMContentLoaded", function() {
	manageApp.init();
});

var manageApp = {

    table : null,
		
	init : function() {

        console.log("manage app")
	    this.getVocDic();

	    this.initTable();

        window.addEventListener("resize", () => {
            manageApp.table.redraw();
        });

        const modal = document.getElementById("modal");
        document.getElementById("btnCreate").onclick = () => {
            modal.classList.remove("hide");
        };
        document.getElementById("btnModalSave").onclick = () => {
            modal.classList.add("hide");
        };
        document.getElementById("btnModalCancel").onclick = () => {
            modal.classList.add("hide");
        };
        
	},

    getVocDic : function() {
        fetch('/api/main/getVocDic')
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch(error => console.error('Error fetching data:', error));
    },

    initTable : function() {

        var tabledata = [
            {id:1, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1},
            {id:2, name:"Mary May", progress:1, gender:"female", rating:2, col:"blue", dob:"14/05/1982", car:true},
            {id:3, name:"Christine Lobowski", progress:42, gender:"female", rating:0, col:"green", dob:"22/05/1982", car:"true"},
            {id:4, name:"Brendon Philips", progress:100, gender:"male", rating:1, col:"orange", dob:"01/08/1980"},
            {id:5, name:"Margret Marmajuke", progress:16, gender:"female", rating:5, col:"yellow", dob:"31/01/1999"},
            {id:6, name:"Frank Harbours", progress:38, gender:"male", rating:4, col:"red", dob:"12/05/1966", car:1},
            {id:7, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1},
            {id:8, name:"Mary May", progress:1, gender:"female", rating:2, col:"blue", dob:"14/05/1982", car:true},
            {id:9, name:"Christine Lobowski", progress:42, gender:"female", rating:0, col:"green", dob:"22/05/1982", car:"true"},
            {id:10, name:"Brendon Philips", progress:100, gender:"male", rating:1, col:"orange", dob:"01/08/1980"},
            {id:11, name:"Margret Marmajuke", progress:16, gender:"female", rating:5, col:"yellow", dob:"31/01/1999"},
            {id:12, name:"Frank Harbours", progress:38, gender:"male", rating:4, col:"red", dob:"12/05/1966", car:1},
            {id:13, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1},
            {id:14, name:"Mary May", progress:1, gender:"female", rating:2, col:"blue", dob:"14/05/1982", car:true},
            {id:15, name:"Christine Lobowski", progress:42, gender:"female", rating:0, col:"green", dob:"22/05/1982", car:"true"},
            {id:16, name:"Brendon Philips", progress:100, gender:"male", rating:1, col:"orange", dob:"01/08/1980"},
            {id:17, name:"Margret Marmajuke", progress:16, gender:"female", rating:5, col:"yellow", dob:"31/01/1999"},
            {id:18, name:"Frank Harbours", progress:38, gender:"male", rating:4, col:"red", dob:"12/05/1966", car:1},
            {id:19, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1},
            {id:20, name:"Mary May", progress:1, gender:"female", rating:2, col:"blue", dob:"14/05/1982", car:true},
            {id:21, name:"Christine Lobowski", progress:42, gender:"female", rating:0, col:"green", dob:"22/05/1982", car:"true"},
            {id:22, name:"Brendon Philips", progress:100, gender:"male", rating:1, col:"orange", dob:"01/08/1980"},
            {id:23, name:"Margret Marmajuke", progress:16, gender:"female", rating:5, col:"yellow", dob:"31/01/1999"},
            {id:24, name:"Frank Harbours", progress:38, gender:"male", rating:4, col:"red", dob:"12/05/1966", car:1},
            {id:25, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1},
            {id:26, name:"Mary May", progress:1, gender:"female", rating:2, col:"blue", dob:"14/05/1982", car:true},
            {id:27, name:"Christine Lobowski", progress:42, gender:"female", rating:0, col:"green", dob:"22/05/1982", car:"true"},
            {id:28, name:"Brendon Philips", progress:100, gender:"male", rating:1, col:"orange", dob:"01/08/1980"},
            {id:29, name:"Margret Marmajuke", progress:16, gender:"female", rating:5, col:"yellow", dob:"31/01/1999"},
            {id:30, name:"Frank Harbours", progress:38, gender:"male", rating:4, col:"red", dob:"12/05/1966", car:1},
        ];

        this.table = new Tabulator("#table", {
            data:tabledata,           //load row data from array
            layout:"fitColumns",      //fit columns to width of table
            responsiveLayout:"hide",  //hide columns that don't fit on the table
            addRowPos:"top",          //when adding a new row, add it to the top of the table
            history:true,             //allow undo and redo actions on the table
            pagination:"local",       //paginate the data
            paginationSize:100,         //allow 7 rows per page of data
            paginationCounter:"rows", //display count of paginated rows in footer
            movableColumns:true,      //allow column order to be changed
//            height: "100%",           // 🔴 REQUIRED
            initialSort:[             //set the initial sort order of the data
                {column:"name", dir:"asc"},
            ],
            columnDefaults:{
                tooltip:true,         //show tool tips on cells
            },
            columns:[                 //define the table columns
                {title:"Name", field:"name", editor:"input"},
                {title:"Task Progress", field:"progress", hozAlign:"left", formatter:"progress", editor:true},
                {title:"Gender", field:"gender", width:95, editor:"list", editorParams:{values:["male", "female"]}},
                {title:"Rating", field:"rating", formatter:"star", hozAlign:"center", width:100, editor:true},
                {title:"Color", field:"col", width:130, editor:"input"},
                {title:"Date Of Birth", field:"dob", width:130, sorter:"date", hozAlign:"center"},
                {title:"Driver", field:"car", width:90,  hozAlign:"center", formatter:"tickCross", sorter:"boolean", editor:true},
            ],
        });
    },
}