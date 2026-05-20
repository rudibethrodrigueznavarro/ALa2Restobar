"use client";

import { useEffect, useState, useRef, useMemo } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  model_3d_url: string | null;
  category_id: number | null;
  category_name: string | null;
  is_available: boolean;
}

interface Category {
  id: number;
  name: string;
}

type ModalMode = null | "create" | "edit" | "view" | "delete";

export default function InventarioAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Modal
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [model3dUrl, setModel3dUrl] = useState("");

  // File uploads
  const [imageUploading, setImageUploading] = useState(false);
  const [modelUploading, setModelUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState<"all" | "available" | "unavailable">("all");

  const fetchData = async () => {
    try {
      const [resProd, resCat] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      if (resProd.ok) setProducts(await resProd.json());
      if (resCat.ok) setCategories(await resCat.json());
    } catch (err) {
      console.error("Error fetching inventory data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setName(""); setPrice(""); setCategoryId("");
    setDescription(""); setImageUrl(""); setModel3dUrl("");
    setSelectedProduct(null);
    setModalMode("create");
  };

  const openEdit = (product: Product) => {
    setName(product.name);
    setPrice(String(product.price));
    setCategoryId(String(product.category_id || ""));
    setDescription(product.description || "");
    setImageUrl(product.image_url || "");
    setModel3dUrl(product.model_3d_url || "");
    setSelectedProduct(product);
    setModalMode("edit");
  };

  const openView = (product: Product) => {
    setSelectedProduct(product);
    setModalMode("view");
  };

  const openDelete = (product: Product) => {
    setSelectedProduct(product);
    setModalMode("delete");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedProduct(null);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "model"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    type === "image" ? setImageUploading(true) : setModelUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        type === "image" ? setImageUrl(data.url) : setModel3dUrl(data.url);
      } else {
        alert(data.error || "Error al subir archivo");
      }
    } catch {
      alert("Error de conexión al subir el archivo");
    } finally {
      type === "image" ? setImageUploading(false) : setModelUploading(false);
    }
  };

  const handleToggleAvailable = async (product: Product) => {
    const updatedStatus = !product.is_available;
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, is_available: updatedStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, is_available: updatedStatus } : p
          )
        );
      } else {
        alert("Error al actualizar la disponibilidad");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      alert("Completa los campos obligatorios (Nombre, Precio, Categoría)");
      return;
    }
    setSaving(true);
    const payload = {
      id: modalMode === "edit" ? selectedProduct?.id : undefined,
      name,
      price: Number(price),
      category_id: Number(categoryId),
      description,
      image_url: imageUrl,
      model_3d_url: model3dUrl || null,
    };
    try {
      const res = await fetch("/api/products", {
        method: modalMode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchData();
        closeModal();
      } else {
        const errData = await res.json();
        alert(errData.error || "Error al guardar el producto");
      }
    } catch {
      alert("Error de red");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products?id=${selectedProduct.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
        closeModal();
      } else {
        alert("Error al eliminar el producto");
      }
    } catch {
      alert("Error de red");
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        filterCategory === "all" || String(p.category_id) === filterCategory;
      const matchAvail =
        filterAvailability === "all" ||
        (filterAvailability === "available" && p.is_available) ||
        (filterAvailability === "unavailable" && !p.is_available);
      return matchSearch && matchCategory && matchAvail;
    });
  }, [products, searchQuery, filterCategory, filterAvailability]);

  const hasActiveFilters =
    searchQuery || filterCategory !== "all" || filterAvailability !== "all";

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-md">
        <span className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
        <span className="font-body-md text-on-surface-variant">Cargando inventario...</span>
      </div>
    );
  }

  return (
    <>
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={(e) => handleFileUpload(e, "image")}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={modelInputRef}
        onChange={(e) => handleFileUpload(e, "model")}
        accept=".glb,.gltf"
        className="hidden"
      />

      {/* ── MODAL BACKDROP ─────────────────────────────────────── */}
      {modalMode !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          {/* ── CREATE / EDIT MODAL ──────────────────────────────── */}
          {(modalMode === "create" || modalMode === "edit") && (
            <div className="bg-surface-container-high border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-lg py-md border-b border-white/10 sticky top-0 bg-surface-container-high z-10 rounded-t-2xl">
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[22px]">
                      {modalMode === "edit" ? "edit_square" : "add_circle"}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-h3 text-[17px] text-on-surface font-semibold leading-tight">
                      {modalMode === "edit" ? "Editar Producto" : "Nuevo Producto"}
                    </h2>
                    <p className="font-body-md text-[12px] text-on-surface-variant">
                      {modalMode === "edit"
                        ? `Editando: ${selectedProduct?.name}`
                        : "Completa los campos para agregar"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-surface/60 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface transition-all border border-white/10 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-lg py-md flex flex-col gap-md">
                {/* Nombre */}
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
                    Nombre del plato <span className="text-primary">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-sm py-[10px] text-on-surface font-body-md placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors"
                    placeholder="Ej: Bandeja Paisa"
                    type="text"
                    required
                  />
                </div>

                {/* Precio + Categoría en grid */}
                <div className="grid grid-cols-2 gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
                      Precio (COP) <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-sm top-1/2 -translate-y-1/2 text-primary font-semibold text-[15px]">$</span>
                      <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-sm py-[10px] pl-7 text-on-surface font-semibold outline-none focus:border-primary transition-colors"
                        placeholder="0"
                        type="number"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
                      Categoría <span className="text-primary">*</span>
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-surface/50 border border-white/10 rounded-xl px-sm py-[10px] text-on-surface font-body-md outline-none focus:border-primary transition-colors"
                      required
                    >
                      <option value="" disabled>Seleccionar</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Descripción */}
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
                    Descripción
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-sm py-[10px] text-on-surface font-body-md placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Ingredientes o detalles del plato..."
                    rows={3}
                  />
                </div>

                {/* Multimedia */}
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
                    Archivos Multimedia
                  </label>
                  <div className="grid grid-cols-2 gap-md">
                    {/* Imagen */}
                    <div className="flex flex-col gap-xs">
                      <span className="font-label-caps text-[10px] text-on-surface-variant/60 px-1">
                        Imagen del plato
                      </span>
                      <div
                        onClick={() => imageInputRef.current?.click()}
                        className="border border-dashed border-white/20 rounded-xl h-32 flex flex-col items-center justify-center gap-xs bg-surface/30 hover:bg-surface/50 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden"
                      >
                        {imageUrl ? (
                          <>
                            <img
                              src={imageUrl}
                              className="w-full h-full object-cover"
                              alt="Preview"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-xs">
                              <span className="material-symbols-outlined text-white text-[22px]">edit</span>
                              <span className="font-label-caps text-[9px] text-white">Cambiar</span>
                            </div>
                          </>
                        ) : imageUploading ? (
                          <span className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[26px] text-on-surface-variant group-hover:text-primary transition-colors">image</span>
                            <span className="font-label-caps text-[10px] text-on-surface-variant group-hover:text-primary transition-colors">Subir Foto</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Modelo 3D */}
                    <div className="flex flex-col gap-xs">
                      <span className="font-label-caps text-[10px] text-primary/70 px-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">view_in_ar</span>
                        Modelo 3D (GLB)
                      </span>
                      <div
                        onClick={() => modelInputRef.current?.click()}
                        className="border border-dashed border-primary/20 rounded-xl h-32 flex flex-col items-center justify-center gap-xs bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-all cursor-pointer group relative overflow-hidden"
                      >
                        {model3dUrl ? (
                          <div className="flex flex-col items-center justify-center text-center p-2 gap-1">
                            <span className="material-symbols-outlined text-[32px] text-primary">deployed_code</span>
                            <span className="font-label-caps text-[10px] text-primary">Modelo cargado</span>
                            <span className="font-label-caps text-[9px] text-primary/50">Clic para cambiar</span>
                          </div>
                        ) : modelUploading ? (
                          <span className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[26px] text-primary group-hover:scale-110 transition-transform">deployed_code</span>
                            <span className="font-label-caps text-[10px] text-primary">Subir GLB/GLTF</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-sm pt-xs pb-xs">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-surface/50 border border-white/10 text-on-surface-variant font-body-md py-[10px] rounded-xl hover:border-white/20 hover:text-on-surface transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-primary-container text-white font-body-md py-[10px] rounded-xl shadow-[0_0_15px_rgba(255,83,91,0.2)] hover:shadow-[0_0_25px_rgba(255,83,91,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-xs cursor-pointer disabled:opacity-60"
                  >
                    {saving ? (
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">save</span>
                    )}
                    {saving
                      ? "Guardando..."
                      : modalMode === "edit"
                      ? "Guardar Cambios"
                      : "Crear Producto"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── VIEW MODAL ───────────────────────────────────────── */}
          {modalMode === "view" && selectedProduct && (
            <div className="bg-surface-container-high border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
              {/* Image hero */}
              <div className="relative h-52 bg-surface-variant overflow-hidden">
                <img
                  src={selectedProduct.image_url || "/placeholder-food.png"}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <button
                  onClick={closeModal}
                  className="absolute top-sm right-sm w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all cursor-pointer border border-white/10"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
                <div className="absolute bottom-sm left-md flex items-center gap-xs">
                  <span
                    className={`font-label-caps text-[10px] px-2 py-1 rounded-full border ${
                      selectedProduct.is_available
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }`}
                  >
                    {selectedProduct.is_available ? "Disponible" : "Agotado"}
                  </span>
                  {selectedProduct.model_3d_url && (
                    <span className="font-label-caps text-[10px] px-2 py-1 rounded-full border bg-primary/20 text-primary border-primary/30 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[11px]">view_in_ar</span> 3D
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-lg flex flex-col gap-md">
                {/* Nombre y precio */}
                <div className="flex items-start justify-between gap-md">
                  <div>
                    <h2 className="font-h3 text-[20px] text-on-surface font-bold leading-tight">
                      {selectedProduct.name}
                    </h2>
                    <span className="font-label-caps text-[11px] bg-primary-container/20 text-primary-container px-2 py-0.5 rounded-full inline-block mt-xs">
                      {selectedProduct.category_name || "Sin Categoría"}
                    </span>
                  </div>
                  <span className="font-h3 text-[22px] text-primary font-bold whitespace-nowrap">
                    {selectedProduct.price.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>

                {/* Descripción */}
                {selectedProduct.description && (
                  <div className="bg-surface/40 rounded-xl p-sm border border-white/5">
                    <p className="font-body-md text-[14px] text-on-surface-variant leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}

                {/* Meta chips */}
                <div className="grid grid-cols-2 gap-sm">
                  <div className="bg-surface/30 rounded-xl p-sm border border-white/5 flex items-center gap-sm">
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">image</span>
                    <div>
                      <p className="font-label-caps text-[10px] text-on-surface-variant">Imagen</p>
                      <p className="font-body-md text-[12px] text-on-surface">
                        {selectedProduct.image_url ? "Disponible" : "Sin imagen"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-surface/30 rounded-xl p-sm border border-white/5 flex items-center gap-sm">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        selectedProduct.model_3d_url ? "text-primary" : "text-on-surface-variant"
                      }`}
                    >
                      {selectedProduct.model_3d_url ? "deployed_code" : "3d_rotation"}
                    </span>
                    <div>
                      <p className="font-label-caps text-[10px] text-on-surface-variant">Modelo 3D</p>
                      <p className="font-body-md text-[12px] text-on-surface">
                        {selectedProduct.model_3d_url ? "Disponible" : "Sin modelo"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-sm">
                  <button
                    onClick={() => openEdit(selectedProduct)}
                    className="flex-1 bg-surface/50 border border-white/10 text-on-surface font-body-md py-[10px] rounded-xl hover:border-primary/40 hover:text-primary transition-all cursor-pointer flex items-center justify-center gap-xs"
                  >
                    <span className="material-symbols-outlined text-[17px]">edit</span>
                    Editar
                  </button>
                  <button
                    onClick={() => openDelete(selectedProduct)}
                    className="flex-1 bg-surface/50 border border-white/10 text-on-surface font-body-md py-[10px] rounded-xl hover:border-error/40 hover:text-error transition-all cursor-pointer flex items-center justify-center gap-xs"
                  >
                    <span className="material-symbols-outlined text-[17px]">delete</span>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── DELETE CONFIRMATION MODAL ────────────────────────── */}
          {modalMode === "delete" && selectedProduct && (
            <div className="bg-surface-container-high border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-lg flex flex-col gap-lg">
              <div className="flex flex-col items-center text-center gap-md">
                <div className="w-16 h-16 rounded-full bg-error/10 border border-error/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-error text-[34px]">delete_forever</span>
                </div>
                <div>
                  <h2 className="font-h3 text-[20px] text-on-surface font-bold">Eliminar Producto</h2>
                  <p className="font-body-md text-[14px] text-on-surface-variant mt-xs leading-relaxed">
                    ¿Seguro que deseas eliminar{" "}
                    <span className="text-on-surface font-semibold">
                      &ldquo;{selectedProduct.name}&rdquo;
                    </span>
                    ?
                  </p>
                  <p className="font-label-caps text-[11px] text-error/70 mt-sm">
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>

              <div className="flex gap-sm">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-surface/50 border border-white/10 text-on-surface-variant font-body-md py-[10px] rounded-xl hover:border-white/20 hover:text-on-surface transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-error/80 hover:bg-error text-white font-body-md py-[10px] rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-xs cursor-pointer disabled:opacity-60"
                >
                  {deleting ? (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  )}
                  {deleting ? "Eliminando..." : "Sí, Eliminar"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <div className="flex flex-col gap-lg w-full">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-md">
          <div>
            <h1 className="font-h3 text-h3 text-on-surface">Inventario de Productos</h1>
            <p className="font-body-md text-[13px] text-on-surface-variant">
              Gestión de platos del menú
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-xs bg-primary-container text-white font-body-md px-md py-sm rounded-xl shadow-[0_0_15px_rgba(255,83,91,0.2)] hover:shadow-[0_0_25px_rgba(255,83,91,0.5)] active:scale-[0.98] transition-all cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="hidden sm:inline">Nuevo Producto</span>
          </button>
        </div>

        {/* Filters panel */}
        <div className="glass-panel rounded-xl border border-white/10 p-md flex flex-col gap-md">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-sm top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface/50 border border-white/10 rounded-xl py-[10px] pl-10 pr-sm text-on-surface font-body-md placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors"
              placeholder="Buscar por nombre o descripción..."
              type="search"
            />
          </div>

          {/* Filter chips row */}
          <div className="flex flex-wrap items-center gap-xs">
            {/* Categorías */}
            <button
              onClick={() => setFilterCategory("all")}
              className={`font-label-caps text-[11px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                filterCategory === "all"
                  ? "bg-primary/20 text-primary border-primary/40"
                  : "bg-surface/30 text-on-surface-variant border-white/10 hover:border-white/20"
              }`}
            >
              Todas las categorías
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(String(cat.id))}
                className={`font-label-caps text-[11px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  filterCategory === String(cat.id)
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "bg-surface/30 text-on-surface-variant border-white/10 hover:border-white/20"
                }`}
              >
                {cat.name}
              </button>
            ))}

            {/* Divider */}
            <span className="w-px h-4 bg-white/10 mx-xs hidden sm:block" />

            {/* Disponibilidad */}
            {(["all", "available", "unavailable"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setFilterAvailability(v)}
                className={`font-label-caps text-[11px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  filterAvailability === v
                    ? v === "unavailable"
                      ? "bg-error/20 text-error border-error/40"
                      : v === "available"
                      ? "bg-green-500/20 text-green-400 border-green-500/40"
                      : "bg-primary/20 text-primary border-primary/40"
                    : "bg-surface/30 text-on-surface-variant border-white/10 hover:border-white/20"
                }`}
              >
                {v === "all" ? "Todo" : v === "available" ? "Disponible" : "Agotado"}
              </button>
            ))}
          </div>
        </div>

        {/* Results bar */}
        <div className="flex items-center justify-between px-xs">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "artículo" : "artículos"}
            {filteredProducts.length !== products.length &&
              ` de ${products.length}`}
          </span>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterCategory("all");
                setFilterAvailability("all");
              }}
              className="font-label-caps text-[11px] text-primary hover:text-primary/80 cursor-pointer flex items-center gap-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Product grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-surface/40 border border-white/5 rounded-xl p-xl text-center flex flex-col items-center gap-md">
            <span className="material-symbols-outlined text-[52px] text-on-surface-variant/25">
              {products.length === 0 ? "inventory_2" : "search_off"}
            </span>
            <span className="font-body-md text-on-surface-variant">
              {products.length === 0
                ? "No hay productos registrados en el menú."
                : "No se encontraron productos con los filtros aplicados."}
            </span>
            {products.length === 0 && (
              <button
                onClick={openCreate}
                className="flex items-center gap-xs bg-primary-container text-white font-body-md px-md py-sm rounded-xl shadow-[0_0_15px_rgba(255,83,91,0.2)] hover:shadow-[0_0_25px_rgba(255,83,91,0.5)] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Agregar primer producto
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-md">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`glass-panel rounded-xl overflow-hidden border border-white/5 group transition-all hover:border-white/15 hover:shadow-lg flex flex-col ${
                  !product.is_available ? "opacity-60" : ""
                }`}
              >
                {/* Image */}
                <div
                  className="relative h-44 bg-surface-variant overflow-hidden cursor-pointer"
                  onClick={() => openView(product)}
                >
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={product.image_url || "/placeholder-food.png"}
                    alt={product.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Top badges */}
                  <div className="absolute top-sm right-sm flex flex-col items-end gap-xs">
                    {!product.is_available && (
                      <span className="font-label-caps text-[9px] bg-error/80 text-white px-2 py-0.5 rounded-full">
                        Agotado
                      </span>
                    )}
                    {product.model_3d_url && (
                      <span className="font-label-caps text-[9px] bg-primary/70 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[9px]">view_in_ar</span> 3D
                      </span>
                    )}
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-sm left-sm right-sm flex items-end justify-between">
                    <span className="font-label-caps text-[9px] bg-black/60 backdrop-blur-sm text-white/90 px-2 py-0.5 rounded-full">
                      {product.category_name || "Sin Categoría"}
                    </span>
                    <span className="font-h3 text-[16px] text-white font-bold drop-shadow-lg">
                      {product.price.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-md flex flex-col gap-xs flex-1">
                  <h3 className="font-h3 text-[15px] text-on-surface font-semibold leading-tight">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="font-body-md text-[12px] text-on-surface-variant line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Action bar */}
                <div className="px-md pb-md flex items-center gap-xs">
                  <button
                    onClick={() => openView(product)}
                    title="Ver detalles"
                    className="flex-1 flex items-center justify-center gap-xs bg-surface/50 border border-white/10 text-on-surface-variant hover:text-on-surface hover:border-white/20 rounded-lg py-[7px] font-label-caps text-[11px] transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                    Ver
                  </button>
                  <button
                    onClick={() => openEdit(product)}
                    title="Editar"
                    className="flex-1 flex items-center justify-center gap-xs bg-surface/50 border border-white/10 text-on-surface-variant hover:text-primary hover:border-primary/30 rounded-lg py-[7px] font-label-caps text-[11px] transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleAvailable(product)}
                    title={product.is_available ? "Marcar agotado" : "Marcar disponible"}
                    className="w-8 h-[33px] flex items-center justify-center bg-surface/50 border border-white/10 text-on-surface-variant hover:text-primary hover:border-primary/30 rounded-lg transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {product.is_available ? "toggle_on" : "toggle_off"}
                    </span>
                  </button>
                  <button
                    onClick={() => openDelete(product)}
                    title="Eliminar"
                    className="w-8 h-[33px] flex items-center justify-center bg-surface/50 border border-white/10 text-on-surface-variant hover:text-error hover:border-error/30 rounded-lg transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export const dynamic = "force-dynamic";
