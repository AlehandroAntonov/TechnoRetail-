"use client";
// *********************
// Role of the component: Promo code input on the cart page (SCRUM-5)
// Component call: <PromoCodeInput />
// Output: input + "Apply" button; applies a discount to the order via /api/promo/apply
// *********************
import { useProductStore } from "@/app/_zustand/store";
import apiClient from "@/lib/api";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PromoCodeInput = () => {
  const { total, promo, applyPromo, removePromo } = useProductStore();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      toast.error("Please enter a promo code");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/api/promo/apply", {
        code: trimmed,
        orderTotal: total,
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        toast.error(data.error || "Invalid promo code");
        return;
      }

      applyPromo({
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        discount: data.discount,
      });
      toast.success(`Promo code "${data.code}" applied!`);
      setCode("");
    } catch (error) {
      toast.error("Could not apply promo code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    removePromo();
    toast.success("Promo code removed");
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      {promo ? (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Promo <span className="font-semibold">{promo.code}</span> applied
            {promo.discountType === "percentage" && (
              <span> ({promo.discountValue}% off)</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm text-red-600 hover:text-red-400"
          >
            Remove
          </button>
        </div>
      ) : (
        <div>
          <label
            htmlFor="promo-code"
            className="block text-sm text-gray-600 mb-1"
          >
            Promo code
          </label>
          <div className="flex gap-x-2">
            <input
              id="promo-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              disabled={loading}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={handleApply}
              disabled={loading}
              className="whitespace-nowrap rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "..." : "Apply"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodeInput;
