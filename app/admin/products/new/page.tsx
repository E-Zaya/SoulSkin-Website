import { redirect } from "next/navigation";

// 新規追加はインライン追加に移行したためリダイレクト
export default function NewProductPage() {
  redirect("/admin/products");
}
