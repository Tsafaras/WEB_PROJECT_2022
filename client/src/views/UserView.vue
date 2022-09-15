<template>
  <div class="h-[80vh] relative">
    <div class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2]">
      <div
          class="w-full md:w-auto md:top-[40px] md:left-[60px] z-[2] flex gap-4 px-6 py-8 md:px-0 md:py-0 bg-transparent">
        <!-- Search -->
        <div class="relative flex-1 md:min-w-[350px]">
          <!-- Search Input -->
          <input
              v-model="searchQuery"
              class="pl-9 pr-4 py-3 text-[14px] focus:outline-none w-full shadow-md rounded-md"
              placeholder="Search..."
              type="text"
          />
          <!-- Search Icon -->
          <div class="absolute top-0 left-[8px] h-full flex items-center">
            <i class="fas fa-search" @click="runQuery"></i>
          </div>
        </div>
        <!-- Geolocation -->
        <div
            :class="{ 'bg-slate-600': coords }"
            class="px-4 bg-white flex items-center shadow-md rounded-md min-h-[45px]"
            @click="getGeoLocation"
        >
          <i
              :class="{ 'text-white': coords}"
              class="fas fa-location-arrow 'text-slate-600' text-[18px]"
          ></i>
        </div>
      </div>
    </div>
    <l-map
        v-if="!!coords"
        ref="map"
        :center="coords"
        :zoom="zoom"
        class="h-fit z-[1]"
    >
      <l-tile-layer :attribution="attribution" :url="url"></l-tile-layer>
      <l-marker :lat-lng="coords" :visible="!!coords"></l-marker>
      <l-marker v-for="poi in searchResults" :key="poi" :icon="poi.icon" :lat-lng="poi.coords"
                :visible="!!searchResults">
        <l-popup>
          <div v-html="poi.text"></div>
          <ActionButton v-if="poi.nearby" text="Check-in" @click="checkIn(poi.id)"/>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import leaflet from 'leaflet';
import haversine from 'haversine-distance'
// import "leaflet/dist/leaflet.css"
import {LMap, LMarker, LPopup, LTileLayer} from "@vue-leaflet/vue-leaflet";
import axios from "axios";

export default {
  name: "UserView",
  components: {
    LMap, LTileLayer, LMarker, LPopup
  },
  data() {
    return {
      coords: null,
      zoom: 12,
      geoMarker: null,
      searchQuery: null,
      searchResults: null,
      selectedResult: null,
      url: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${import.meta.env.VITE_MAPBOX}`,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      mapOptions: {
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
      },
      icons: {
        red: leaflet.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        }),
        orange: leaflet.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        }),
        green: leaflet.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        }),
      }
    }
  },
  methods: {
    getGeoLocation() {
      if (this.coords) {
        this.coords = null;
        this.searchResults = null;
        sessionStorage.removeItem('coords');
        return;
      }

      navigator.geolocation.getCurrentPosition(this.setCoords, this.getLocError);
    },
    setCoords(pos) {
      const sessionCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      sessionStorage.setItem('coords', JSON.stringify(sessionCoords));
      this.coords = sessionCoords;
    },
    getLocError() {
      this.emitter.emit('show', {
        header: "Disabled location services (GPS)",
        text:
            'If you want to take advantage of this feature, you need to enable location services.' +
            'Refresh the page if you do so.',
      })
    },
    async runQuery() {
      if (!this.searchQuery)
        return this.emitter.emit('show', {
          header: "Empty query",
          text: 'You need to add a search term first.'
        })

      const date = new Date();
      const visible_bounds = this.$refs.map.leafletObject.getBounds();

      await axios.get('api/user/searchPOIs', {
        params: {
          query: this.searchQuery,
          day: date.getDay(),
          hour: date.getHours(),
          bounds: {
            bottom_left: [visible_bounds._southWest.lng, visible_bounds._southWest.lat],
            upper_right: [visible_bounds._northEast.lng, visible_bounds._northEast.lat],
          }
        }
      }).then((res) => {
        if (!res.data)
          return this.emitter.emit('show', {
            header: "Nothing to show!",
            text: 'Seems like there are no POIs in this area. Try again later, or in a different location.'
          })

        let poisFound = []
        for (const poi of res.data) {
          const poiCoords = [poi.coordinates.lat, poi.coordinates.lng];

          poisFound.push({
            coords: poiCoords,
            icon: this.icons[poi.marker],
            id: poi.id,
            visitors_avg: poi.visitors_avg || 'No data',
            text:
                `<b>${poi.name}</b></br>
                <i>${poi.address}</i></br>
                Estimated capacity (%) in the next 2 hours: ${poi.populartimes[0]} - ${poi.populartimes[1]}</br>
                Average number of visitors (provided by other users): ${poi.visitors_avg || 'no data'}`,
            nearby: haversine({
              lat: this.coords.lat,
              lng: this.coords.lng
            }, {
              lat: poi.coordinates.lat,
              lng: poi.coordinates.lng
            }) < 150,
          })
        }
        this.searchResults = poisFound;
      })
    }, checkIn(uid) {
      this.emitter.emit('show', {
        header: "Check-in in progress.",
        btn_txt: "Confirm",
        text:
            'You need to confirm this action.\n\nAdditionally, you can provide us with info regarding how many people ' +
            'you think there might currently be, at the place you are checking in (optional).',
        checkingIn: true,
        poiID: uid,
        secondary: true,
      })
    }, async confirmedCheckIn(uid, people) {
      const params = {
        username: sessionStorage.getItem('username'),
        poiID: uid,
        people: people,
        date: new Date(),
      }
      await axios.post('api/user/visit', params).then((res) => {
        if (res.data.result === 1)
          return this.emitter.emit('show', {
            header: "Success!",
            text: "Your check-in was successful. Have fun!"
          })
      })
    }
  },
  mounted() {
    this.getGeoLocation();
  },
  beforeMount() {
    this.emitter.on('checkedIn', (evt) => {
      this.confirmedCheckIn(evt.poiID, evt.people)
    })
  },
}
</script>
