const CART_KEY = "cart";
const CHECKOUT_SELECTION_KEY = "cart_checkout_selection";
const GUEST_SCOPE = "guest";
const CART_SCOPE_KEY = "cart_user_scope";

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

const base64UrlDecode = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded =
    padding === 0 ? normalized : normalized + "=".repeat(4 - padding);
  return atob(padded);
};

const getRawSessionToken = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("token");
};

const getTokenFingerprint = (token) => {
  if (!token) return null;
  const tail = token.slice(-20).replace(/[^a-zA-Z0-9]/g, "");
  if (!tail) return null;
  return `token_${tail}`;
};

const getUserScope = () => {
  if (typeof window === "undefined") return GUEST_SCOPE;
  const cachedScope = sessionStorage.getItem(CART_SCOPE_KEY);
  if (cachedScope) return cachedScope;

  const token = getRawSessionToken();
  if (!token) return GUEST_SCOPE;

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return GUEST_SCOPE;
    const payload = JSON.parse(base64UrlDecode(payloadPart));
    const sub = payload?.sub;
    if (sub !== undefined && sub !== null) {
      const scope = `user_${String(sub)}`;
      sessionStorage.setItem(CART_SCOPE_KEY, scope);
      return scope;
    }
  } catch {
    // no-op, fallback below
  }

  const fallbackScope = getTokenFingerprint(token);
  if (fallbackScope) {
    sessionStorage.setItem(CART_SCOPE_KEY, fallbackScope);
    return fallbackScope;
  }

  return GUEST_SCOPE;
};

const getScopedCartKey = () => `${CART_KEY}_${getUserScope()}`;
const getScopedCheckoutSelectionKey = () =>
  `${CHECKOUT_SELECTION_KEY}_${getUserScope()}`;

const migrateLegacyIfNeeded = (scopedKey, legacyKey) => {
  if (typeof window === "undefined") return;
  if (getUserScope() !== GUEST_SCOPE) return;
  const scopedValue = localStorage.getItem(scopedKey);
  if (scopedValue) return;
  const legacyValue = localStorage.getItem(legacyKey);
  if (!legacyValue) return;
  localStorage.setItem(scopedKey, legacyValue);
};

export const getCartItems = () => {
  if (typeof window === "undefined") return [];
  const scopedKey = getScopedCartKey();
  migrateLegacyIfNeeded(scopedKey, CART_KEY);
  const raw = localStorage.getItem(scopedKey);
  if (!raw) return [];
  const parsed = safeParse(raw);
  return Array.isArray(parsed) ? parsed : [];
};

export const setCartItems = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(getScopedCartKey(), JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart-updated"));
};

export const clearCartItems = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getScopedCartKey());
  window.dispatchEvent(new CustomEvent("cart-updated"));
};

export const removeCartItemsByIds = (ids = []) => {
  const idSet = new Set(ids.map((id) => String(id)));
  const cart = getCartItems();
  const filtered = cart.filter((item) => !idSet.has(String(item.id)));
  setCartItems(filtered);
  return filtered;
};

export const addCartItem = (item) => {
  const cart = getCartItems();
  const index = cart.findIndex((p) => String(p.id) === String(item.id));

  if (index >= 0) {
    cart[index] = {
      ...cart[index],
      quantity: Number(cart[index].quantity || 1) + Number(item.quantity || 1),
    };
  } else {
    cart.push({
      id: String(item.id),
      productCode: item.productCode,
      name: item.name,
      image: item.image || null,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      availableQuantity: Number(item.availableQuantity || 0),
    });
  }

  setCartItems(cart);
  return cart;
};

export const getCartCount = () => {
  return getCartItems().reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
};

export const setCheckoutSelection = (items) => {
  if (typeof window === "undefined") return;
  const scopedKey = getScopedCheckoutSelectionKey();
  const legacyRaw =
    getUserScope() === GUEST_SCOPE
      ? sessionStorage.getItem(CHECKOUT_SELECTION_KEY)
      : null;
  if (!sessionStorage.getItem(scopedKey) && legacyRaw) {
    sessionStorage.setItem(scopedKey, legacyRaw);
  }
  sessionStorage.setItem(scopedKey, JSON.stringify(items || []));
};

export const getCheckoutSelection = () => {
  if (typeof window === "undefined") return [];
  const scopedKey = getScopedCheckoutSelectionKey();
  const scopedRaw = sessionStorage.getItem(scopedKey);
  if (!scopedRaw && getUserScope() === GUEST_SCOPE) {
    const legacyRaw = sessionStorage.getItem(CHECKOUT_SELECTION_KEY);
    if (legacyRaw) {
      sessionStorage.setItem(scopedKey, legacyRaw);
    }
  }
  const raw = sessionStorage.getItem(scopedKey);
  if (!raw) return [];
  const parsed = safeParse(raw);
  return Array.isArray(parsed) ? parsed : [];
};

export const clearCheckoutSelection = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(getScopedCheckoutSelectionKey());
};
