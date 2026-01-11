document.addEventListener("DOMContentLoaded", function() {
	homeApp.init();
});

var homeApp = {

	pv : null,

	originData : null,
	shuffledData : null,
	shuffledIndex : 0,
	
	init : function() {

		this.pv = pv;

		this.selectVocDic();

		this.waitForData(() => {
			homeApp.myTask();
		});		
	},

	selectVocDic : function() {
        fetch('/api/home/selectVocDic')
            .then(response => response.json())
            .then(data => {
				homeApp.originData = JSON.parse(JSON.stringify(data));				
				homeApp.shuffledData = JSON.parse(JSON.stringify(data));
            })
            .catch(error => console.error('Error fetching data:', error));
    },

	shuffle : function() {
		const data = homeApp.shuffledData;
		for (let i = data.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[data[i], data[j]] = [data[j], data[i]];
		}
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

		const i = homeApp.shuffledIndex;
		
		if(i >= homeApp.shuffledData.length) {
			return;
		}

        console.log(i, "task is at", new Date().toLocaleTimeString());

		console.log(homeApp.shuffledData[i].eng_word, homeApp.shuffledData[i].mon_word);

		homeApp.shuffledIndex++;

        setTimeout(homeApp.myTask, 5000);
    },
}