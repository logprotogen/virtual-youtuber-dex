console.log("script loaded");

/* ===== Supabase 설정 ===== */
const SUPABASE_URL = "https://ikzvfqibdsrbljooiinf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrenZmcWliZHNyYmxqb29paW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MDE1MDEsImV4cCI6MjA4Mjk3NzUwMX0.h8SlHAgPqY20QjlZoWfZheAGu9jpGqHpZaL9nwqX86c";
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
  ) {
    age--;
  }
  return age;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent =
    text !== null && text !== undefined && text !== "" ? text : "-";
}

function getHostname(url) {
  try {
    const host = new URL(url).hostname;
    return host.replace(/^www\./, "");
  } catch (e) {
    return "";
  }
}

function getIconClass(labelText) {
  const t = (labelText || "").toString().trim().toLowerCase();

  if (t.includes("youtube") || t.includes("유튜브")) return "fab fa-youtube";
  if (t === "x" || t.includes("twitter") || t.includes("트위터"))
    return "fab fa-x-twitter";
  if (t.includes("twitch") || t.includes("트위치")) return "fab fa-twitch";
  if (t.includes("instagram") || t.includes("인스타")) return "fab fa-instagram";
  if (t.includes("tiktok") || t.includes("틱톡")) return "fab fa-tiktok";
  if (t.includes("spotify") || t.includes("스포티파이")) return "fab fa-spotify";
  if (t.includes("apple music") || t.includes("애플뮤직")) return "fab fa-apple";
  if (t.includes("soundcloud") || t.includes("사운드클라우드"))
    return "fab fa-soundcloud";
  if (t.includes("cafe") || t.includes("카페")) return "fas fa-coffee";
  if (t.includes("치지직")) return "fas fa-bolt";

  return "fas fa-link";
}

/* ===== 카드 생성 ===== */
function createCard(v) {
  const article = document.createElement("article");
  article.className = "vtuber-card";

  article.innerHTML = `
    <img src="${v.image_url || ""}" alt="버츄얼 유튜버">
    <h4>${v.name || "-"}</h4>
    <p>${v.species || "-"} · ${v.gender || "-"}</p>
    <p>데뷔 D+${daysSince(v.debut_date)}</p>
    <button class="detail-btn">상세 보기</button>
  `;

  article.querySelector(".detail-btn")?.addEventListener("click", () => {
    openModal(v);
  });

  return article;
}

/* ===== 상세 모달 ===== */
function openModal(v) {
  // 기본 정보
  setText("modal-name", v.name);
  setText("modal-gender", v.gender);
  setText("modal-birthday", v.birthday);

  const age = calcAge(v.birthday);
  setText("modal-age", age !== "-" ? `${age}세` : "-");

  setText("modal-species", v.species);
  setText("modal-fanname", v.fan_name);
  setText("modal-oshi", v.oshi_mark);

  setText(
    "modal-debut",
    v.debut_date ? `${v.debut_date} (D+${daysSince(v.debut_date)})` : "-"
  );

  // 제작자 정보
  const creators = document.getElementById("modal-creators");
  if (creators) {
    creators.innerHTML = "";
    const list = v.vtuber_creators || [];
    if (list.length === 0) {
      creators.innerHTML = "<li>정보 없음</li>";
    } else {
      list.forEach((c) => {
        const li = document.createElement("li");
        const name = c?.name || "제작자";
        const role = c?.role || "역할";
        const url = c?.twitter_url || "#";
        li.innerHTML = `${role}: <a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`;
        creators.appendChild(li);
      });
    }
  }

  // ✅ 링크 아이콘 + 아이콘 밑 작은 글씨(사이트명)
  const linksContainer = document.getElementById("modal-links");
  if (linksContainer) {
    linksContainer.innerHTML = "";
    const links = v.vtuber_links || [];

    if (links.length === 0) {
      linksContainer.innerHTML = "<p>정보 없음</p>";
    } else {
      links.forEach((l) => {
        const url = l?.url || "#";
        const labelText = (l?.label || "").toString().trim();
        const host = getHostname(url);

        // 캡션: 라벨이 있으면 라벨, 없으면 도메인
        const caption = labelText || host || "링크";
        const iconClass = getIconClass(labelText || host);

        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "link-icon";
        a.setAttribute("aria-label", caption);

        // (툴팁 CSS가 남아있어도 문제 없게 data-site도 채워둠)
        a.dataset.site = caption;

        a.innerHTML = `
          <span class="icon-bubble"><i class="${iconClass}"></i></span>
          <span class="link-caption">${caption}</span>
        `;

        linksContainer.appendChild(a);
      });
    }
  }

  // 아바타
  const avatar = document.getElementById("modal-avatar");
  if (avatar) {
    avatar.src = v.image_url || "";
    avatar.alt = `${v.name || "버츄얼 유튜버"} 아바타`;
  }

  // 모달 표시
  modal?.classList.remove("hidden");
}

/* ===== 모달 닫기 ===== */
document.querySelector(".modal-close")?.addEventListener("click", () => {
  modal?.classList.add("hidden");
});
document.querySelector(".modal-overlay")?.addEventListener("click", () => {
  modal?.classList.add("hidden");
});

/* ===== Supabase → 카드 렌더 ===== */
async function loadVtubers() {
  try {
    console.log("Supabase 데이터 로딩 시작");

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/vtubers?select=*,vtuber_links(*),vtuber_creators(*)`,
      { headers }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Supabase 오류", res.status, text);
      if (cardGrid) cardGrid.innerHTML = "<p>데이터 로딩 실패</p>";
      return;
    }

    const data = await res.json();
    console.log("불러온 VTuber 수:", data.length);

    if (!cardGrid) return;

    cardGrid.innerHTML = "";
    if (!data || data.length === 0) {
      cardGrid.innerHTML = "<p>등록된 버츄얼 유튜버가 없습니다.</p>";
      return;
    }

    data.forEach((v) => {
      cardGrid.appendChild(createCard(v));
    });
  } catch (err) {
    console.error("Supabase fetch 실패", err);
    if (cardGrid) cardGrid.innerHTML = "<p>데이터 로딩 실패</p>";
  }
}

/* ===== 초기 실행 ===== */
document.addEventListener("DOMContentLoaded", () => {
  loadVtubers();
});






