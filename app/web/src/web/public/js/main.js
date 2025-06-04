Promise.all([
    fetch('/geojson/gadm41_UKR_1.json').then(res => res.json()), // області
    fetch('/geojson/gadm41_UKR_2.json').then(res => res.json())  // райони
]).then(([oblastsData, districtsData]) => {
    const container = document.getElementById('map-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select("#map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Оптимальна проекція для України
    const projection = d3.geoMercator()
        .center([31.1656, 48.3794])
        .scale(Math.min(width, height) * 4.5) // Збільшений масштаб
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Відображення районів
    svg.selectAll("path.region")
        .data(districtsData.features)
        .enter()
        .append("path")
        .attr("class", "region")
        .attr("d", path);

    // Контури областей
    svg.selectAll("path.oblast-border")
        .data(oblastsData.features)
        .enter()
        .append("path")
        .attr("class", "oblast-border")
        .attr("d", path);

    // Розрахунок позицій для підписів областей
    const oblasts = {};
    districtsData.features.forEach(feature => {
        const oblastName = feature.properties.NAME_1;
        if (!oblasts[oblastName]) {
            oblasts[oblastName] = {
                count: 1,
                centroid: path.centroid(feature)
            };
        } else {
            oblasts[oblastName].count++;
            oblasts[oblastName].centroid[0] += path.centroid(feature)[0];
            oblasts[oblastName].centroid[1] += path.centroid(feature)[1];
        }
    });

    // Нормалізація позицій
    Object.keys(oblasts).forEach(oblast => {
        oblasts[oblast].centroid[0] /= oblasts[oblast].count;
        oblasts[oblast].centroid[1] /= oblasts[oblast].count;
    });

    // Додавання підписів областей
    svg.selectAll("text.oblast-label")
        .data(Object.keys(oblasts))
        .enter()
        .append("text")
        .attr("class", "oblast-label")
        .attr("x", d => oblasts[d].centroid[0])
        .attr("y", d => oblasts[d].centroid[1])
        .text(d => d);

    // Адаптація до зміни розміру вікна
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        
        svg.attr("width", newWidth)
            .attr("height", newHeight);
        
        projection.scale(Math.min(newWidth, newHeight) * 4.5)
                    .translate([newWidth / 2, newHeight / 2]);
        
        svg.selectAll("path").attr("d", path);
        svg.selectAll("text.oblast-label")
            .attr("x", d => oblasts[d].centroid[0])
            .attr("y", d => oblasts[d].centroid[1]);
    });
}).catch(error => {
    console.error("Помилка завантаження даних:", error);
    document.getElementById('map').innerHTML = 
        '<div style="color:red;text-align:center;padding-top:300px">Помилка завантаження картографічних даних</div>';
});





function load_chat() {
    $.ajax({
        url: "/get_chats_post",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(null),
        success: function (response) {
            console.log(response)
        }
    });
}
