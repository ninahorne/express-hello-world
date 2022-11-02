const initMap = async () => {
  // Parse parish GeoJson data
  const parishDataRaw = await axios
    .get('../json/parishData.json')
    .then((res) => res.data);

  const features = parishDataRaw.features;

  // Create polygons out of GeoJSON coordinates
  const coordinates = features.map((f) => f.geometry.coordinates);
  const polygons = coordinates.map((c) => {
    return c.map((x) => {
      return x.map((y) => {
        if (y.length == 2) {
          const [lng, lat] = y;
          return { lat, lng };
        } else {
          return y.map((z) => {
            const [lng, lat] = z;
            return { lat, lng };
          });
        }
      });
    });
  });

  // Initialize map element
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: { lat: 30.9843, lng: -91.9623 },
    mapTypeId: 'terrain',
    styles: [
      {
        elementType: 'geometry',
        stylers: [
          {
            color: '#f5f5f5',
          },
        ],
      },
      {
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#616161',
          },
        ],
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#f5f5f5',
          },
        ],
      },
      {
        featureType: 'administrative',
        stylers: [
          {
            visibility: 'on',
          },
        ],
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#97c943',
          },
          {
            visibility: 'on',
          },
        ],
      },
      {
        featureType: 'administrative.country',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#97c943',
          },
          {
            visibility: 'on',
          },
        ],
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#bdbdbd',
          },
        ],
      },
      {
        featureType: 'administrative.locality',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#97c943',
          },
          {
            visibility: 'on',
          },
          {
            weight: 5,
          },
        ],
      },
      {
        featureType: 'administrative.province',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#97c943',
          },
          {
            visibility: 'on',
          },
          {
            weight: 4,
          },
        ],
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          {
            color: '#eeeeee',
          },
        ],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#757575',
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            color: '#e5e5e5',
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#9e9e9e',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff',
          },
        ],
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#757575',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#dadada',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#616161',
          },
        ],
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#9e9e9e',
          },
        ],
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [
          {
            color: '#e5e5e5',
          },
        ],
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [
          {
            color: '#eeeeee',
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#c9c9c9',
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#9e9e9e',
          },
        ],
      },
    ],
  });

  const addPolygon = (coords) => {
    const parishOutline = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#97C943',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillOpacity: 0,
    });

    parishOutline.setMap(map);
  };

  // Add polygons to map
  polygons.forEach((gon) => {
    if (gon.length == 1) {
      gon.forEach((g) => {
        addPolygon(g);
      });
    } else {
      gon.forEach((g) => {
        if (g.length == 1) {
          addPolygon(g);
        }
      });
    }
  });
};

const init = async () => {
  window.initMap = initMap;
};

init();
