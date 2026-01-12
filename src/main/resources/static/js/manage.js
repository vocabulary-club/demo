document.addEventListener("DOMContentLoaded", function() {
	manageApp.init();
});

var manageApp = {

    pv : null,
    table : null,
    update : 0,
		
	init : function() {

        this.pv = pv;

	    this.initTable();
        
        const inSearch = document.getElementById(`inSearch${this.pv}`);

        const btnSelect = document.getElementById(`btnSelect${this.pv}`);
        const btnCreate = document.getElementById(`btnCreate${this.pv}`);
        const btnUpdate = document.getElementById(`btnUpdate${this.pv}`);
        const btnCancel = document.getElementById(`btnCancel${this.pv}`);
        const btnDelete = document.getElementById(`btnDelete${this.pv}`);

        const modal = document.getElementById(`modal${this.pv}`);
        const h2ModalTitle = document.getElementById(`h2ModalTitle${this.pv}`);
        const inModalEngWord = document.getElementById(`inModalEngWord${this.pv}`);
        const inModalMonWord = document.getElementById(`inModalMonWord${this.pv}`);
        const btnModalSave = document.getElementById(`btnModalSave${this.pv}`);
        const btnModalCancel = document.getElementById(`btnModalCancel${this.pv}`);

        inSearch.addEventListener("input", function(e) {
            const v = e.target.value.toLowerCase();
            manageApp.table.setFilter(function (data) {
                return (
                    data.eng_word?.toLowerCase().includes(v) ||
                    data.mon_word?.toLowerCase().includes(v)
                );
            });
        });
        btnSelect.addEventListener("click", function() {
            manageApp.selectVocDic();            
        });
        btnCreate.addEventListener("click", function() {
            manageApp.update = 0;
            h2ModalTitle.textContent = "Create Vocabulary";
            inModalEngWord.value = "";
            inModalMonWord.value = "";            
            modal.classList.add("show");
            inModalEngWord.focus();
        });
        btnUpdate.addEventListener("click", function() {
            manageApp.update = 1;
            h2ModalTitle.textContent = "Update Vocabulary";
            const selected = manageApp.table.getSelectedData();
            if(selected.length) {
                inModalEngWord.value = selected[0].eng_word;
                inModalMonWord.value = selected[0].mon_word;
                modal.classList.add("show");
                inModalEngWord.focus();
            }
        });
        btnCancel.addEventListener("click", function() {
            manageApp.table.deselectRow();
            manageApp.table.clearFilter();
        });
        btnDelete.addEventListener("click", function() {
            const selected = manageApp.table.getSelectedData();
            if(selected.length) {
                const data = {
                    dic_id : selected[0].dic_id,
                    eng_id : selected[0].eng_id,
                    mon_id : selected[0].mon_id,
                };
                fetch("/api/manage/delete", {
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
                    manageApp.selectVocDic();
                })
                .catch(function (error) {
                    alert("Failed to save.");
                });
            }
        });
        btnModalSave.addEventListener("click", function() {
            
            if(!inModalEngWord.value || !inModalMonWord.value) {
                alert("Enter your words!");
                return;
            }

            const data = {
                eng_word : inModalEngWord.value,
                mon_word : inModalMonWord.value
            };

            let url = "/create";
            if(manageApp.update == 1) {
                url = "/update";
                const selected = manageApp.table.getSelectedData();
                data.eng_id = selected[0].eng_id;
                data.mon_id = selected[0].mon_id;
            }

            fetch("/api/manage" + url, {
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
                manageApp.selectVocDic();
            })
            .catch(function (error) {
                alert("Failed to save.");
            });

            modal.classList.remove("show");
        });
        btnModalCancel.addEventListener("click", function() {
            modal.classList.remove("show");
        });

        document.addEventListener("keydown", function (e) {
            if (e.ctrlKey && e.code === "Space") {
                e.preventDefault(); // try to block browser action
                manageApp.update = 0;
                h2ModalTitle.textContent = "Create Vocabulary";
                inModalEngWord.value = "";
                inModalMonWord.value = "";            
                modal.classList.add("show");
                inModalEngWord.focus();
            }
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                e.preventDefault(); // try to block browser action
                modal.classList.remove("show");
            }
        });
	},

    selectVocDic : function() {
        fetch('/api/manage/selectVocDic')
            .then(response => response.json())
            .then(data => {
                manageApp.table.setData(data); 
            })
            .catch(error => console.error('Error fetching data:', error));
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
                {title:"Date", field:"reg_day", width: 32, },
            ],
        });

        this.table.on("tableBuilt", function(){ 
            manageApp.selectVocDic();
        });

        this.table.on("rowClick", function(e, row){ });

        this.table.on("rowSelected", function(row){ });

        this.table.on("rowDeselected", function(row){ });

    },
}