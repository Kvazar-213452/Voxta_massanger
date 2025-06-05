function initMap() {
    fetch('/geojson/gadm41_UKR_1.json')
        .then(res => res.json())
        .then(oblastsData => {
            const container = document.getElementById('map-container');
            const width = container.clientWidth;
            const height = container.clientHeight;

            const svg = d3.select("#map")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            const projection = d3.geoMercator()
                .center([31.1656, 48.3794])
                .scale(Math.min(width, height) * 4.5)
                .translate([width / 2, height / 2]);

            const path = d3.geoPath().projection(projection);

            // Додаємо властивості ID та type до кожної області
            oblastsData.features.forEach(feature => {
                const oblastName = feature.properties.NAME_1;
                const oblastId = getOblastId(oblastName);
                feature.properties.id = oblastId;
                feature.properties.type = "oblast";
            });

            // Малюємо області
            svg.selectAll("path.oblast-border")
                .data(oblastsData.features)
                .enter()
                .append("path")
                .attr("class", "oblast-border")
                .attr("d", path)
                .attr("data-id", d => d.properties.id)
                .attr("data-type", d => d.properties.type)
                .attr("fill", "#ccc")
                .attr("stroke", "#333")
                .attr("stroke-width", 1);

            // Центроїди для підписів
            const oblastCentroids = {};
            oblastsData.features.forEach(feature => {
                const oblastName = feature.properties.NAME_1;
                oblastCentroids[oblastName] = path.centroid(feature);
            });

            // Підписи
            svg.selectAll("text.oblast-label")
                .data(oblastsData.features)
                .enter()
                .append("text")
                .attr("class", "oblast-label")
                .attr("x", d => oblastCentroids[d.properties.NAME_1][0])
                .attr("y", d => oblastCentroids[d.properties.NAME_1][1])
                .text(d => d.properties.NAME_1)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("fill", "#333")
                .attr("font-weight", "bold");

            // Адаптація до зміни розміру
            window.addEventListener('resize', () => {
                const newWidth = container.clientWidth;
                const newHeight = container.clientHeight;

                svg.attr("width", newWidth)
                    .attr("height", newHeight);

                projection.scale(Math.min(newWidth, newHeight) * 4.5)
                    .translate([newWidth / 2, newHeight / 2]);

                svg.selectAll("path").attr("d", path);

                oblastsData.features.forEach(feature => {
                    const oblastName = feature.properties.NAME_1;
                    oblastCentroids[oblastName] = path.centroid(feature);
                });

                svg.selectAll("text.oblast-label")
                    .attr("x", d => oblastCentroids[d.properties.NAME_1][0])
                    .attr("y", d => oblastCentroids[d.properties.NAME_1][1]);
            });
        })
        .catch(error => {
            console.error("Помилка завантаження даних:", error);
            document.getElementById('map').innerHTML =
                '<div style="color:red;text-align:center;padding-top:300px">Помилка завантаження картографічних даних</div>';
        });
}

// Функція отримання ID області за назвою
function getOblastId(name) {
    const mapping = {
        "Хмельницька": 3,
        "Вінницька": 4,
        "Рівненська": 5,
        "Волинська": 8,
        "Дніпропетровська": 9,
        "Житомирська": 10,
        "Закарпатська": 11,
        "Запорізька": 12,
        "Івано-Франківська": 13,
        "Київська": 14,
        "Кіровоградська": 15,
        "Луганська": 16,
        "Миколаївська": 17,
        "Одеська": 18,
        "Полтавська": 19,
        "Сумська": 20,
        "Тернопільська": 21,
        "Харківська": 22,
        "Херсонська": 23,
        "Черкаська": 24,
        "Чернігівська": 25,
        "Чернівецька": 26,
        "Львівська": 27,
        "Донецька": 28,
        "Автономна Республіка Крим": 29,
        "м. Севастополь": 30,
        "м. Київ": 31
    };
    return mapping[name] || null;
}


function highlightOblastById(id) {
    // Знімаємо попереднє виділення
    $(".oblast-border").removeClass("oblast-highlighted");
    // Виділяємо потрібну область
    $(`.oblast-border[data-id='${id}']`).addClass("oblast-highlighted");
}