console.log("script loaded");

/* ===== Supabase 설정 ===== */
const SUPABASE_URL = "https://ikzvfqibdsrbljooiinf.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrenZmcWliZHNyYmxqb29paW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MDE1MDEsImV4cCI6MjA4Mjk3NzUwMX0.h8SlHAgPqY20QjlZoWfZheAGu9jpGqHpZaL9nwqX86c"; // 여기 교체해야 함

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

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = text ? text : "-";
  }
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

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) {
    // 텍스트가 없으면 "-" 표시
    el.textContent =
      text !== null && text !== undefined && text !== "" ? text : "-";
  }
}

// ✅ URL에서 호스트명 추출 (툴팁에 “youtube.com” 같은 걸 보여주기 위함)
function getHostname(url) {
  try {
    const host = new URL(url).hostname;
    return host.replace(/^www\./, "");
  } catch (e) {
    return "";
  }
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
/* ===== 상세 모달 ===== */
function openModal(v) {
  setText("modal-name", v.name);
  setText("modal-gender", v.gender);
  setText("modal-birthday", v.birthday);

  const age = calcAge(v.birthday);
  setText("modal-age", age ? age + "세" : "-");

  setText("modal-species", v.species);
  setText("modal-fanname", v.fan_name);
  setText("modal-oshi", v.oshi_mark);

  setText(
    "modal-debut",
    v.debut_date ? `${v.debut_date} (D+${daysSince(v.debut_date)})` : "-"
  );

  /* 제작자 정보 */
  const creators = document.getElementById("modal-creators");
  if (creators) {
    creators.innerHTML = "";
    if (!v.vtuber_creators || v.vtuber_creators.length === 0) {
      creators.innerHTML = "<li>정보 없음</li>";
    } else {
      v.vtuber_creators.forEach((c) => {
        const li = document.createElement("li");
        li.innerHTML = `${c.role}: <a href="${
          c.twitter_url || "#"
        }" target="_blank" rel="noopener noreferrer">${c.name}</a>`;
        creators.appendChild(li);
      });
    }
  }

  /* ⬇️ 링크 정보 (아이콘 + hover 툴팁용 data-site) ⬇️ */
  const linksContainer = document.getElementById("modal-links");
  if (linksContainer) {
    linksContainer.innerHTML = ""; // 초기화

    if (!v.vtuber_links || v.vtuber_links.length === 0) {
      linksContainer.innerHTML = "<p>정보 없음</p>";
    } else {
      v.vtuber_links.forEach((l) => {
        const labelText = (l?.label ?? "링크").toString();
        const labelLower = labelText.toLowerCase();
        let iconClass = "fas fa-link"; // 기본 아이콘 (사슬 모양)

        // 레이블에 따라 아이콘 클래스 매핑
        if (labelLower.includes("youtube") || labelLower.includes("유튜브"))
          iconClass = "fab fa-youtube";
        else if (
          labelLower.includes("twitter") ||
          labelLower.includes("트위터") ||
          labelLower === "x"
        )
          iconClass = "fab fa-x-twitter";
        else if (labelLower.includes("twitch") || labelLower.includes("트위치"))
          iconClass = "fab fa-twitch";
        else if (
          labelLower.includes("instagram") ||
          labelLower.includes("인스타")
        )
          iconClass = "fab fa-instagram";
        else if (labelLower.includes("tiktok") || labelLower.includes("틱톡"))
          iconClass = "fab fa-tiktok";
        else if (labelLower.includes("cafe") || labelLower.includes("카페"))
          iconClass = "fas fa-coffee";
        else if (labelLower.includes("치지직"))
          iconClass = "fas fa-bolt"; // 치지직은 번개 아이콘으로 대체
        else if (
          labelLower.includes("spotify") ||
          labelLower.includes("스포티파이")
        )
          iconClass = "fab fa-spotify";
        else if (
          labelLower.includes("apple music") ||
          labelLower.includes("애플뮤직")
        )
          iconClass = "fab fa-apple";
        else if (
          labelLower.includes("soundcloud") ||
          labelLower.includes("사운드클라우드")
        )
          iconClass = "fab fa-soundcloud";
        // 필요하면 여기에 더 추가하세요! (예: melon, genie 등은 기본 아이콘 사용)

        const a = document.createElement("a");
        a.href = l?.url || "#";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "link-icon";

        // ✅ 툴팁 텍스트: "라벨 · 도메인" 형태
        const host = getHostname(a.href);
        const tooltip = host ? `${labelText} · ${host}` : labelText;

        // ✅ CSS의 ::after { content: attr(data-site); } 로 표시됨
        a.dataset.site = tooltip;

        // 브라우저 기본 title 툴팁은 겹치면 보기 싫어서 제거(원하면 켜도 됨)
        // a.title = tooltip;

        // 접근성(키보드/스크린리더)
        a.setAttribute("aria-label", tooltip);

        a.innerHTML = `<i class="${iconClass}"></i>`;

        linksContainer.appendChild(a);
      });
    }
  }

  // 아바타 이미지 설정 (없으면 기본 이미지나 숨김 처리)
  const avatar = document.getElementById("modal-avatar");
  if (avatar) {
    avatar.src = v.image_url || ""; // 이미지가 없으면 빈 값
    avatar.alt = `${v.name} 아바타`;
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

    data.forEach((v) => {
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




