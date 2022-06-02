<template>
    <div :class="{'bg-slate-600': !coords}"
         class="px-2 flex items-center shadow-md rounded-md w-fit bg-white"
         @click="getGeoLocation">
      <i
          class="fas fa-location-arrow text-xl"
          :class="{'text-white': !coords, 'animate-pulse': fetchCoords}">
      </i>
    </div>
    <div class="relative max-w-6xl mx-auto ">
      <div id="map" class="h-96 z-[2]"></div>
    </div>
</template>

<script>
import leaflet from 'leaflet';

export default {
  name: "UserView",
  data() {
    return {
      coords: null,
      fetchCoords: null,
      geoMarker: null,
      map: null,
    }
  },
  methods: {
    getGeoLocation() {
      if (this.coords) {
        this.coords = null;
        sessionStorage.removeItem('coords');
        this.map.removeLayer(this.geoMarker);
        return;
      }

      // check session storage for coords
      if (sessionStorage.getItem('coords')) {
        this.coords = JSON.parse(sessionStorage.getItem('coords'));
        console.log(this.coords);
        this.plotGeolocation(this.coords);
        return;
      }

      this.fetchCoords = true;
      navigator.geolocation.getCurrentPosition(this.setCoords, this.getLocError);
    },
    setCoords(pos) {
      // stop fetching coords
      this.fetchCoords = null;

      const sessionCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      sessionStorage.setItem('coords', JSON.stringify(sessionCoords));
      this.coords = sessionCoords;

      this.plotGeolocation(this.coords);
    },
    getLocError(err) {
      this.emitter.emit('show', {
        header: "Disabled location services (GPS)",
        text:
            'If you want to take advantage of this feature, you need to enable location services.' +
            'Refresh the page if you do so.',
      })
    },
    plotGeolocation(coords) {
      this.geoMarker = leaflet.marker([coords.lat, coords.lng]).addTo(this.map);
      // 5km in meters => 5000
      // let circle = leaflet.circle([coords.lat, coords.lng], 5000).addTo(this.map);
      this.map.setView([coords.lat, coords.lng], 12);
      // this.map.fitBounds(circle.getBounds())
    }
  },
  mounted() {
    this.map = leaflet.map('map');
    leaflet.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${import.meta.env.VITE_MAPBOX}`, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: import.meta.env.VITE_MAPBOX
    }).addTo(this.map);
    this.getGeoLocation();
  }
}
</script>
