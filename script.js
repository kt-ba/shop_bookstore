/* ============================================================================
   1. 상품 · 회원 등급 · 슬라이드 데이터 (DB 이관 및 수정 용이하도록 최상단 배치)
   ============================================================================ */
const PRODUCTS = [
  {
    id: 1,
    name: "가짜 돈 진짜 ",
    category: "큐레이션 전자책",
    price: 9800,
    stock: 99,
    img: "./img/prod1.png",
    summary: "지하철에서 가볍게 읽기 좋은 짧은 산문 28편을 모은 전자책"
  },
  {
    id: 2,
    name: "트렌드 코리아 2027",
    category: "오디오·리딩패스",
    price: 12900,
    stock: 50,
    img: "./img/prod2.png",
    summary: "베스트셀러 요약 노트와 몰입형 리딩 가이드를 묶은 월간 패스"
  },
  {
    id: 3,
    name: "박태웅의 AI 사",
    category: "오디오·리딩패스",
    price: 14500,
    stock: 40,
    img: "./img/prod3.png",
    summary: "산책과 퇴근길에 듣기 좋은 차분한 낭독 오디오 컬렉션"
  },
  {
    id: 4,
    name: "금융이 쉬워지는 최소한의 세계사",
    category: "단행본",
    price: 16800,
    stock: 25,
    img: "./img/prod4.png",
    summary: "대학생과 직장인의 루틴 정리를 돕는 실용 단행본"
  },
  {
    id: 5,
    name: "팔란티어의 제",
    category: "단행본",
    price: 18500,
    stock: 18,
    img: "./img/prod5.png",
    summary: "질문과 메모가 함께 담긴 미색 종이 인문 교양서"
  },
  {
    id: 6,
    name: "돈의 심리학",
    category: "큐레이션 전자책",
    price: 15000,
    stock: 80,
    img: "./img/prod6.png",
    summary: "실무 사례와 표를 한눈에 보는 디지털 큐레이션북"
  },
  {
    id: 7,
    name: "나의 첫 부동산 교과서 ",
    category: "독서 굿즈",
    price: 8500,
    stock: 35,
    img: "./img/prod7.png",
    summary: "읽은 문장과 감상을 남기는 손바닥 크기 독서 로그북"
  },
  {
    id: 8,
    name: "돈 뜨겁게 사랑하고 차갑게 다루어라",
    category: "독서 굿즈",
    price: 7200,
    stock: 45,
    img: "./img/prod8.png",
    summary: "책장을 넘길 때마다 은은한 질감이 느껴지는 자수 책갈피 2종"
  }
];

const MEMBERSHIP_TIERS = [
  { level: 1, name: "새싹 독자", minSpent: 0, earnRate: 0.01, benefit: "신규 가입 3,000P 지급 · 구매액 1% 적립" },
  { level: 2, name: "단골 독자", minSpent: 30000, earnRate: 0.03, benefit: "누적 3만원 이상 · 구매액 3% 적립" },
  { level: 3, name: "큐레이터", minSpent: 70000, earnRate: 0.05, benefit: "누적 7만원 이상 · 구매액 5% 적립" },
  { level: 4, name: "북마스터", minSpent: 120000, earnRate: 0.07, benefit: "누적 12만원 이상 · 구매액 7% 적립" }
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
const WELCOME_POINTS = 3000;
const SLIDE_INTERVAL_MS = 6000;

/* ============================================================================
   2. 로컬 저장소 및 상태 관리
   ============================================================================ */
const STORAGE_KEYS = {
  members: "sb_members_v1",
  sessionEmail: "sb_session_email_v1",
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
  members: loadJson(STORAGE_KEYS.members, []),
  sessionEmail: loadJson(STORAGE_KEYS.sessionEmail, null),
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

function getCurrentMember() {
  if (!state.sessionEmail) return null;
  return state.members.find((m) => m.email === state.sessionEmail) || null;
}

function getMemberTier(totalSpent = 0) {
  const sorted = [...MEMBERSHIP_TIERS].sort((a, b) => b.minSpent - a.minSpent);
  return sorted.find((tier) => totalSpent >= tier.minSpent) || MEMBERSHIP_TIERS[0];
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
   3. 알림 및 모달 제어
   ============================================================================ */
function showToast(message) {
  const toastEl = document.getElementById("toastBox");
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimerId);
  toastTimerId = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2500);
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

/* ============================================================================
   4. 슬라이드(4장, 6초 간격) 렌더링 및 제어
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
   5. 헤더 · 분류 필터 · 검색 · 상품 목록 · 상품 상세
   ============================================================================ */
function renderHeaderAuth() {
  const area = document.getElementById("authHeaderArea");
  const member = getCurrentMember();
  const cartTotalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);

  const authHtml = member
    ? `
      <span class="user-chip">
        <span class="tier-pill">${getMemberTier(member.totalSpent).name}</span>
        <span>${member.name}</span>
        <span>${formatPoint(member.points)}</span>
      </span>
      <button type="button" class="btn btn-sm" id="logoutBtn">로그아웃</button>
    `
    : `<button type="button" class="btn btn-sm" id="openAuthBtn">로그인·가입</button>`;

  area.innerHTML = `
    ${authHtml}
    <button type="button" class="btn btn-primary btn-sm" id="openCartBtn">장바구니 (${cartTotalQty})</button>
  `;
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
  const member = getCurrentMember();
  const earnRate = member ? getMemberTier(member.totalSpent).earnRate : MEMBERSHIP_TIERS[0].earnRate;

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
  const member = getCurrentMember();
  const earnRate = member ? getMemberTier(member.totalSpent).earnRate : MEMBERSHIP_TIERS[0].earnRate;
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
  const member = getCurrentMember();
  const currentTier = member ? getMemberTier(member.totalSpent) : null;

  grid.innerHTML = MEMBERSHIP_TIERS.map((tier) => {
    const isCurrent = currentTier && currentTier.level === tier.level;
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
   6. 회원가입 · 로그인 · 마이페이지
   ============================================================================ */
function switchAuthTab(mode) {
  const isSignup = mode === "signup";
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.authMode === mode);
  });
  document.getElementById("signupForm").classList.toggle("hidden", !isSignup);
  document.getElementById("loginForm").classList.toggle("hidden", isSignup);
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const pw = document.getElementById("signupPw").value;

  if (!name || !email || pw.length < 4) {
    showToast("이름, 이메일, 4자 이상 비밀번호를 입력하세요.");
    return;
  }

  const exists = state.members.some((m) => m.email === email);
  if (exists) {
    showToast("이미 가입된 이메일입니다. 로그인해 주세요.");
    switchAuthTab("login");
    return;
  }

  const newMember = {
    name,
    email,
    pw,
    points: WELCOME_POINTS,
    totalSpent: 0
  };

  state.members.push(newMember);
  state.sessionEmail = email;
  saveJson(STORAGE_KEYS.members, state.members);
  saveJson(STORAGE_KEYS.sessionEmail, state.sessionEmail);

  document.getElementById("signupForm").reset();
  closeModal("authModal");
  refreshAllViews();
  showToast(`${name}님 가입 완료! ${formatPoint(WELCOME_POINTS)}가 지급되었습니다.`);
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const pw = document.getElementById("loginPw").value;

  const found = state.members.find((m) => m.email === email && m.pw === pw);
  if (!found) {
    showToast("이메일 또는 비밀번호가 일치하지 않습니다.");
    return;
  }

  state.sessionEmail = found.email;
  saveJson(STORAGE_KEYS.sessionEmail, state.sessionEmail);
  document.getElementById("loginForm").reset();
  closeModal("authModal");
  refreshAllViews();
  showToast(`${found.name}님 환영합니다.`);
}

function handleLogout() {
  state.sessionEmail = null;
  saveJson(STORAGE_KEYS.sessionEmail, null);
  refreshAllViews();
  showToast("로그아웃 되었습니다.");
}

function renderMypage() {
  const body = document.getElementById("mypageBody");
  const member = getCurrentMember();

  if (!member) {
    body.innerHTML = `
      <p class="empty-msg">로그인 후 회원 등급, 보유 포인트, 주문 내역을 확인할 수 있습니다.</p>
      <button type="button" class="btn btn-primary btn-full" id="mypageLoginTrigger">회원가입 · 로그인 열기</button>
    `;
    return;
  }

  const tier = getMemberTier(member.totalSpent);
  const myOrders = state.orders.filter((o) => o.memberEmail === member.email);

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
      <div class="detail-row"><span>회원 이름</span><strong>${member.name}</strong></div>
      <div class="detail-row"><span>이메일</span><strong>${member.email}</strong></div>
      <div class="detail-row"><span>현재 등급</span><strong>${tier.level}단계 · ${tier.name} (${Math.round(tier.earnRate * 100)}% 적립)</strong></div>
      <div class="detail-row"><span>보유 포인트</span><strong>${formatPoint(member.points)}</strong></div>
      <div class="detail-row"><span>누적 결제 금액</span><strong>${formatWon(member.totalSpent)}</strong></div>
    </div>
    <h3 style="font-size:1rem; margin-bottom:10px;">체험 결제 주문 내역 (${myOrders.length}건)</h3>
    ${ordersHtml}
  `;
}

/* ============================================================================
   7. 장바구니 (수량 변경 · 삭제 · 합계) 및 체험 결제
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
  const member = getCurrentMember();
  const tier = member ? getMemberTier(member.totalSpent) : MEMBERSHIP_TIERS[0];

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

  const maxAvailablePoints = member ? Math.max(0, member.points) : 0;
  const cleanRequested = Math.max(0, Math.floor(Number(requestedUsePoints) || 0));
  const usedPoints = Math.min(cleanRequested, maxAvailablePoints, subtotal);
  const paidAmount = Math.max(0, subtotal - usedPoints);
  const earnedPoints = member ? Math.floor(paidAmount * tier.earnRate) : 0;

  return {
    member,
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
  const member = getCurrentMember();
  if (!member) {
    closeModal("cartModal");
    openModal("authModal");
    showToast("체험 결제를 위해 먼저 로그인하거나 회원가입해 주세요.");
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

  member.points = Math.max(0, member.points - calc.usedPoints) + calc.earnedPoints;
  member.totalSpent += calc.paidAmount;

  const order = {
    orderId: `SB-${Date.now().toString().slice(-6)}`,
    memberEmail: member.email,
    date: new Date().toLocaleString("ko-KR"),
    items: calc.items,
    paidAmount: calc.paidAmount,
    usedPoints: calc.usedPoints,
    earnedPoints: calc.earnedPoints
  };

  state.orders.unshift(order);
  state.cart = [];

  saveJson(STORAGE_KEYS.members, state.members);
  saveJson(STORAGE_KEYS.orders, state.orders);
  saveJson(STORAGE_KEYS.cart, state.cart);

  closeModal("cartModal");
  refreshAllViews();
  showToast(`체험 결제 완료! 주문번호 ${order.orderId} 저장 (+${formatPoint(calc.earnedPoints)} 적립)`);
}

/* ============================================================================
   8. 전체 화면 갱신 및 이벤트 연결
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
      switchAuthTab("signup");
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
      renderMypage();
      openModal("mypageModal");
    }
    if (e.target.closest("#mypageLoginTrigger")) {
      closeModal("mypageModal");
      switchAuthTab("signup");
      openModal("authModal");
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

  document.getElementById("mypageBody").addEventListener("click", (e) => {
    if (e.target.closest("#mypageLoginTrigger")) {
      closeModal("mypageModal");
      switchAuthTab("signup");
      openModal("authModal");
    }
  });
}

function init() {
  renderSlider();
  startSlideTimer();
  refreshAllViews();
  bindEvents();
}

init();
