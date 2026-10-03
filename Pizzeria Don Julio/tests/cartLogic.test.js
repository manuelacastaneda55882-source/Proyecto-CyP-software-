const {
  calculateItemPrice,
  calculateCartTotals,
  validateCartNotEmpty,
  getCouponDiscount
} = require('../src/cartLogic');

describe('Sección IV: Pruebas Unitarias - Pizzería Don Julio', () => {

  describe('Cálculo de Precios por Tamaño y Extras', () => {
    test('UT-01: Pizza mediana sin extras debe cobrar precio base exacto', () => {
      const res = calculateItemPrice(25000, 'mediana', []);
      expect(res.unitPrice).toBe(25000);
    });

    test('UT-02: Tamaño Familiar debe descontar los 2 extras de mayor valor ($0)', () => {
      const res = calculateItemPrice(25000, 'familiar', [4000, 5000]);
      expect(res.unitPrice).toBe(33750);
    });
  });

  describe('Cálculo de Envío y Regla de los $30.000', () => {
    test('UT-03: Compra menor a $30.000 debe cobrar $5.000 de envío', () => {
      const res = calculateCartTotals([{ unitPrice: 22000, quantity: 1 }], 0, 'delivery');
      expect(res.shippingCost).toBe(5000);
      expect(res.grandTotal).toBe(27000);
    });

    test('UT-04 [Valor Límite]: Compra de exactamente $30.000 debe cobrar envío (no supera los $30.000)', () => {
      const res = calculateCartTotals([{ unitPrice: 15000, quantity: 2 }], 0, 'delivery');
      expect(res.shippingCost).toBe(5000);
    });

    test('UT-05: Compra mayor a $30.000 tiene envío GRATIS ($0)', () => {
      const res = calculateCartTotals([{ unitPrice: 42000, quantity: 1 }], 0, 'delivery');
      expect(res.shippingCost).toBe(0);
      expect(res.grandTotal).toBe(42000);
    });

    test('UT-06: Retiro en local (pickup) siempre tiene envío $0', () => {
      const res = calculateCartTotals([{ unitPrice: 12000, quantity: 1 }], 0, 'pickup');
      expect(res.shippingCost).toBe(0);
    });
  });

  describe('Validación de Estado del Carrito', () => {
    test('UT-07: validateCartNotEmpty debe rechazar carrito vacío []', () => {
      expect(validateCartNotEmpty([])).toBe(false);
    });
  });

  describe('Validación de Cupones Promocionales', () => {
    test('UT-09: Cupón DONJULIO10 debe retornar 10%', () => {
      expect(getCouponDiscount('DONJULIO10')).toBe(10);
    });

    test('UT-10: Cupón inexistente debe retornar 0%', () => {
      expect(getCouponDiscount('INVALIDO')).toBe(0);
    });
  });
});
