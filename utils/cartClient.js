const CART_KEY = "cart";
const CHECKOUT_SELECTION_KEY = "cart_checkout_selection";

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

export const getCartItems = () => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  const parsed = safeParse(raw);
  return Array.isArray(parsed) ? parsed : [];
};

export const setCartItems = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart-updated"));
};

export const clearCartItems = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
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
  sessionStorage.setItem(CHECKOUT_SELECTION_KEY, JSON.stringify(items || []));
};

export const getCheckoutSelection = () => {
  if (typeof window === "undefined") return [];
  const raw = sessionStorage.getItem(CHECKOUT_SELECTION_KEY);
  if (!raw) return [];
  const parsed = safeParse(raw);
  return Array.isArray(parsed) ? parsed : [];
};

export const clearCheckoutSelection = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHECKOUT_SELECTION_KEY);
};
