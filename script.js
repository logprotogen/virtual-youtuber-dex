console.log("script loaded");

/* ===== 샘플 데이터 ===== */
const sampleVtuber = {
  id: "1111-2222-3333",
  name: "아오하 루미",
  agency: "개인",
  gender: "여성",
  species: "수인 (여우)",
  birthday: "2001-05-14",
  debut_date: "2023-04-01",
  fan_name: "루미네",
  oshi_mark: "🦊✨",
  status: "활동중",
  image_url: "https://placehold.co/400x400?text=VTuber",

  vtuber_creators: [
    { role: "design", name: "디자이너A", twitter_url: "https://x.com/designerA" },
    { role: "live2d", name: "리깅B", twitter_url: "https://x.com/riggerB" }
  ],

  vtuber_links: [
    { type: "youtube", label: "YouTube 본채널", url: "https://youtube.com/@aoharumi" },
    { type: "chzzk", label: "치지직", url: "https://chzzk.naver.com/aoharumi" },
    { type: "twitter", label: "X", url: "https://x.com/aoharumi" }
  ]
};

/* ===== DOM ===== */
const cardGrid = document.querySelector(".card-grid");
const modal = document.getElementById("detail-modal");

/* ===== 유틸 ===== */
function daysSince(date) {
  if (!date) return "-";
  return Math.floor((Date.now() - new Date(date)) / 86400000);
}

function calcAge(birthday) {
  if (!birthday) return "-";
  const b = new Date(birthday);
  const t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  if (
    t.getMonth() < b.getMonth() ||
    (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())
  ) age--;
  return age;
}

/* ===== 카드 ===== */
function createCard(v) {
  const article = document.createElement("article");
  article.className = "vtuber-card";

  article.innerHTML = `
    <img src="${v.image_url}" alt="">
    <h4>${v.name}</h4>
    <p>${v.species} · ${v.gender}</p>
    <p>데뷔 D+${daysSince(v.debut_date)}</p>
    <button class="detail-btn">상세 보기</button>
  `;

  article.querySelector(".detail-btn").addEventListener("click", () => {
    openModal(v);
  });

  return article;
}

/* ===== 모달 ===== */
function openModal(v) {
  document.getElementById("modal-name").textContent = v.name;
  document.getElementById("modal-avatar").src = v.image_url;
  document.getElementById("modal-gender").textContent = v.gender;
  document.getElementById("modal-birthday").textContent = v.birthday;
  document.getElementById("modal-age").textContent = calcAge(v.birthday);
  document.getElementById("modal-species").textContent = v.species;
  document.getElementById("modal-fanname").textContent = v.fan_name;
  document.getElementById("modal-oshi").textContent = v.oshi_mark;
  document.getElementById("modal-debut").textContent =
    `${v.debut_date} (D+${daysSince(v.debut_date)})`;

  const creators = document.getElementById("modal-creators");
  creators.innerHTML = "";
  v.vtuber_creators.forEach(c => {
    creators.innerHTML += `<li>${c.role}: <a href="${c.twitter_url}" target="_blank">${c.name}</a></li>`;
  });

  const links = document.getElementById("modal-links");
  links.innerHTML = "";
  v.vtuber_links.forEach(l => {
    links.innerHTML += `<li><strong>${l.label}</strong>: <a href="${l.url}" target="_blank">${l.url}</a></li>`;
  });

  modal.classList.remove("hidden");
}

/* ===== 닫기 ===== */
document.querySelector(".modal-close").onclick =
document.querySelector(".modal-overlay").onclick =
  () => modal.classList.add("hidden");

/* ===== 초기 렌더 ===== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");
  cardGrid.innerHTML = "";
  cardGrid.appendChild(createCard(sampleVtuber));
});
