/* ============================================================================
   1. 상품 · 회원 등급 · 슬라이드 데이터
   ============================================================================ */
const PRODUCTS = [
  {
    id: 1,
    name: "출근길 20분 에세이 모음집",
    category: "큐레이션 전자책",
    price: 9800,
    stock: 99,
    img: "./img/prod1.png",
    summary: "지하철에서 가볍게 읽기 좋은 짧은 산문 28편을 모은 전자책"
  },
  {
    id: 2,
    name: "오늘의 완독 리딩패스",
    category: "오디오·리딩패스",
    price: 12900,
    stock: 50,
    img: "./img/prod2.png",
    summary: "베스트셀러 요약 노트와 몰입형 리딩 가이드를 묶은 월간 패스"
  },
  {
    id: 3,
    name: "조용한 집중 오디오북 팩",
    category: "오디오·리딩패스",
    price: 14500,
    stock: 40,
    img: "./img/prod3.png",
    summary: "산책과 퇴근길에 듣기 좋은 차분한 낭독 오디오 컬렉션"
  },
  {
    id: 4,
    name: "작은 습관이 만드는 하루",
    category: "단행본",
    price: 16800,
    stock: 25,
    img: "./img/prod4.png",
    summary: "대학생과 직장인의 루틴 정리를 돕는 실용 단행본"
  },
  {
    id: 5,
    name: "사색의 오후 인문 노트",
    category: "단행본",
    price: 18500,
    stock: 18,
    img: "./img/prod5.png",
    summary: "질문과 메모가 함께 담긴 미색 종이 인문 교양서"
  },
  {
    id: 6,
    name: "데이터로 읽는 비즈니스 트렌드",
    category: "큐레이션 전자책",
    price: 15000,
    stock: 80,
    img: "./img/prod6.png",
    summary: "실무 사례와 표를 한눈에 보는 디지털 큐레이션북"
  },
  {
    id: 7,
    name: "버터 옐로우 독서 기록 노트",
    category: "독서 굿즈",
    price: 8500,
    stock: 35,
    img: "./img/prod7.png",
    summary: "읽은 문장과 감상을 남기는 손바닥 크기 독서 로그북"
  },
  {
    id: 8,
    name: "베이지 패브릭 북마크 세트",
    category: "독서 굿즈",
    price: 7200,
    stock: 45,
    img: "./img/prod8.png",
    summary: "책장을 넘길 때마다 은은한 질감이 느껴지는 자수 책갈피 2종"
  }
];

const MEMBERSHIP_TIERS = [
  { grade: "WELCOME", level: 1, name: "새싹 독자", minSpent: 0, earnRate: 0.01, benefit: "신규 가입 3,000P 지급 · 구매액 1% 적립" },
  { grade: "SILVER", level: 2, name: "단골 독자", minSpent: 30000, earnRate: 0.03, benefit: "누적 3만원 이상 · 구매액 3% 적립" },
  { grade: "GOLD", level: 3, name: "큐레이터", minSpent: 70000, earnRate: 0.05, benefit: "누적 7만원 이상 · 구매액 5% 적립" },
  { grade: "VIP", level: 4, name: "북마스터", minSpent: 120000, earnRate: 0.07, benefit: "누적 12만원 이상 · 구매액 7% 적립" }
];

const HERO_SLIDES = [
  {
    img: "./img/slide1.jpg",
    tag: "MILLIE STYLE CURATION",
    title: "바쁜 하루 속 15분, 나만의 작은 서재",
    desc: "출퇴근길과 쉬는 시간에 딱 맞는 큐레이션 도서를 만나보세요."
  },
  {
    img: "./img/slide2.jpg",
    tag: "WARM BEIGE & YELLOW",
    title: "눈이 편안한 베이지 · 옐로우 독서 무드",
    desc: "차분한 색감과 함께 집중해서 읽는 책과 문구를 모았습니다."
  },
  {
    img: "./img/slide3.jpg",
    tag: "WELCOME 3,000P",
    title: "회원가입 즉시 3,000P · 최대 7% 적립",
    desc: "등급이 오를수록 1%에서 7%까지 포인트가 차곡차곡 쌓입니다."
  },
  {
    img: "./img/slide4.jpg",
    tag: "TRIAL CHECKOUT",
    title: "장바구니부터 체험 결제까지 한 번에",
    desc: "실제 결제 없이 주문 내역과 포인트 변화를 바로 확인해 보세요."
  }
];

const CATEGORIES = ["전체", "큐레이션 전자책", "오디오·리딩패스", "단행본", "독서 굿즈"];
const SLIDE_INTERVAL_MS = 6000;

/* ============================================================================
   2. 로컬 저장소 헬퍼(회원 정보·비밀번호 미저장) 및 상태
   ============================================================================ */
const STORAGE_KEYS = {
  cart: "sb_cart_v1",
  orders: "sb_orders_v1"
};

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const state = {
  sessionUser: null,
  profile: null,
  cart: loadJson(STORAGE_KEYS.cart, []),
  orders: loadJson(STORAGE_KEYS.orders, []),
  selectedCategory: "전체",
  searchKeyword: "",
  slideIndex: 0
};

let slideTimerId = null;
let toastTimerId = null;

function formatWon(num) {
  return `${Number(num || 0).toLocaleString()}원`;
}

function formatPoint(num) {
  return `${Number(num || 0).toLocaleString()}P`;
}

function getTierByGrade(gradeCode = "WELCOME") {
  const normalized = String(gradeCode || "WELCOME").toUpperCase();
  return MEMBERSHIP_TIERS.find((t) => t.grade === normalized) || MEMBERSHIP_TIERS[0];
}

function getDisplayGradeLabel(gradeCode = "WELCOME") {
  const normalized = String(gradeCode || "WELCOME").toUpperCase();
  const tier = getTierByGrade(normalized);
  return `${tier.name} (${normalized})`;
}

function getProductById(productId) {
  return PRODUCTS.find((p) => p.id === Number(productId)) || null;
}

function getRemainingStock(productId) {
  const product = getProductById(productId);
  if (!product) return 0;
  const reservedInOrders = state.orders.reduce((acc, order) => {
    const found = order.items.find((i) => i.productId === product.id);
    return acc + (found ? found.qty : 0);
  }, 0);
  return Math.max(0, product.stock - reservedInOrders);
}

/* ============================================================================
   3. 토스트 · 모달 · 오류 메시지 한글 변환
   ============================================================================ */
function showToast(message) {
  const toastEl = document.getElementById("toastBox");
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimerId);
  toastTimerId = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2600);
}

function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add("open");
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove("open");
}

function closeAllModals() {
  document.querySelectorAll(".modal-backdrop.open").forEach((modal) => {
    modal.classList.remove("open");
  });
}

function translateAuthError(error) {
  if (!error) return "요청을 처리하는 중 오류가 발생했습니다.";
  const msg = String(error.message || "").toLowerCase();

  if (msg.includes("user already registered") || msg.includes("already been registered")) {
    return "이미 가입된 이메일입니다. 로그인 탭에서 로그인해 주세요.";
  }
  if (msg.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호가 일치하지 않습니다.";
  }
  if (msg.includes("password should be at least") || msg.includes("weak password")) {
    return "비밀번호는 6자 이상으로 입력해 주세요.";
  }
  if (msg.includes("unable to validate email") || msg.includes("invalid email")) {
    return "올바른 이메일 주소를 입력해 주세요.";
  }
  if (msg.includes("email not confirmed")) {
    return "이메일 인증이 완료되지 않았습니다. 메일함을 확인해 주세요.";
  }
  if (msg.includes("rate limit")) {
    return "요청 횟수가 많습니다. 잠시 후 다시 시도해 주세요.";
  }
  return `오류가 발생했습니다: ${error.message}`;
}

/* ============================================================================
   4. Supabase 세션 및 shop_profiles 동기화
   ============================================================================ */
async function fetchMyProfile(user) {
  if (!user || typeof db === "undefined" || !db) {
    state.profile = null;
    return null;
  }

  const { data, error } = await db
    .from("shop_profiles")
    .select("id, email, name, phone, grade, points, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("shop_profiles 조회 오류:", error.message);
    state.profile = {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || (user.email ? user.email.split("@")[0] : "회원"),
      phone: user.user_metadata?.phone || "",
      grade: "WELCOME",
      points: 3000,
      role: "member"
    };
    return state.profile;
  }

  if (data) {
    state.profile = data;
    return data;
  }

  state.profile = {
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.name || (user.email ? user.email.split("@")[0] : "회원"),
    phone: user.user_metadata?.phone || "",
    grade: "WELCOME",
    points: 3000,
    role: "member"
  };
  return state.profile;
}

async function checkSessionOnLoad() {
  if (typeof db === "undefined" || !db) {
    state.sessionUser = null;
    state.profile = null;
    refreshAllViews();
    return;
  }

  const { data, error } = await db.auth.getSession();
  if (error) {
    console.error("세션 확인 오류:", error.message);
    state.sessionUser = null;
    state.profile = null;
    refreshAllViews();
    return;
  }

  const user = data?.session?.user || null;
  state.sessionUser = user;

  if (user) {
    await fetchMyProfile(user);
  } else {
    state.profile = null;
  }

  refreshAllViews();
}

/* ============================================================================
   5. 슬라이드 렌더링 및 제어
   ============================================================================ */
function renderSlider() {
  const track = document.getElementById("slidesTrack");
  const dots = document.getElementById("sliderDots");

  track.innerHTML = HERO_SLIDES.map((slide, idx) => `
    <div class="slide">
      <img src="${slide.img}" alt="${slide.title} (${idx + 1}/4)" />
      <div class="slide-overlay">
        <span class="slide-tag">${slide.tag}</span>
        <div class="slide-title">${slide.title}</div>
        <p class="slide-desc">${slide.desc}</p>
      </div>
    </div>
  `).join("");

  dots.innerHTML = HERO_SLIDES.map((_, idx) => `
    <button type="button" class="dot-btn ${idx === state.slideIndex ? "active" : ""}" data-slide="${idx}" aria-label="${idx + 1}번째 사진 보기"></button>
  `).join("");

  updateSlidePosition();
}

function updateSlidePosition() {
  const track = document.getElementById("slidesTrack");
  track.style.transform = `translateX(-${state.slideIndex * 100}%)`;
  document.querySelectorAll("#sliderDots .dot-btn").forEach((btn, idx) => {
    btn.classList.toggle("active", idx === state.slideIndex);
  });
}

function goToSlide(index) {
  const total = HERO_SLIDES.length;
  state.slideIndex = ((index % total) + total) % total;
  updateSlidePosition();
}

function startSlideTimer() {
  clearInterval(slideTimerId);
  slideTimerId = setInterval(() => {
    goToSlide(state.slideIndex + 1);
  }, SLIDE_INTERVAL_MS);
}

/* ============================================================================
   6. 헤더 · 분류 필터 · 검색 · 상품 목록 · 상품 상세 · 등급 안내
   ============================================================================ */
function renderHeaderAuth() {
  const area = document.getElementById("authHeaderArea");
  const cartTotalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);

  if (state.sessionUser) {
    const memberName = state.profile?.name
      || state.sessionUser.user_metadata?.name
      || state.sessionUser.email
      || "회원";

    area.innerHTML = `
      <span class="user-chip">${memberName} 님</span>
      <button type="button" class="btn btn-sm" id="logoutBtn">로그아웃</button>
      <button type="button" class="btn btn-primary btn-sm" id="openCartBtn">장바구니 (${cartTotalQty})</button>
    `;
  } else {
    area.innerHTML = `
      <button type="button" class="btn btn-sm" id="openAuthBtn">로그인 · 회원가입</button>
      <button type="button" class="btn btn-primary btn-sm" id="openCartBtn">장바구니 (${cartTotalQty})</button>
    `;
  }
}

function renderCategories() {
  const container = document.getElementById("categoryList");
  container.innerHTML = CATEGORIES.map((cat) => `
    <button
      type="button"
      class="category-btn ${state.selectedCategory === cat ? "active" : ""}"
      data-category="${cat}"
    >${cat}</button>
  `).join("");
}

function getFilteredProducts() {
  const keyword = state.searchKeyword.trim().toLowerCase();
  return PRODUCTS.filter((product) => {
    const matchCategory = state.selectedCategory === "전체" || product.category === state.selectedCategory;
    const matchKeyword = !keyword
      || product.name.toLowerCase().includes(keyword)
      || product.category.toLowerCase().includes(keyword)
      || product.summary.toLowerCase().includes(keyword);
    return matchCategory && matchKeyword;
  });
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const list = getFilteredProducts();
  const earnRate = state.profile ? getTierByGrade(state.profile.grade).earnRate : MEMBERSHIP_TIERS[0].earnRate;

  if (list.length === 0) {
    grid.innerHTML = `<p class="empty-msg" style="grid-column:1/-1;">조건에 맞는 상품이 없습니다.</p>`;
    return;
  }

  grid.innerHTML = list.map((item) => {
    const remStock = getRemainingStock(item.id);
    const earnPts = Math.floor(item.price * earnRate);
    return `
      <article class="product-card">
        <img src="${item.img}" alt="${item.name}" class="product-thumb" />
        <div class="product-body">
          <div>
            <span class="product-cat">${item.category}</span>
            <h3 class="product-name">${item.name}</h3>
            <p class="product-desc">${item.summary}</p>
            <p class="product-meta">남은 수량: ${remStock}개 · 적립 ${formatPoint(earnPts)}</p>
          </div>
          <div>
            <div class="product-price">${formatWon(item.price)}</div>
            <div class="product-actions">
              <button type="button" class="btn btn-soft btn-sm" data-detail-id="${item.id}">상세</button>
              <button type="button" class="btn btn-primary btn-sm" data-add-id="${item.id}" ${remStock <= 0 ? "disabled" : ""}>
                ${remStock <= 0 ? "품절" : "담기"}
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function openProductDetail(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const remStock = getRemainingStock(product.id);
  const earnRate = state.profile ? getTierByGrade(state.profile.grade).earnRate : MEMBERSHIP_TIERS[0].earnRate;
  const earnPts = Math.floor(product.price * earnRate);

  document.getElementById("detailTitle").textContent = product.name;
  document.getElementById("detailBody").innerHTML = `
    <img src="${product.img}" alt="${product.name}" class="detail-img" />
    <p style="margin-bottom:12px; color:var(--text-sub);">${product.summary}</p>
    <div class="detail-row"><span>분류</span><strong>${product.category}</strong></div>
    <div class="detail-row"><span>가격</span><strong>${formatWon(product.price)}</strong></div>
    <div class="detail-row"><span>재고</span><strong>${remStock}개</strong></div>
    <div class="detail-row"><span>예상 포인트 적립</span><strong>+${formatPoint(earnPts)} (${Math.round(earnRate * 100)}%)</strong></div>
    <div style="margin-top:16px;">
      <button type="button" class="btn btn-primary btn-full" id="detailAddCartBtn" data-add-id="${product.id}" ${remStock <= 0 ? "disabled" : ""}>
        ${remStock <= 0 ? "품절된 상품입니다" : "장바구니에 담기"}
      </button>
    </div>
  `;
  openModal("detailModal");
}

function renderMembershipTiers() {
  const grid = document.getElementById("tierGrid");
  const currentTier = state.profile ? getTierByGrade(state.profile.grade) : null;

  grid.innerHTML = MEMBERSHIP_TIERS.map((tier) => {
    const isCurrent = currentTier && currentTier.grade === tier.grade;
    return `
      <div class="tier-card ${isCurrent ? "active-tier" : ""}">
        <div class="tier-top">
          <strong>${tier.level}단계 · ${tier.name}</strong>
          <span class="tier-rate">${Math.round(tier.earnRate * 100)}% 적립</span>
        </div>
        <p class="tier-desc">${tier.benefit}</p>
        ${isCurrent ? `<p class="tier-desc" style="margin-top:6px; font-weight:700; color:var(--accent-brown);">현재 내 등급</p>` : ""}
      </div>
    `;
  }).join("");
}

/* ============================================================================
   7. 회원가입 · 로그인 · 로그아웃 · 마이페이지 (Supabase Auth & shop_profiles)
   ============================================================================ */
function switchAuthTab(mode) {
  const isLogin = mode === "login";
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.authMode === mode);
  });
  document.getElementById("loginForm").classList.toggle("hidden", !isLogin);
  document.getElementById("signupForm").classList.toggle("hidden", isLogin);
}

async function handleSignup(e) {
  e.preventDefault();
  if (typeof db === "undefined" || !db) {
    showToast("데이터베이스 연결을 확인해 주세요.");
    return;
  }

  const name = document.getElementById("signupName").value.trim();
  const phone = document.getElementById("signupPhone").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPw").value;

  if (!name) {
    showToast("이름을 입력해 주세요.");
    return;
  }
  if (!phone) {
    showToast("연락처를 입력해 주세요.");
    return;
  }
  if (password.length < 6) {
    showToast("비밀번호는 6자 이상으로 입력해 주세요.");
    return;
  }

  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        phone
      }
    }
  });

  if (error) {
    showToast(translateAuthError(error));
    return;
  }

  document.getElementById("signupForm").reset();
  closeModal("authModal");

  if (data?.session?.user) {
    state.sessionUser = data.session.user;
    await fetchMyProfile(data.session.user);
    refreshAllViews();
    showToast(`${name}님 회원가입이 완료되었습니다.`);
  } else {
    showToast("회원가입이 완료되었습니다. 로그인해 주세요.");
  }
}

async function handleLogin(e) {
  e.preventDefault();
  if (typeof db === "undefined" || !db) {
    showToast("데이터베이스 연결을 확인해 주세요.");
    return;
  }

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPw").value;

  if (!email || !password) {
    showToast("이메일과 비밀번호를 입력해 주세요.");
    return;
  }

  const { data, error } = await db.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    showToast(translateAuthError(error));
    return;
  }

  document.getElementById("loginForm").reset();
  closeModal("authModal");

  state.sessionUser = data.user;
  await fetchMyProfile(data.user);
  refreshAllViews();
  showToast(`${state.profile?.name || "회원"}님 환영합니다.`);
}

async function handleLogout() {
  if (typeof db === "undefined" || !db) return;

  const { error } = await db.auth.signOut();
  if (error) {
    showToast(translateAuthError(error));
    return;
  }

  state.sessionUser = null;
  state.profile = null;
  closeAllModals();
  refreshAllViews();
  showToast("로그아웃되었습니다.");
}

async function openMypage() {
  if (!state.sessionUser) {
    switchAuthTab("login");
    openModal("authModal");
    showToast("로그인 후 마이페이지를 이용할 수 있습니다.");
    return;
  }

  openModal("mypageModal");
  const body = document.getElementById("mypageBody");
  body.innerHTML = `<p class="empty-msg">내 프로필 정보를 불러오는 중입니다...</p>`;

  const profile = await fetchMyProfile(state.sessionUser);
  if (!profile) {
    body.innerHTML = `<p class="empty-msg">회원 정보를 불러오지 못했습니다.</p>`;
    return;
  }

  const tier = getTierByGrade(profile.grade);
  const myOrders = state.orders.filter((o) => o.memberEmail === profile.email);

  const ordersHtml = myOrders.length === 0
    ? `<p class="empty-msg">아직 체험 결제 주문 내역이 없습니다.</p>`
    : myOrders.map((order) => `
      <div class="order-card">
        <div><strong>주문번호 ${order.orderId}</strong> · ${order.date}</div>
        <div>${order.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}</div>
        <div>결제 ${formatWon(order.paidAmount)} · 포인트 사용 ${formatPoint(order.usedPoints)} · 적립 +${formatPoint(order.earnedPoints)}</div>
      </div>
    `).join("");

  body.innerHTML = `
    <div class="profile-box">
      <div class="detail-row"><span>이름</span><strong>${profile.name || "-"}</strong></div>
      <div class="detail-row"><span>이메일</span><strong>${profile.email || state.sessionUser.email || "-"}</strong></div>
      <div class="detail-row"><span>등급</span><strong>${getDisplayGradeLabel(profile.grade)}</strong></div>
      <div class="detail-row"><span>포인트</span><strong>${formatPoint(profile.points)}</strong></div>
    </div>

    <form id="profileUpdateForm" class="profile-box">
      <h3 style="font-size:1rem; margin-bottom:10px;">이름 · 연락처 수정</h3>
      <div class="field">
        <label for="editProfileName">이름</label>
        <input type="text" id="editProfileName" value="${profile.name || ""}" required />
      </div>
      <div class="field">
        <label for="editProfilePhone">연락처</label>
        <input type="tel" id="editProfilePhone" value="${profile.phone || ""}" placeholder="010-0000-0000" />
      </div>
      <button type="submit" class="btn btn-primary btn-full">저장하기</button>
    </form>

    <h3 style="font-size:1rem; margin-bottom:10px;">체험 결제 주문 내역 (${myOrders.length}건)</h3>
    ${ordersHtml}
  `;

  document.getElementById("profileUpdateForm").addEventListener("submit", handleProfileUpdate);
}

async function handleProfileUpdate(e) {
  e.preventDefault();
  if (typeof db === "undefined" || !db || !state.sessionUser) return;

  const newName = document.getElementById("editProfileName").value.trim();
  const newPhone = document.getElementById("editProfilePhone").value.trim();

  if (!newName) {
    showToast("이름을 입력해 주세요.");
    return;
  }

  // grade, points, role 은 읽기 전용이므로 수정하지 않고 name 과 phone 만 갱신합니다.
  const { data, error } = await db
    .from("shop_profiles")
    .update({ name: newName, phone: newPhone })
    .eq("id", state.sessionUser.id)
    .select("id, email, name, phone, grade, points, role, created_at")
    .single();

  if (error) {
    showToast(`저장에 실패했습니다: ${error.message}`);
    return;
  }

  state.profile = data;
  refreshAllViews();
  await openMypage();
  showToast("이름과 연락처가 저장되었습니다.");
}

/* ============================================================================
   8. 장바구니 및 체험 결제
   ============================================================================ */
function addToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const remStock = getRemainingStock(product.id);
  const existing = state.cart.find((item) => item.productId === product.id);
  const currentQty = existing ? existing.qty : 0;

  if (currentQty + 1 > remStock) {
    showToast("남은 재고 수량을 초과할 수 없습니다.");
    return;
  }

  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ productId: product.id, qty: 1 });
  }

  saveJson(STORAGE_KEYS.cart, state.cart);
  renderHeaderAuth();
  showToast(`"${product.name}"을(를) 장바구니에 담았습니다.`);
}

function updateCartQty(productId, delta) {
  const idx = state.cart.findIndex((item) => item.productId === Number(productId));
  if (idx === -1) return;

  const nextQty = state.cart[idx].qty + delta;
  const remStock = getRemainingStock(productId);

  if (nextQty <= 0) {
    state.cart.splice(idx, 1);
  } else if (nextQty > remStock) {
    showToast(`최대 ${remStock}개까지 담을 수 있습니다.`);
    return;
  } else {
    state.cart[idx].qty = nextQty;
  }

  saveJson(STORAGE_KEYS.cart, state.cart);
  renderHeaderAuth();
  renderCart();
}

function removeCartItem(productId) {
  state.cart = state.cart.filter((item) => item.productId !== Number(productId));
  saveJson(STORAGE_KEYS.cart, state.cart);
  renderHeaderAuth();
  renderCart();
}

function computeCartTotals(requestedUsePoints = 0) {
  const profile = state.profile;
  const tier = profile ? getTierByGrade(profile.grade) : MEMBERSHIP_TIERS[0];

  let subtotal = 0;
  const items = state.cart
    .map((entry) => {
      const product = getProductById(entry.productId);
      if (!product) return null;
      const lineTotal = product.price * entry.qty;
      subtotal += lineTotal;
      return {
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        qty: entry.qty,
        lineTotal
      };
    })
    .filter(Boolean);

  const maxAvailablePoints = profile ? Math.max(0, Number(profile.points) || 0) : 0;
  const cleanRequested = Math.max(0, Math.floor(Number(requestedUsePoints) || 0));
  const usedPoints = Math.min(cleanRequested, maxAvailablePoints, subtotal);
  const paidAmount = Math.max(0, subtotal - usedPoints);
  const earnedPoints = profile ? Math.floor(paidAmount * tier.earnRate) : 0;

  return {
    profile,
    tier,
    items,
    subtotal,
    maxAvailablePoints,
    usedPoints,
    paidAmount,
    earnedPoints
  };
}

function renderCart() {
  const listEl = document.getElementById("cartItemsContainer");
  const panelEl = document.getElementById("checkoutPanel");

  if (state.cart.length === 0) {
    listEl.innerHTML = `<p class="empty-msg">장바구니가 비어 있습니다.</p>`;
    panelEl.innerHTML = "";
    return;
  }

  listEl.innerHTML = state.cart.map((entry) => {
    const product = getProductById(entry.productId);
    if (!product) return "";
    const lineTotal = product.price * entry.qty;
    return `
      <div class="cart-row">
        <div>
          <div><strong>${product.name}</strong></div>
          <div style="font-size:0.84rem; color:var(--text-sub);">${formatWon(product.price)} · 합계 ${formatWon(lineTotal)}</div>
        </div>
        <div class="qty-group">
          <button type="button" class="btn btn-sm" data-qty-id="${product.id}" data-qty-delta="-1" aria-label="수량 감소">-</button>
          <span class="qty-val">${entry.qty}</span>
          <button type="button" class="btn btn-sm" data-qty-id="${product.id}" data-qty-delta="1" aria-label="수량 증가">+</button>
          <button type="button" class="btn btn-danger btn-sm" data-remove-id="${product.id}">삭제</button>
        </div>
      </div>
    `;
  }).join("");

  const calc = computeCartTotals(0);
  panelEl.innerHTML = `
    <div class="summary-line"><span>상품 합계</span><strong id="cartSubtotalVal">${formatWon(calc.subtotal)}</strong></div>
    <div class="field" style="margin-top:8px; margin-bottom:8px;">
      <label for="usePointsInput">포인트 사용 (보유: <span id="cartAvailPts">${formatPoint(calc.maxAvailablePoints)}</span>)</label>
      <div style="display:flex; gap:8px;">
        <input type="number" id="usePointsInput" min="0" value="0" />
        <button type="button" class="btn btn-soft btn-sm" id="useAllPtsBtn">전액</button>
      </div>
    </div>
    <div class="summary-line"><span>결제 후 예상 적립 (${calc.tier.name} ${Math.round(calc.tier.earnRate * 100)}%)</span><strong id="cartEarnedVal">+${formatPoint(calc.earnedPoints)}</strong></div>
    <div class="summary-total"><span>체험 결제 금액</span><span id="cartPaidVal">${formatWon(calc.paidAmount)}</span></div>
    <button type="button" class="btn btn-primary btn-full" id="trialCheckoutBtn" style="margin-top:12px;">체험 결제하기 (실제 결제 없음)</button>
  `;

  const ptsInput = document.getElementById("usePointsInput");
  ptsInput.addEventListener("input", () => {
    const updated = computeCartTotals(ptsInput.value);
    if (ptsInput.value !== String(updated.usedPoints) && ptsInput.value !== "") {
      ptsInput.value = updated.usedPoints;
    }
    document.getElementById("cartEarnedVal").textContent = `+${formatPoint(updated.earnedPoints)}`;
    document.getElementById("cartPaidVal").textContent = formatWon(updated.paidAmount);
  });

  document.getElementById("useAllPtsBtn").addEventListener("click", () => {
    const allCalc = computeCartTotals(calc.maxAvailablePoints);
    ptsInput.value = allCalc.usedPoints;
    document.getElementById("cartEarnedVal").textContent = `+${formatPoint(allCalc.earnedPoints)}`;
    document.getElementById("cartPaidVal").textContent = formatWon(allCalc.paidAmount);
  });

  document.getElementById("trialCheckoutBtn").addEventListener("click", processTrialPayment);
}

function processTrialPayment() {
  if (!state.sessionUser || !state.profile) {
    closeModal("cartModal");
    switchAuthTab("login");
    openModal("authModal");
    showToast("체험 결제를 위해 먼저 로그인해 주세요.");
    return;
  }

  if (state.cart.length === 0) return;

  const inputEl = document.getElementById("usePointsInput");
  const requestedPts = inputEl ? parseInt(inputEl.value, 10) || 0 : 0;
  const calc = computeCartTotals(requestedPts);

  for (const item of calc.items) {
    if (item.qty > getRemainingStock(item.productId)) {
      showToast(`"${item.name}"의 재고가 부족합니다.`);
      return;
    }
  }

  const order = {
    orderId: `SB-${Date.now().toString().slice(-6)}`,
    memberEmail: state.profile.email,
    date: new Date().toLocaleString("ko-KR"),
    items: calc.items,
    paidAmount: calc.paidAmount,
    usedPoints: calc.usedPoints,
    earnedPoints: calc.earnedPoints
  };

  state.orders.unshift(order);
  state.cart = [];

  saveJson(STORAGE_KEYS.orders, state.orders);
  saveJson(STORAGE_KEYS.cart, state.cart);

  closeModal("cartModal");
  refreshAllViews();
  showToast(`체험 결제 완료! 주문번호 ${order.orderId} (+${formatPoint(calc.earnedPoints)} 적립 예정)`);
}

/* ============================================================================
   9. 화면 갱신 및 이벤트 바인딩
   ============================================================================ */
function refreshAllViews() {
  renderHeaderAuth();
  renderCategories();
  renderProducts();
  renderMembershipTiers();
}

function bindEvents() {
  document.getElementById("prevSlideBtn").addEventListener("click", () => {
    goToSlide(state.slideIndex - 1);
    startSlideTimer();
  });

  document.getElementById("nextSlideBtn").addEventListener("click", () => {
    goToSlide(state.slideIndex + 1);
    startSlideTimer();
  });

  document.getElementById("sliderDots").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-slide]");
    if (!btn) return;
    goToSlide(Number(btn.dataset.slide));
    startSlideTimer();
  });

  document.getElementById("categoryList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-category]");
    if (!btn) return;
    state.selectedCategory = btn.dataset.category;
    renderCategories();
    renderProducts();
  });

  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.searchKeyword = e.target.value;
    renderProducts();
  });

  document.getElementById("clearSearchBtn").addEventListener("click", () => {
    state.searchKeyword = "";
    document.getElementById("searchInput").value = "";
    renderProducts();
  });

  document.getElementById("productGrid").addEventListener("click", (e) => {
    const detailBtn = e.target.closest("[data-detail-id]");
    if (detailBtn) {
      openProductDetail(Number(detailBtn.dataset.detailId));
      return;
    }
    const addBtn = e.target.closest("[data-add-id]");
    if (addBtn) {
      addToCart(Number(addBtn.dataset.addId));
    }
  });

  document.getElementById("detailBody").addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add-id]");
    if (!addBtn) return;
    addToCart(Number(addBtn.dataset.addId));
    closeModal("detailModal");
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest("#openAuthBtn")) {
      switchAuthTab("login");
      openModal("authModal");
    }
    if (e.target.closest("#logoutBtn")) {
      handleLogout();
    }
    if (e.target.closest("#openCartBtn")) {
      renderCart();
      openModal("cartModal");
    }
    if (e.target.closest("#openMypageBtn")) {
      openMypage();
    }

    const closeBtn = e.target.closest("[data-close-modal]");
    if (closeBtn) {
      closeModal(closeBtn.dataset.closeModal);
    }

    if (e.target.classList.contains("modal-backdrop")) {
      closeModal(e.target.id);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });

  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchAuthTab(tab.dataset.authMode));
  });

  document.getElementById("signupForm").addEventListener("submit", handleSignup);
  document.getElementById("loginForm").addEventListener("submit", handleLogin);

  document.getElementById("cartItemsContainer").addEventListener("click", (e) => {
    const qtyBtn = e.target.closest("[data-qty-id]");
    if (qtyBtn) {
      updateCartQty(Number(qtyBtn.dataset.qtyId), Number(qtyBtn.dataset.qtyDelta));
      return;
    }
    const removeBtn = e.target.closest("[data-remove-id]");
    if (removeBtn) {
      removeCartItem(Number(removeBtn.dataset.removeId));
    }
  });
}

async function init() {
  renderSlider();
  startSlideTimer();
  bindEvents();
  await checkSessionOnLoad();

  if (typeof db !== "undefined" && db) {
    db.auth.onAuthStateChange(async (_event, session) => {
      state.sessionUser = session?.user || null;
      if (state.sessionUser) {
        await fetchMyProfile(state.sessionUser);
      } else {
        state.profile = null;
      }
      refreshAllViews();
    });
  }
}

init();
