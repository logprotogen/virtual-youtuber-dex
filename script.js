console.log("script loaded");

/* ===== Supabase 설정 ===== */
const SUPABASE_URL = "https://ikzvfqibdsrbljooiinf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrenZmcWliZHNyYmxqb29paW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MDE1MDEsImV4cCI6MjA4Mjk3NzUwMX0.h8SlHAgPqY20QjlZoWfZheAGu9jpGqHpZaL9nwqX86c"; // 여기 교체해야 함

/* HEADERS */
const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

/* ===== DOM ===== */
const cardGrid = document.querySelector(".card-grid");
const modal = document.getElementById("detail-modal");

/* ===== 유틸 함수 ===== */
function daysSince(date) {
  if (!date) return "-";
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d) / (1000 * 60 * 60 * 24));
  return diff;
}

function calcAge(birthday) {
  if (!birthday) return "-";
  const b = new Date(birthday);
  const t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  if (
    t.getMonth() < b.getMonth() ||
    (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())
  )
    age--;
  return age;
}

/* ===== 카드 생성 ===== */
function createCard(v) {
  const article = document.createElement("article");
  article.className = "vtuber-card";

  /* 썸네일 */
  article.innerHTML = `
    <img src="${v.image_url || ""}" alt="버츄얼 유튜버">
    <h4>${v.name}</h4>
    <p>${v.species || "-"} · ${v.gender || "-"}</p>
    <p>데뷔 D+${daysSince(v.debut_date)}</p>
    <button class="detail-btn">상세 보기</button>
  `;

  article.querySelector(".detail-btn").addEventListener("click", () => {
    openModal(v);
  });

  return article;
}

/* ===== 상세 모달 ===== */
function openModal(v) {
  setText("modal-name", v.name);
  setText("modal-gender", v.gender);
  setText("modal-birthday", v.birthday);
  setText("modal-age", v.age_text);
  setText("modal-species", v.species);
  setText("modal-fanname", v.fan_name);
  setText("modal-oshi", v.oshi_mark);

  setText(
    "modal-debut",
    v.debut_date
      ? `${v.debut_date} (D+${daysSince(v.debut_date)})`
      : "-"
  );

  const creators = document.getElementById("modal-creators");
  if (creators) {
    creators.innerHTML = "";
    (v.vtuber_creators || []).forEach(c => {
      const li = document.createElement("li");
      li.innerHTML = `${c.role}: <a href="${c.twitter_url}" target="_blank">${c.name}</a>`;
      creators.appendChild(li);
    });
  }

  const links = document.getElementById("modal-links");
  if (links) {
    links.innerHTML = "";
    (v.vtuber_links || []).forEach(l => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${l.url}" target="_blank">${l.label}</a>`;
      links.appendChild(li);
    });
  }

  document.getElementById("detail-modal").classList.remove("hidden");
}

/* ===== 모달 닫기 ===== */
document.querySelector(".modal-close").onclick =
document.querySelector(".modal-overlay").onclick =
  () => modal.classList.add("hidden");

/* ===== Supabase → 카드 렌더 ===== */
async function loadVtubers() {
  try {
    console.log("Supabase 데이터 로딩 시작");

    /* REST API를 통한 Join fetch */
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/vtubers?select=*,vtuber_links(*),vtuber_creators(*)`,
      { headers }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Supabase 오류", res.status, text);
      return;
    }

    const data = await res.json();
    console.log("불러온 VTuber 수:", data.length, data);

    cardGrid.innerHTML = "";
    if (data.length === 0) {
      cardGrid.innerHTML = "<p>등록된 버츄얼 유튜버가 없습니다.</p>";
      return;
    }

    data.forEach(v => {
      cardGrid.appendChild(createCard(v));
    });

  } catch (err) {
    console.error("Supabase fetch 실패", err);
  }
}

/* ===== 초기 실행 ===== */
document.addEventListener("DOMContentLoaded", () => {
  loadVtubers();
});

