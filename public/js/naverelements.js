// 이 view를 실행 시 maps에서 설정한 mongodb와 연동한 값들을 data로 불러온다.
// 이 값들은 $.get(..)에서 data parameter로 설정되고, toArray한 data들을 
$(window).on('load', () =>{
    // $.get('/yeongdeungpo', (data) => {
    //     for(var i=0; i < 300; i++){
    //         var cctvLocation = data[i]['geometry']['coordinates'];
    //         createMaker(cctvLocation);
    //     }
    // })

    // 성동구 CCTV 출력
    $.get('/sungsu', (data) => {
        for(var i=0; i < 300; i++){
            var cctvLocation = data[i]['geometry']['coordinates'];
            createMaker(cctvLocation);
            console.log('cctv');
        }
    })
    
});

// 위도, 경도에 따른 셀리 마커를 찍는 함수
function createMaker(location){
    var marker = new naver.maps.Marker({
         position: new naver.maps.LatLng(location[1], location[0]),
         map: map,
         icon: {
            url: 'img/sally.png',
            size: new naver.maps.Size(30, 32),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(25, 26)
             }
    });

    markers.push(marker);
}

// 동적 마커 표시 역활( 클릭시 마커를 움직이게 하기 위한 필요 도구 )
var markers = []; 

// idle은 지도의 움직임이 종료 되었을때, 이벤트가 발생하게 된다. 
naver.maps.Event.addListener(map, 'idle', function() {
    updateMarkers(map, markers);
});

function updateMarkers(map, markers) {

    var mapBounds = map.getBounds();
    var marker, position;

    for (var i = 0; i < markers.length; i++) {

        marker = markers[i]
        position = marker.getPosition();

        if (mapBounds.hasLatLng(position)) {
            showMarker(map, marker);
        } else {
            hideMarker(map, marker);
        }
    }
}

function showMarker(map, marker) {

    if (marker.getMap()) return;
    marker.setMap(map);
}

function hideMarker(map, marker) {

    if (!marker.getMap()) return;
    marker.setMap(null);
}


// customControler 제작
var locationBtnHtml = '<a href="#" class="btn_mylct"><span class="spr_trff spr_ico_mylct">GPS</span></a>';

//customControl 객체를 이용하여 gps 활성화 및 위치 이동
var customControl = new naver.maps.CustomControl(locationBtnHtml, {
    position: naver.maps.Position.TOP_LEFT
});

customControl.setMap(map);

var domEventListener = naver.maps.Event.addDOMListener(customControl.getElement(), 'click', function() {
    navigator.geolocation.getCurrentPosition(userLocateAcceptSuccess, userLocateAcceptFailed, userLocateOption);
});


// $('.place1').on('click', () => {
//     $.get('/maps', (data) => {
//         for(var i=300; i < 500; i++){
//          var latitude = data[i]['latitude'],
//              longitude = data[i]['longitude'];  
             
//              $('#map').html(createMaker(latitude, longitude));
//         }
//     })
// })

// $('.place2').on('click', () => {
//     $.get('/maps', (data) => {
//         for(var i=500; i < 700; i++){
//          var latitude = data[i]['latitude'],
//              longitude = data[i]['longitude'];  
             
//              $('#map').html(createMaker(latitude, longitude));
//         }
//     })
// })

// $('.place3').on('click', () => {
//     $.get('/maps', (data) => {
//         for(var i=700; i < 900; i++){
//          var latitude = data[i]['latitude'],
//              longitude = data[i]['longitude'];  
             
//              $('#map').html(createMaker(latitude, longitude));
//         }
//     })
// })

// var infowindow = new naver.maps.InfoWindow();

// function onSuccessGeolocation(position) {
//     var location = new naver.maps.LatLng(position.coords.latitude,
//                                          position.coords.longitude);

//     map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
//     map.setZoom(6); // 지도의 줌 레벨을 변경합니다.

//     infowindow.setContent('<div style="padding:20px;">' +
//         'latitude: '+ location.lat() +'<br />' +
//         'longitude: '+ location.lng() +'</div>');

//     infowindow.open(map, location);
// }

// function onErrorGeolocation() {
//     var center = map.getCenter();

//     infowindow.setContent('<div style="padding:20px;">' +
//         '<h5 style="margin-bottom:5px;color:#f00;">Geolocation failed!</h5>'+ "latitude: "+ center.lat() +"<br />longitude: "+ center.lng() +'</div>');

//     infowindow.open(map, center);
// }

// $(window).on("load", function() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
//     } else {
//         var center = map.getCenter();

//         infowindow.setContent('<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5>'+ "latitude: "+ center.lat() +"<br />longitude: "+ center.lng() +'</div>');
//         infowindow.open(map, center);
//     }
// });

