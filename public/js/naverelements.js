// 네이버 지도 실행 (기본 좌표, 줌 및 초기설정)
// mapCreate = () => {
//     var map = new naver.maps.Map('map', {
//         center: new naver.maps.LatLng(37.5297825, 126.8992506), 
//         zoom: 8, 
//         mapTypeId: naver.maps.MapTypeId.NORMAL 
//      }); 
// }

// mapCreate();

var map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(37.5297825, 126.8992506), 
    zoom: 8, 
    mapTypeId: naver.maps.MapTypeId.NORMAL,
    mapTypeControl: true,
    mapTypeControlOptions: {
        style: naver.maps.MapTypeControlStyle.BUTTON,
        position: naver.maps.Position.TOP_RIGHT
    },
    zoomControl: true,
    zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT
    }
 }); 

 // 초기 마커를 줘서 원하는 지점에 보낼 수 있게 만들기 위해
var marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(37.5297825, 126.8992506), 
    map: map
});

naver.maps.Event.addListener(map, 'click', function(e) {
    marker.setPosition(e.coord);
});

// 위도, 경도에 따른 셀리 마커를 찍는 함수
function createMaker(latitude, longitude){
     var marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(latitude, longitude),
          map: map,
          icon: {
                url: 'img/sally.png',
                size: new naver.maps.Size(30, 32),
                origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(25, 26)
                 }
     });
}

// 이 view를 실행 시 maps에서 설정한 mongodb와 연동한 값들을 data로 불러온다.
// 이 값들은 $.get(..)에서 data parameter로 설정되고, toArray한 data들을 
$(window).on('load', () =>{
    $.get('/maps', (data) => {
        for(var i=0; i < 300; i++){
         var latitude = data[i]['latitude'],
             longitude = data[i]['longitude'];  
             
             $('#map').html(createMaker(latitude, longitude));
        }
    })
});

$('.place1').on('click', () => {
    $.get('/maps', (data) => {
        for(var i=300; i < 500; i++){
         var latitude = data[i]['latitude'],
             longitude = data[i]['longitude'];  
             
             $('#map').html(createMaker(latitude, longitude));
        }
    })
})

$('.place2').on('click', () => {
    $.get('/maps', (data) => {
        for(var i=500; i < 700; i++){
         var latitude = data[i]['latitude'],
             longitude = data[i]['longitude'];  
             
             $('#map').html(createMaker(latitude, longitude));
        }
    })
})

$('.place3').on('click', () => {
    $.get('/maps', (data) => {
        for(var i=700; i < 900; i++){
         var latitude = data[i]['latitude'],
             longitude = data[i]['longitude'];  
             
             $('#map').html(createMaker(latitude, longitude));
        }
    })
})



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

