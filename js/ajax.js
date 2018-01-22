     // ajax({
     // 	type:'post',
     // 	url:'xxx',
     // 	data:{
     // 		id:'111'
     // 	},
     // 	success:function(res){
     // 		console.log(res)
     // 	}
     // })
    function ajax(obj) {
        obj = obj || {};
        obj.type = obj.type.toUpperCase() || 'POST';
        obj.url = obj.url || '';
        obj.async = obj.async || true;
        obj.data = obj.data || null;
        obj.success = obj.success || function () {
            };
        obj.error = obj.error || function () {
            };
        var xmlHttp = null;
        if (XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        } else {
            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        }
        var params = [];
        for (var key in obj.data) {
            params.push(key + '=' + obj.data[key]);
        }
        var postData = params.join('&');
        if (obj.type.toUpperCase() === 'POST') {
            xmlHttp.open(obj.type, obj.url, obj.async);
            xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
            xmlHttp.send(postData);
        } else if (obj.type.toUpperCase() === 'GET') {
            xmlHttp.open(obj.type, obj.url + '?' + postData, obj.async);
            xmlHttp.send(null);
        }
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                obj.success(xmlHttp.responseText);
            } else {
                obj.error(xmlHttp.responseText);
            }
        };
    }