const axios = require('axios');
const fs = require('fs');
const path = require('path');


// QldGlobe is using a proxy, probably this one:
// https://github.com/Esri/resource-proxy/blob/master/PHP/proxy.php

// Function to perform the GET request and save the response
async function fetchQGTile(basemap, z, x, y) {
    const proxy = "https://forward.qldglobe.information.qld.gov.au/proxy.php?";
    const map = `https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Basemaps/${basemap}/MapServer/tile/${z}/${x}/${y}?blankTile=false&browserCache=Map`;
    const url = proxy + map;

    try {
        const response = await axios.get(url, {
            headers: {
                "sec-ch-ua": "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "Referer": "https://qldglobe.information.qld.gov.au/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            responseType: 'arraybuffer' // Important for binary data like images
        });

        // Save the response to the filesystem
        const filePath = path.join(__dirname, 'mapTile.png');
        fs.writeFileSync(filePath, response.data);
        console.log(`File saved to ${filePath}`);
    } catch (error) {
        console.error('Error fetching or saving the map tile:', error.message);
    }
}

// Call the function
fetchQGTile("QldMap_Topo", "6", "34", "56");
fetchQGTile("QldMap_Topo", 11, 1136, 1860) // 11/1136/1860
