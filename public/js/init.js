let map;

const historicSpotsMarkerPath = '/assets/historic-spots.svg';
const jailMarkerPath = '/assets/jails.svg';
const janitorialServicesMarkerPath = '/assets/janitorial-services.svg';
const historicSpotsMarkers = [];
const jailMarkers = [];
const janMarkers = [];

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

const addMarker = (coords, title, icon, infowindow, list) => {
  const marker = new google.maps.Marker({
    position: coords,
    map,
    title,
    icon,
  });
  marker.addListener('click', () => {
    infowindow.open({
      anchor: marker,
      map,
    });
  });

  list.push(marker);
};

const fetchHistoricSpotsData = async () => {
  return axios.get('/api/historic-spots').then((res) => res.data);
};

const fetchJailData = async () => {
  return axios.get('/api/jails').then((res) => res.data);
};

const fetchJanitorialServicesData = async () => {
  return axios.get('/api/janitorial-services').then((res) => res.data);
};

const initMap = async () => {
  // Initialize map element
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
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

  // Parse parish GeoJson data
  const parishDataRaw = await axios
    .get('../json/parishData.json')
    .then((res) => res.data);
  const historicSpots = await fetchHistoricSpotsData();
  const jails = await fetchJailData();
  const janitorialServices = await fetchJanitorialServicesData();

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

  // Add historic spots
  historicSpots.forEach((spot) => {
    const [lat, lng] = spot.fields.Address.split(',');
    const coords = { lat: Number(lat), lng: Number(lng) };
    const title = spot.fields['Historic Location Name'];
    const text = spot.fields['Website Text'];

    const content = `
      <div class="info-window">
        <h1>${title}</h1>
        <p>${text}</p>
      </div>
    `;
    const infowindow = new google.maps.InfoWindow({
      content,
      ariaLabel: title,
      maxWidth: 252,
    });

    addMarker(
      coords,
      spot.fields['Historic Location Name'],
      historicSpotsMarkerPath,
      infowindow,
      historicSpotsMarkers,
    );
  });

  // Add jails
  jails.forEach((jail) => {
    if (jail.fields.Coordinates) {
      const [lat, lng] = jail.fields.Coordinates.split(',');
      const coords = { lat: Number(lat), lng: Number(lng) };
      const title = jail.fields['Prison/Jail'];
      const image = jail.fields.URL?.replaceAll(
        'upload',
        'upload/h_200,w_200,c_fill,q_30',
      )?.split(';');
      const address = jail.fields.Address;
      const operator = jail.fields['What Type of Facility?'];
      const hardLabor = jail.fields['Total People With Hard Labor Sentences'];
      const percentBlack = jail.fields['%Black Population'];
      const percentWhite = jail.fields['%White Population'];
      const percentAsian = jail.fields['%Asian Population'];
      const percentIndian = jail.fields['%Indian Population'];
      const percentHispanic = jail.fields['%Hispanic Population'];
      const precentLatinx = jail.fields['%Latinx Population'];
      const percentOther = jail.fields['%Other'];
      const percentMen = jail.fields['%Men Population'];
      const percentWomen = jail.fields['%Women Population'];

      const transWork =
        jail.fields[
          'Had An Operational Transitional Work Program in June 2022'
        ];
      const parish = jail.fields.Parish;
      const totalIncarc = jail.fields['Total Incarceration In Parish'];
      const convRating = jail.fields['Conviction Rating'];
      const dispBene = jail.fields['Disparate Benefit From Incarcerated Labor'];
      const reqs =
        jail.fields['Answered Public Record Requests About Types of Labor'];
      const type = jail.fields['What Type of Work at Facility'];
      const doc = jail.fields['# Convictions in DOC Custody'];
      const deprivation = jail.fields['Deprivation Rating'];
      const color = jail.fields.Color;
      const benefit = jail.fields['Benefit Rating'];
      const convRate = jail.fields['Parish Conviction Rate'];

      const content = `
    <div class="info-window">
      <h2>${title}</h2>
      ${image ? `${image.map((src) => `<img src="${src}" />`)}` : ''}
      <h3>Address</h3>
      <p>${address}</p>
      <h3>Operator</h3>
      <p>${operator}</p>
      <h3>People Serving Hard Labor Sentences</h3>
      <p>${hardLabor}</p>
      <h3>Demographics</h3>
      <ul>
        <li>Black: ${percentBlack || '0%'}</li>
        <li>White: ${percentWhite || '0%'}</li>
        <li>Asian: ${percentAsian || '0%'}</li>
        <li>Indian: ${percentIndian || '0%'}</li>
        <li>Hispanic: ${percentHispanic || '0%'}</li>
        <li>Latinx: ${precentLatinx || '0%'}</li>
        <li>Other: ${percentOther || '0%'}</li>
        <li>Men: ${percentMen || '0%'}</li>
        <li>Women: ${percentWomen || '0%'}</li>
      </ul>
      <h3>Did The Facility Respond To Questions About The Types of Labor?</h3>
      <p>${reqs}</p>
      ${
        type
          ? `<h3>Disclosed Labor Types</h3>
      <p>${type.join(', ')}</p>`
          : ''
      }
      <h3>Does this facility have a transitional work program (work release)</h3>
      <p>${transWork}</p>
      <p>This facility is located in ${parish} Parish. We looked at all the people who were serving
      hard labor sentences in the State of Louisiana in 2020-21. Harms that had occurred in
      ${parish} Parish accounted for ${
        totalIncarc || 0
      } people serving hard labor
      sentences in the prison system, and ${parish} Parish had the ${
        convRating || 0
      } most
      people serving hard labor sentences, when considering the parish&#39;s population. The
      nature of forced labor means the communities that hold the most people serving hard
      labor sentences get the most free or virtually free labor from incarcerated people.
      ${parish} Parish has jails or prisons that hold ${
        totalIncarc || 0
      } people with
      hard labor sentences, meaning the difference between people sent to serve hard labor
      sentences and those laboring in its prisons is ${dispBene || 0}.
    </div>
  `;
      const infowindow = new google.maps.InfoWindow({
        content,
        ariaLabel: title,
        maxWidth: 252,
      });

      addMarker(
        coords,
        jail.fields['Prison/Jail'],
        jailMarkerPath,
        infowindow,
        jailMarkers,
      );
    }
  });
  // Add janitorial services
  janitorialServices.forEach((service) => {
    // const [lat, lng] = service.fields.Coordinates.split(',');
    const coords = { lat: 0, lng: 0 };
    const buildingName = service.fields['Building Name'];
    const address = service.fields.Address;
    const offices = service.fields['Offices in the Building'];
    const content = `Prison Enterprises takes men in Louisiana&#39;s prisons and uses them for janitorial
    services in buildings around the state. ${buildingName} is located at ${address} and in
    2021, it used incarcerated labor for janitorial services. Within the building are the
    following offices: ${offices}.`;
    const infowindow = new google.maps.InfoWindow({
      content,
      ariaLabel: buildingName,
      maxWidth: 252,
    });
    addMarker(
      coords,
      service.fields['Building Name'],
      janitorialServicesMarkerPath,
      infowindow,
      janMarkers,
    );
  });
};

const init = async () => {
  window.initMap = initMap;
};

const setUpMapLegend = () => {
  const jailSwitch = document.getElementById('jailSwitch');
  const janSwitch = document.getElementById('janSwitch');
  const histSwitch = document.getElementById('histSwitch');
  jailSwitch.addEventListener('change', (event) => {
    if (event.target.checked) {
      jailMarkers.forEach((marker) => {
        marker.setMap(map);
      });
    } else {
      jailMarkers.forEach((marker) => {
        marker.setMap(null);
      });
    }
  });
  janSwitch.addEventListener('change', (event) => {
    if (event.target.checked) {
      janMarkers.forEach((marker) => {
        marker.setMap(map);
      });
    } else {
      janMarkers.forEach((marker) => {
        marker.setMap(null);
      });
    }
  });
  histSwitch.addEventListener('change', (event) => {
    if (event.target.checked) {
      historicSpotsMarkers.forEach((marker) => {
        marker.setMap(map);
      });
    } else {
      historicSpotsMarkers.forEach((marker) => {
        marker.setMap(null);
      });
    }
  });
};

init();
setUpMapLegend();
