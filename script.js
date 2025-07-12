const starData = [
  { temp: 30000, mag: -5.5, type: "주계열성", name: "알니탁" },
  { temp: 25000, mag: -4, type: "주계열성", name: "스피카" },
  { temp: 9600, mag: 1.4, type: "주계열성", name: "시리우스 A" },
  { temp: 7500, mag: 2.7, type: "주계열성", name: "프로키온 A" },
  { temp: 5778, mag: 4.83, type: "주계열성", name: "태양" },
  { temp: 4000, mag: 8.5, type: "주계열성", name: "프로xima 센타우리" },
  { temp: 3500, mag: 10, type: "주계열성", name: "TRAPPIST-1" },
  { temp: 11000, mag: 0.03, type: "주계열성", name: "알타이르" },
  { temp: 6500, mag: 3.5, type: "주계열성" },
  { temp: 8000, mag: 2.0, type: "주계열성" },
  { temp: 5000, mag: 5.5, type: "주계열성" },
  { temp: 20000, mag: -3, type: "주계열성" },
  { temp: 15000, mag: -1, type: "주계열성" },
  { temp: 5500, mag: 5.0, type: "주계열성" },

  { temp: 4800, mag: -0.5, type: "거성", name: "알데바란" },
  { temp: 3500, mag: -5.85, type: "거성", name: "베텔게우스" },
  { temp: 4300, mag: -2.5, type: "거성" },
  { temp: 3200, mag: -5, type: "거성", name: "안타레스" },
  { temp: 5000, mag: 0, type: "거성" },
  { temp: 4500, mag: -1, type: "거성" },

  { temp: 8200, mag: 11.3, type: "백색왜성", name: "시리우스 B" },
  { temp: 14000, mag: 12.4, type: "백색왜성" },
  { temp: 25000, mag: 10, type: "백색왜성" },
  { temp: 7000, mag: 13, type: "백색왜성" },
  { temp: 10000, mag: 11.5, type: "백색왜성" },
  { temp: 6000, mag: 14, type: "백색왜성" }
];

const evolutionPaths = {
  sun: {
    title: "🌞 태양 같은 별의 일생",
    text:
      "주계열성 단계에서 대부분의 삶을 보낸 후, 부풀어 올라 적색거성이 됩니다. 외부층은 행성상 성운으로 흩어지고, 중심핵은 뜨겁고 작은 백색왜성으로 남아 서서히 식어갑니다.",
    data: [
      { temp: 5800, mag: 4.8 },
      { temp: 3500, mag: -0.5 },
      { temp: 15000, mag: 11 }
    ]
  },
  massive: {
    title: "💥 무거운 별의 일생",
    text:
      "매우 뜨겁고 밝은 청색 주계열성으로 시작해 짧고 굵은 삶을 삽니다. 이후 적색초거성으로 급격히 팽창한 뒤, 초신성 폭발이라는 화려한 최후를 맞이합니다. 그 후 중성자별이나 블랙홀이 됩니다.",
    data: [
      { temp: 30000, mag: -5 },
      { temp: 4000, mag: -6 }
    ]
  }
};

let hrChart;
let visibleTypes = ["주계열성", "거성", "백색왜성"];

const typeColors = {
  주계열성: "rgba(99, 102, 241, 0.8)",
  거성: "rgba(245, 158, 11, 0.8)",
  백색왜성: "rgba(156, 163, 175, 0.8)"
};

function createChart() {
  const ctx = document.getElementById("hrDiagram").getContext("2d");

  const datasets = Object.keys(typeColors).map((type) => {
    return {
      label: type,
      data: starData
        .filter((star) => star.type === type)
        .map((star) => ({
          x: star.temp,
          y: star.mag,
          name: star.name || "별"
        })),
      backgroundColor: typeColors[type],
      pointRadius: 6,
      pointHoverRadius: 9
    };
  });

  hrChart = new Chart(ctx, {
    type: "scatter",
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "logarithmic",
          reverse: true,
          title: {
            display: true,
            text: "표면 온도 (K)",
            font: { size: 14 },
            color: "#d1d5db"
          },
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(255, 255, 255, 0.1)" }
        },
        y: {
          reverse: true,
          title: {
            display: true,
            text: "절대 등급 (광도)",
            font: { size: 14 },
            color: "#d1d5db"
          },
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(255, 255, 255, 0.1)" }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              const d = context.raw;
              return `${
                d.name || context.dataset.label
              }: (온도: ${d.x.toLocaleString()} K, 등급: ${d.y})`;
            }
          }
        },
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: "xy"
          },
          pan: {
            enabled: true,
            mode: "xy"
          }
        }
      }
    }
  });
}

function updateChart() {
  hrChart.data.datasets.forEach((dataset) => {
    dataset.hidden = !visibleTypes.includes(dataset.label);
  });
  hrChart.update();
}

function toggleStarType(type) {
  const index = visibleTypes.indexOf(type);
  const btn = document.querySelector(`.filter-btn[data-type="${type}"]`);
  if (index > -1) {
    visibleTypes.splice(index, 1);
    btn.classList.remove("active");
    btn.style.opacity = "0.5";
  } else {
    visibleTypes.push(type);
    btn.classList.add("active");
    btn.style.opacity = "1";
  }
  showEvolutionPath("reset");
  updateChart();
}

function resetFilters() {
  visibleTypes = ["주계열성", "거성", "백색왜성"];
  document.querySelectorAll(".filter-btn[data-type]").forEach((btn) => {
    btn.classList.add("active");
    btn.style.opacity = "1";
  });
  showEvolutionPath("reset");
  updateChart();
}

function showEvolutionPath(type) {
  // Remove previous path if exists
  const existingPathIndex = hrChart.data.datasets.findIndex(
    (ds) => ds.label === "evolution_path"
  );
  if (existingPathIndex > -1) {
    hrChart.data.datasets.splice(existingPathIndex, 1);
  }

  const titleEl = document.getElementById("evolution-title");
  const textEl = document.getElementById("evolution-text");

  if (type === "reset") {
    titleEl.textContent = "별의 진화 경로";
    textEl.textContent =
      "궁금한 별의 종류를 선택하면 이곳에 진화 과정에 대한 설명이 나타납니다.";
    hrChart.update();
    return;
  }

  const pathInfo = evolutionPaths[type];
  titleEl.textContent = pathInfo.title;
  textEl.textContent = pathInfo.text;

  const pathDataset = {
    type: "line",
    label: "evolution_path",
    data: pathInfo.data.map((p) => ({ x: p.temp, y: p.mag })),
    borderColor: "#14b8a6",
    borderWidth: 3,
    fill: false,
    tension: 0.1,
    pointRadius: 0,
    borderDash: [5, 5]
  };

  hrChart.data.datasets.push(pathDataset);
  hrChart.update();
}

window.onload = function () {
  createChart();
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth"
      });
    });
  });
};