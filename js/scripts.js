//Setting up Mapbox

mapboxgl.accessToken = 'pk.eyJ1IjoiZWtzMjA4MCIsImEiOiJjbHVsdWNmbTExNGg0MmtsZHVlOHN2Zzd5In0.wEYw-sKV39S4NkqO8CDQBw';


var mapOptions = {
    container: 'map-container', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: [-74.00011310930516, 40.72415607434748], // starting position [lng, lat]
    zoom: 10.5, // starting zoom,
}

// instantiate the map
const map = new mapboxgl.Map(mapOptions);


// add a navitation control
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

// loop over the grocery store script to make a marker for each record
grocerystores.forEach(function (grocerystoresRecord) {

    var color

    // use if statements to assign colors based on borough

    if (grocerystoresRecord.borough === 'Manhattan') {
        color = '#9932CC'
    }
    if (grocerystoresRecord.borough === 'Queens') {
        color = '#556B2F'
    }
    if (grocerystoresRecord.borough === 'Bronx') {
        color = '#483D8B'
    }
    if (grocerystoresRecord.borough === 'Brooklyn') {
        color = '#E9967A'
    }
    if (grocerystoresRecord.borough === 'Staten Island') {
        color = '#E9967A'
    }
    // create a popup to attach to the marker

    const popup = new mapboxgl.Popup({
        offset: 24,
        anchor: 'bottom'
    }).setHTML(
        `<strong>${grocerystoresRecord.name}</strong> is located on <strong>${grocerystoresRecord.address}</strong> in <strong>${grocerystoresRecord.neighborhood}</strong>. This median household income for this area is <strong> fix this </strong>.`
    );

    // create a marker, set the coordinates, add the popup, add it to the map
    new mapboxgl.Marker({
        scale: 0.75,
        color: color,
    })
        .setLngLat([grocerystoresRecord.longitude, grocerystoresRecord.latitude])
        .setPopup(popup)
        .addTo(map);
})

map.on('load', function () {

    /*     // add a geojson source for the borough boundaries
        map.addSource('borough-boundaries', {
            type: 'geojson',
            data: 'data/borough-boundaries-simplified.geojson',
            generateId: true // this will add an id to each feature, this is necessary if we want to use featureState (see below)
        }) */

    // not sure if using this yet; first add the fill layer, using a match expression to give each a unique color based on its boro_code property
    //     map.addLayer({
    //         id: 'borough-boundaries-fill',
    //         type: 'fill',
    //         source: 'borough-boundaries',
    //         paint: {
    //             'fill-color': [
    //                 'match',
    //                 ['get', 'boro_code'],
    //                 '1',
    //                 '#f4cae4',
    //                 '2',
    //                 '#cbd5e8',
    //                 '3',
    //                 '#fdcdac',
    //                 '4',
    //                 '#b3e2cd',
    //                 /*                 '5',
    //                                 '#e6f5c9', */
    //                 '#ccc'
    //             ],
    //             // use a case expression to set the opacity of a polygon based on featureState
    //             'fill-opacity': [
    //                 'case',
    //                 ['boolean', ['feature-state', 'hover'], false],
    //                 1,  // opacity when hover is false
    //                 0.5 // opacity when hover is true
    //             ]
    //         }
    //     })
    //     // add borough outlines after the fill layer, so the outline is "on top" of the fill
    //     map.addLayer({
    //         id: 'borough-boundaries-line',
    //         type: 'line',
    //         source: 'borough-boundaries',
    //         paint: {
    //             'line-color': '#6b6b6b',
    //         }
})

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