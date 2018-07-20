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

console.log(map.center);

$(window).on('load', () => {
    if (!navigator.geolocation){
        return;
    }
    else{
        navigator.geolocation.getCurrentPosition(
            function success(position){
                // 좌표 불러오기
                var latitude  = position.coords.latitude;
                var longitude = position.coords.longitude;

                // 현 위치를 기준으로 맵 설정 + 중심좌표 변경 
                map.setCenter(new naver.maps.LatLng(latitude, longitude));
                map.morph(new naver.maps.LatLng(latitude, longitude), 12);
                console.log(map.center);

                // 마커 찍기
                var marker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(latitude, longitude), 
                    map: map
                });
       
                // 마커 옮기는 리스너 세팅 (marker와 map을 scope때문에 받아 올 수 없다..)
                naver.maps.Event.addListener(map, 'click', function(e) {
                    marker.setPosition(e.coord);
                });

            },
            function error(){
                var map = new naver.maps.Map('map', mapOption ); 
            },
            {
                enableHighAccuracy: false,
                maximumAge: 0,
                timeout: Infinity
            }
      ) 
    }
});

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
