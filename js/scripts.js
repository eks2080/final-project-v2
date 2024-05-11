//to do list - add fresh zoning boundaries to map, create toggles for everything, fix flyto instructions

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
        `<strong>${grocerystoresRecord.name}</strong> is located on <strong>${grocerystoresRecord.address}</strong> in <strong>${grocerystoresRecord.neighborhood}</strong>. This median household income for this area is <strong> fix this </strong>.`
    );

    // create the marker, set the coordinates, add the popup, add it to the map
    new mapboxgl.Marker({
        scale: 0.50,
        color: color,
    })
        .setLngLat([grocerystoresRecord.longitude, grocerystoresRecord.latitude])
        .setPopup(popup)
        .addTo(map);
})

map.on('load', function () {

    // add a geojson of NTA boundaries
    map.addSource('nta2', {
        type: 'geojson',
        data: 'data/nta2.geojson',
        generateId: true
    })
    // fill NTA boundaries based on median household income 
        map.addLayer({
        id: 'nta-fill',
        type: 'fill',
        source: 'nta2',
        paint: {
            'fill-color': [
                'step',
                ['get', 'medincomecsv_medincome2'],
                '#f4cae4',  // Colors
                20000, '#f4cae4',  // Lower bound 0 - 20,000
                40000, '#cbd5e8',  // Lower bound 20,001 - 40,000
                60000, '#fdcdac',  // Lower bound 40,001 - 60,000
                80000, '#b3e2cd',  // Lower bound 60,000 - 80,000
                100000, '#e6f5c9', // Lower bound 80,001 - 100,000
                500000, '#e6f5c9'  // Lower bound 100,001 - 500,000
            ],
            'fill-opacity': 0.75
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
    //add in fresh zoning boundaries - fill and outlines

    // //toggle median household income
    //     $('#income-button').on('click', function () {
    //         let value = 'visible'

    //         if (incomeVisible === true) {
    //             value = 'none'
    //         }

    //      // use setLayoutProperty to apply the visibility (either 'visible' or 'none' depending on the logic above)
    //      map.setLayoutProperty('nta-fill', 'visibility', value)
    //      map.setLayoutProperty('nta-line', 'visibility', value)

    //      // flip the value in boroughsVisible to reflect the new state. (if true, it becomes false, if false it becomes true)
    //      ntaVisible = !ntaVisible
    //  })

    // click on a button and use flyTo to go to that borough. needs to be adjusted, re assignment 4 notes
    $('#queens-button').on('click', function () {
        map.flyTo({
            center: [-73.89387763569168, 40.73104567408716],
            zoom: 11,
            duration: 1500
        })
    })
    $('#manhattan-button').on('click', function () {
        map.flyTo({
            center: [-73.97369874032192, 40.77132321682226],
            zoom: 11,
            duration: 1500
        })
    })
    $('#bronx-button').on('click', function () {
        map.flyTo({
            center: [-73.91579103266682, 40.81437684228872],
            zoom: 11,
            duration: 1500
        })
    })

    $('#brooklyn-button').on('click', function () {
        map.flyTo({
            center: [-73.95743869447674, 40.644049824373106],
            zoom: 11,
            duration: 1500
        })
    })

    $('#staten-island-button').on('click', function () {
        map.flyTo({
            center: [-73.95743869447674, 40.644049824373106],
            zoom: 11,
            duration: 1500
        })
    })
})