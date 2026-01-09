document.addEventListener("DOMContentLoaded", function() {
	manageApp.init();
});

var manageApp = {
		
	init : function() {

        console.log("manage app")
	    this.getVocDic();
	},

    getVocDic : function() {
        fetch('/api/main/getVocDic')
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch(error => console.error('Error fetching data:', error));
    },
}