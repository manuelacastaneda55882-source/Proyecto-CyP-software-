(function (root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else {
    root.CartLogic = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  function calculateItemPrice(basePrice, size, extraPrices = []) {
    let sizeMultiplier = 1.0;
    if (size === 'personal') sizeMultiplier = 0.85;
    else if (size === 'familiar') sizeMultiplier = 1.35;

    const baseAdjusted = basePrice * sizeMultiplier;
    const sortedPrices = [...extraPrices].sort((a, b) => a - b);

    let payableExtras = [];
    if (size === 'familiar') {
      payableExtras = sortedPrices.slice(1);
    } else {
      payableExtras = sortedPrices;
    }

    const extrasTotal = payableExtras.reduce((sum, p) => sum + p, 0);
    return {
      unitPrice: Math.round(baseAdjusted + extrasTotal),
      extrasTotal
    };
  }

  function calculateCartTotals(items = [], discountPercent = 0, deliveryMethod = 'delivery') {
    if (!items || items.length === 0) {
      return { subtotal: 0, shippingCost: 0, grandTotal: 0 };
    }

    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const discountAmount = Math.round(subtotal * (discountPercent / 100));
    const subtotalNeto = Math.max(0, subtotal - discountAmount);

    let shippingCost = 5000;
    if (deliveryMethod === 'pickup') {
      shippingCost = 0;
    } else if (subtotalNeto >= 30000) {
      shippingCost = 0;
    }

    return {
      subtotal,
      subtotalNeto,
      shippingCost,
      grandTotal: subtotalNeto + shippingCost
    };
  }

  function validateCartNotEmpty(items) {
    return Array.isArray(items) && items.length > 0;
  }

  function getCouponDiscount(code) {
    if (!code) return 0;
    const clean = code.trim().toUpperCase();
    if (clean === 'DONJULIO10') return 10;
    if (clean === 'PRIMERAPIZZA') return 20;
    return 0;
  }

  return {
    calculateItemPrice,
    calculateCartTotals,
    validateCartNotEmpty,
    getCouponDiscount
  };
}));
