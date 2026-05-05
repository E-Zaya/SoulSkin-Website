import { redirect } from "next/navigation";

// 個別編集ページはインライン編集に移行したためリダイレクト
export default function EditProductPage() {
  redirect("/admin/products");
}
