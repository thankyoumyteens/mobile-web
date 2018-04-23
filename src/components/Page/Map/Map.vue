<template>
  <div class="map">
    <div class="map-container" id="container"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import AMap from 'AMap'

  export default {
    data() {
      return {
        map: null
      }
    },
    mounted() {
      this.initMap()
      this.getPosition()
    },
    methods: {
      getPosition() {
        if (!this.map) return false
        let vueObject = this
        console.log('正在定位...')
        let mapObj = this.map
        mapObj.plugin('AMap.Geolocation', function () {
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 3000,          // 超过3秒后停止定位，默认：无穷大
            maximumAge: 0,           // 定位结果缓存0毫秒，默认：0
            convert: true,           // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true,        // 显示定位按钮，默认：true
            buttonPosition: 'LB',    // 定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true,        // 定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        // 定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true,     // 定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true     // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          })
          mapObj.addControl(geolocation)
          geolocation.getCurrentPosition() // 精确定位, 需要https
          geolocation.getCityInfo((status, result) => {
            if (status == 'complete') {
              vueObject.updateMap(result['center'])
            }
          }) // 定位到市
          // 定位成功
          AMap.event.addListener(geolocation, 'complete', (geolocationResult) => {
            console.log('定位成功')
            console.log(geolocationResult)
            let position = geolocationResult['position']
            // 根据定位信息更新地图
            vueObject.updateMap(position)
          })
          // 定位失败
          AMap.event.addListener(geolocation, 'error', (geolocationError) => {
            console.log('定位失败')
            // console.log(geolocationError['info'])
            console.log(geolocationError['message'])
            if (geolocationError['info'] == 'FAILED') {
              // vueObject.getPosition()
            }
          })
        })
      },
      initMap(position) {
        if (!position) {
          position = [121.473658, 31.230378] // 上海
        }
        this.map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 11,
          center: position
        })
      },
      updateMap(position) {
        // 设置缩放级别和中心点
        this.map.setZoomAndCenter(11, position)
        // 在新中心点添加 marker
        let marker = new AMap.Marker({
          map: this.map,
          position: position
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .map
    width 100%
    .map-container
      width 100%
      min-height 20em
</style>
