//Set up Mapbox

mapboxgl.accessToken = 'pk.eyJ1IjoiZWtzMjA4MCIsImEiOiJjbHVsdWNmbTExNGg0MmtsZHVlOHN2Zzd5In0.wEYw-sKV39S4NkqO8CDQBw';


var mapOptions = {
    container: 'map-container', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: [-74.00011310930516, 40.72415607434748], // starting position [lng, lat]
    zoom: 10.5, // starting zoom,
}

// create map
const map = new mapboxgl.Map(mapOptions);


// add a navitation tool
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

// loop over the grocery store script to style markers for each grocery store record

groceryStores.forEach(function (grocerystoresRecord) {

    var color

    // use if statements to assign colors based on borough

    if (grocerystoresRecord.name === 'Trader Joes') {
        color = '#9932CC'
    }
    if (grocerystoresRecord.name === 'Whole Foods') {
        color = '#556B2F'
    }
    if (grocerystoresRecord.name === 'Aldi') {
        color = '#483D8B'
    }

    // create a popup for each marker with store address and neighborhood

    const popup = new mapboxgl.Popup({
        offset: 24,
        anchor: 'bottom'
    }).setHTML(

        `<strong>${grocerystoresRecord.name}</strong> is located on <strong>${grocerystoresRecord.address}</strong> in <strong>${grocerystoresRecord.neighborhood}</strong>, <strong>${grocerystoresRecord.borough}</strong>.`
    );

    // create the marker, set the coordinates, add the popup, add it to the map
    var marker = new mapboxgl.Marker({
        scale: 0.50,
        color: color,
    })
        .setLngLat([grocerystoresRecord.longitude, grocerystoresRecord.latitude])
        .setPopup(popup)
        .addTo(map);
    }
)
//turn grocery store locations on and off//
function hide() {
    let markers = document.getElementsByClassName("mapboxgl-marker");
    for (let i = 0; i <markers.length; i++) {
        markers[i].style.visibility = "hidden";
    }
}

function show() {
    let markers = document.getElementsByClassName("mapboxgl-marker");
    for (let i = 0; i < markers.length; i++) {
        markers[i].style.visibility = "visible";
    }
}
document.getElementById('turnon').addEventListener('click', () => {
    show()
});
document.getElementById('turnoff').addEventListener('click', () => {
    hide()
});

map.on('load', function () {

    // set up borough buttons. click on button and flyto that borough 
    $('#queens-button').on('click', function () {
        const targetCenter = [-73.89387763569168, 40.73104567408716];
        const targetZoom = 11;

        const offsetLng = -0.03;
        const offsetLat = 0.005;

        const adjustedCenter = [targetCenter[0] + offsetLng, targetCenter[1] - offsetLat];

        map.flyTo({
            center: adjustedCenter,
            zoom: targetZoom,
            duration: 1500
        })
    })
    $('#manhattan-button').on('click', function () {
        const targetCenter = [-73.97369874032192, 40.77132321682226];
        const targetZoom = 11;

        const offsetLng = -0.01;
        const offsetLat = 0.005;

        const adjustedCenter = [targetCenter[0] + offsetLng, targetCenter[1] - offsetLat];

        map.flyTo({
            center: adjustedCenter,
            zoom: targetZoom,
            duration: 1500
        })
    })
    $('#bronx-button').on('click', function () {
        const targetCenter = [-73.91579103266682, 40.81437684228872];
        const targetZoom = 11.5;

        const offsetLng = -0.01;
        const offsetLat = -0.03;

        const adjustedCenter = [targetCenter[0] + offsetLng, targetCenter[1] - offsetLat];

        map.flyTo({
            center: adjustedCenter,
            zoom: targetZoom,
            duration: 1500
        })
    })

    $('#brooklyn-button').on('click', function () {
        const targetCenter = [-73.95743869447674, 40.644049824373106];
        const targetZoom = 11;

        const offsetLng = -0.05;
        const offsetLat = 0.005;

        const adjustedCenter = [targetCenter[0] + offsetLng, targetCenter[1] - offsetLat];

        map.flyTo({
            center: adjustedCenter,
            zoom: targetZoom,
            duration: 1500
        })
    })

    $('#staten-island-button').on('click', function () {
        const targetCenter = [-74.15564345189712, 40.582654444824755];
        const targetZoom = 11;

        const offsetLng = -0.05;
        const offsetLat = 0.005;

        const adjustedCenter = [targetCenter[0] + offsetLng, targetCenter[1] - offsetLat];

        map.flyTo({
            center: adjustedCenter,
            zoom: targetZoom,
            duration: 1500
        })
    })

    // add a geojson of NTA boundaries
    map.addSource('nta2', {
        type: 'geojson',
        data: 'data/nta2.geojson',
        generateId: true
    })
    // fill NTA boundaries based on median household income and add hover opacity
    map.addLayer({
        id: 'nta-fill',
        type: 'fill',
        source: 'nta2',
        paint: {
            'fill-color': [
                'step',
                ['get', 'medincomecsv_medincome2'],
                '#ffffff',  // Colors
                20000, '#d9f2d9',  // Lower bound 0 - 20,000
                40000, '#9fdf9f',  // Lower bound 20,001 - 40,000
                60000, '#66cc66',  // Lower bound 40,001 - 60,000
                80000, '#39ac39',  // Lower bound 60,000 - 80,000
                100000, '#339933', // Lower bound 80,001 - 100,000
                500000, '#267326'  // Lower bound 100,001 - 500,000
            ],
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1.0,
                0.5
            ]
        }
    });
    // add NTA outlines
    map.addLayer({
        id: 'nta-line',
        type: 'line',
        source: 'nta2',
        paint: {
            'line-color': '#6b6b6b',
        }
    })
    //add hover popip for NTA areas, detailing neighorborhood name and household income
    let hoveredPolygonId = null;

    map.on('mousemove', 'nta-fill', (e) => {
        if (e.features.length > 0) {
            const ntaName = e.features[0].properties.nta2;

            if (hoveredPolygonId !== null) {
                map.setFeatureState(
                    { source: 'nta2', id: hoveredPolygonId },
                    { hover: false }
                );
            }
            hoveredPolygonId = e.features[0].id;

            map.setFeatureState(
                { source: 'nta2', id: hoveredPolygonId },
                { hover: true }
            );

            const aboutnta = document.getElementById("aboutnta");
            aboutnta.innerHTML = `
                <div>Neighborhood Name: <strong>${e.features[0].properties.ntaname}</strong></div>
                <div>Borough: <strong>${e.features[0].properties.boroname}</strong></div>
                <div>Median Household Income (2020): <strong>${numeral(e.features[0].properties.medincomecsv_medincome2).format('$0,0')}</strong></div>
              `;
            aboutnta.style.display = "block";
            aboutnta.style.left = e.point.x + 'px';
            aboutnta.style.top = e.point.y + 'px';
        }
    });

    map.on('mouseleave', 'nta-fill', () => {
        if (hoveredPolygonId !== null) {
            map.setFeatureState(
                { source: 'nta2', id: hoveredPolygonId },
                { hover: false }
            );
        }
        hoveredPolygonId = null;

        //Hide hover
        const aboutnta = document.getElementById("aboutnta");
        aboutnta.style.display = "none";
    });


    //toggle visibility of median household income
    let ntaVisible = true

    $('#median-income').on('click', function () {
        let value = 'visible'
        if (ntaVisible === true) {
            value = 'none'
        }
        map.setLayoutProperty('nta-fill', 'visibility', value)

        ntaVisible = !ntaVisible;
    });

    //add in fresh zoning boundaries - fill and outline
    map.addSource('fresh', {
        type: 'geojson',
        data: 'data/fresh.geojson',
        generateId: true
    });
    // map.addLayer({
    //     id: 'fresh-fill',
    //     type: 'fill',
    //     source: 'fresh',
    //     paint: {
    //         'fill-color': '#E8E8E8',
    //         'fill-opacity': 0.50,
    //     }
    // });
    map.addLayer({
        id: 'fresh-line',
        type: 'line',
        source: 'fresh',
        paint: {
            'line-color': '#212121',
            'line-width': 4,
        }
    });

    //make fresh layers initially invisible to be turned on by buttons
    map.setLayoutProperty('fresh-fill', 'visibility', 'none');
    map.setLayoutProperty('fresh-line', 'visibility', 'none');

    let freshVisible = true;

    $('#fresh-button').on('click', function () {
        let value = 'visible'
        if (freshVisible === true) {
            value = 'none';
        }
        map.setLayoutProperty('fresh-line', 'visibility', value)
        map.setLayoutProperty('fresh-fill', 'visibility', value)

        freshVisible = !freshVisible
    });
});