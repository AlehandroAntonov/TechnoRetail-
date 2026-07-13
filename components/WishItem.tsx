"use client";
// *********************
// Role of the component: Single row in the wishlist table
// Name of the component: WishItem.tsx
// Component call: <WishItem id={..} title={..} price={..} image={..} slug={..} stockAvailabillity={..} />
// Output: one <tr> with product image, title, stock status and a remove button
// *********************
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { FaRegCircleXmark } from "react-icons/fa6";
import { useSession } from "next-auth/react";

interface WishItemProps {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailabillity: number;
}

const WishItem = ({
  id,
  title,
  price,
  image,
  slug,
  stockAvailabillity,
}: WishItemProps) => {
  const { data: session } = useSession();
  const { removeFromWishlist } = useWishlistStore();

  const openProduct = () => {
    // keep clicks on the title/image simple – they are wrapped in <Link> below
  };

  const handleRemove = async () => {
    // Remove from the local store first so the UI updates immediately.
    removeFromWishlist(id);
    toast.success("Product removed from the wishlist");

    // Best-effort sync with the backend. The /api/wishlist route is optional
    // (currently disabled in server/app.js), so a failure here must not break the UI.
    try {
      if (session?.user?.email) {
        const userResponse = await apiClient.get(
          `/api/users/email/${session.user.email}`,
          { cache: "no-store" }
        );
        const user = await userResponse.json();
        if (user?.id) {
          await apiClient.delete(`/api/wishlist/${user.id}/${id}`);
        }
      }
    } catch (error) {
      // Swallow – the item is already gone from the local wishlist.
    }
  };

  return (
    <tr className="hover:bg-gray-100">
      <th></th>
      <td>
        <Link href={`/product/${slug}`} onClick={openProduct}>
          <Image
            src={image ? `/${image}` : "/product_placeholder.jpg"}
            width={50}
            height={50}
            className="w-auto h-auto"
            alt={title}
          />
        </Link>
      </td>
      <td>
        <Link
          href={`/product/${slug}`}
          className="text-lg font-bold text-black hover:text-blue-600"
        >
          {title}
        </Link>
      </td>
      <td>
        {stockAvailabillity > 0 ? (
          <span className="text-success font-semibold">In stock</span>
        ) : (
          <span className="text-error font-semibold">Out of stock</span>
        )}
      </td>
      <td>
        <button
          type="button"
          onClick={handleRemove}
          aria-label="Remove from wishlist"
          className="text-xl text-red-600 hover:text-red-400 cursor-pointer inline-flex items-center gap-1"
        >
          <FaRegCircleXmark />
          <span className="text-sm">remove</span>
        </button>
      </td>
    </tr>
  );
};

export default WishItem;
