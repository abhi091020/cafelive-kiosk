// src\context\OrderContext.jsx

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_QTY_PER_ITEM = 10;
const INITIAL_ORDER = [];

// ─── Context ──────────────────────────────────────────────────────────────────

const OrderContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const OrderProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState(INITIAL_ORDER);

  // ── Mutations ─────────────────────────────────────────────────────────────

  /**
   * addItem — add a meal item to the order.
   * If the item already exists, increments its quantity (capped at MAX_QTY_PER_ITEM).
   *
   * Expected item shape from MenuScreen / API:
   * {
   *   id:       string,
   *   nameEn:   string,
   *   category: "meal" | "snacks" | "tea_coffee",
   *   isVeg:    boolean
   * }
   *
   * @param {Object} item - Meal item object
   */
  const addItem = useCallback((item) => {
    if (!item?.id) {
      console.warn("[OrderContext] addItem called with invalid item:", item);
      return;
    }

    setOrderItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QTY_PER_ITEM) }
            : i,
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  /**
   * removeItem — remove a meal item from the order entirely.
   * @param {string} itemId
   */
  const removeItem = useCallback((itemId) => {
    setOrderItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  /**
   * updateQty — set an item's quantity directly.
   * Automatically removes the item if quantity reaches 0.
   * @param {string} itemId
   * @param {number} newQty
   */
  const updateQty = useCallback((itemId, newQty) => {
    if (newQty <= 0) {
      setOrderItems((prev) => prev.filter((i) => i.id !== itemId));
      return;
    }

    setOrderItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? { ...i, quantity: Math.min(newQty, MAX_QTY_PER_ITEM) }
          : i,
      ),
    );
  }, []);

  /**
   * clearOrder — wipe all selected items.
   * Called on: session reset, order success, idle timeout.
   */
  const clearOrder = useCallback(() => {
    setOrderItems(INITIAL_ORDER);
  }, []);

  // ── Derived State ─────────────────────────────────────────────────────────

  const totalItemCount = useMemo(
    () => orderItems.reduce((sum, i) => sum + i.quantity, 0),
    [orderItems],
  );

  const hasItems = orderItems.length > 0;

  /**
   * getItemQty — get current quantity of a specific item.
   * Returns 0 if the item is not in the order.
   * @param {string} itemId
   * @returns {number}
   */
  const getItemQty = useCallback(
    (itemId) => orderItems.find((i) => i.id === itemId)?.quantity ?? 0,
    [orderItems],
  );

  // ── Value ─────────────────────────────────────────────────────────────────

  const value = {
    orderItems,
    addItem,
    removeItem,
    updateQty,
    clearOrder,
    totalItemCount,
    hasItems,
    getItemQty,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

OrderProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useOrder — consume OrderContext inside any component.
 * Must be used within <OrderProvider>.
 */
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an <OrderProvider>");
  }
  return context;
};

export default OrderContext;
