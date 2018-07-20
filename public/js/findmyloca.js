// 기본 위치인 서울시청으로 먼저 맵을 뿌려준다
// 만약 기본 맵이 뿌려지지 않는다면, scope로 인해 Map object를 이용한 모든 method를 사용할 수 없다. 
var defaultLoaction = new naver.maps.LatLng(37.5666805, 126.9784147);

var mapOption = {
    center: defaultLoaction, 
    zoom: 11, 
    mapTypeId: naver.maps.MapTypeId.NORMAL,
    zoomControl: true,
    zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT
    }
 };

var map = new naver.maps.Map('map', mapOption);

var marker = new naver.maps.Marker({
    position : defaultLoaction,
    map : map
});

 // 마커 옮기는 리스너 세팅 (marker와 map을 scope때문에 받아 올 수 없다..)
naver.maps.Event.addListener(map, 'click', function(e) {
     marker.setPosition(e.coord);
 });

//------------------- 초기 기본 맵 설정 끝 -----------------------------

console.log(map.center);

//----------------- 위치정보 처리 변수 --------------------------------
var userLocateAcceptSuccess = function success(position){
    // 좌표 불러오기
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

    // 현 위치를 기준으로 맵 설정 + 중심좌표 변경 
    map.setCenter(new naver.maps.LatLng(latitude, longitude));
    map.morph(new naver.maps.LatLng(latitude, longitude), 12);
    console.log(map.center);

    // 현 위치의 마커 찍기( 마커가 따라 이동할 수 있는지의 여부는 ??)
    var mylocation = new naver.maps.Marker({
        position: new naver.maps.LatLng(latitude, longitude), 
        map: map,
        icon: {
            url: 'img/here.png',
            size: new naver.maps.Size(22, 22),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(25, 26),
            scaledSize : {width: 22, height: 22} // 이미지의 크기를 조절
             }
    });
}

var userLocateAcceptFailed = function error(){
    alert('더 나은 사용을 위해 GPS를 켜주시면 좋습니다.');
}

var userLocateOption = {
    enableHighAccuracy: false,
    maximumAge: 0,
    timeout: Infinity
};

// load 될 때, 사용자 위치 정보 허용 여부 및 위치 정보를 통한 위치 이동 
// navigator의 parameter에 따라 성공시 이동, 실패시 서울시청에 가만히 있는다. 
$(window).on('load', () => {
    if (!navigator.geolocation){
        return;
    }
    else navigator.geolocation.getCurrentPosition(userLocateAcceptSuccess, userLocateAcceptFailed, userLocateOption) 
});

//----------------- 위치정보 처리 끝 --------------------------------------

//---------------------- 내 좌표 확인 ------------------------------
$('#clicklocate').on('click', geoFindMe);

function geoFindMe() {
    var $output = $("#out");
  
    if (!navigator.geolocation){
      $output.html("<p>사용자의 브라우저는 지오로케이션을 지원하지 않습니다.</p>");
      return;
    }
  
    function success(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;
  
      $output.html('<p>위도 : ' + latitude + '° <br>경도 : ' + longitude + '°</p>');
  
    };
  
    function error() {
      $output.html("사용자의 위치를 찾을 수 없습니다.");
    };
  
    $output.html("<p>Locating…</p>");
  
    navigator.geolocation.getCurrentPosition(success, error);
  }
//---------------------- 내 좌표 확인 끝 ------------------------------