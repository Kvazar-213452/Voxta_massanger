const swiper = new Swiper('.mySwiper', {
  loop: false,
  effect: 'fade',
  fadeEffect: { crossFade: true },
  allowTouchMove: false,
  // autoHeight: false, // Вимкнути авто-висоту!
  navigation: false,
  pagination: false,
  on: {
    init: function() {
      // Ініціалізувати карту тільки для першого слайда
      if(this.activeIndex === 0) {
        initMap();
      }
    },
    slideChange: function() {
      // При зміні слайда перераховуємо карту
      if(this.activeIndex === 0) {
        setTimeout(initMap, 300); // Чекаємо завершення анімації
      }
    }
  }
});

function initMap() {
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
}

// Викликати initMap() при завантаженні, якщо перший слайд активний
document.addEventListener('DOMContentLoaded', function() {
  if(document.querySelector('.swiper-slide-active')?.contains(document.getElementById('map-container'))) {
    initMap();
    document.querySelector('.menu_item[data-slide="0"]').classList.add('active');
  }
});

document.querySelectorAll('.menu_item').forEach(item => {
  item.addEventListener('click', () => {
    // Видалити клас active з усіх елементів меню
    document.querySelectorAll('.menu_item').forEach(i => i.classList.remove('active'));
    
    // Додати клас active до поточного елементу
    item.classList.add('active');
    
    // Перейти до відповідного слайду
    const slideIndex = parseInt(item.getAttribute('data-slide'));
    swiper.slideTo(slideIndex);
  });
});

// Додаємо обробник зміни слайда, щоб оновлювати активний пункт меню
swiper.on('slideChange', function() {
  // Видалити клас active з усіх елементів
  document.querySelectorAll('.menu_item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Додати клас active до відповідного пункту меню
  const activeSlideIndex = swiper.activeIndex;
  document.querySelector(`.menu_item[data-slide="${activeSlideIndex}"]`).classList.add('active');
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

