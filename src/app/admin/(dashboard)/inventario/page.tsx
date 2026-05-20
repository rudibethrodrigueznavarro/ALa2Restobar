"use client";

import { useEffect, useState, useRef } from "react";

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

export default function InventarioAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del Formulario
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [model3dUrl, setModel3dUrl] = useState("");
  
  // Habilitar spinners de carga para archivos
  const [imageUploading, setImageUploading] = useState(false);
  const [modelUploading, setModelUploading] = useState(false);

  // Referencias a inputs de archivos ocultos
  const imageInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const [resProd, resCat] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);

      if (resProd.ok) {
        const prodData = await resProd.json();
        setProducts(prodData);
      }
      if (resCat.ok) {
        const catData = await resCat.json();
        setCategories(catData);
      }
    } catch (err) {
      console.error("Error fetching inventory data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "model") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "image") {
      setImageUploading(true);
    } else {
      setModelUploading(true);
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        if (type === "image") {
          setImageUrl(data.url);
        } else {
          setModel3dUrl(data.url);
        }
      } else {
        alert(data.error || "Error al subir archivo");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al subir el archivo");
    } finally {
      if (type === "image") {
        setImageUploading(false);
      } else {
        setModelUploading(false);
      }
    }
  };

  const handleToggleAvailable = async (product: Product) => {
    try {
      const updatedStatus = !product.is_available;
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          is_available: updatedStatus,
        }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, is_available: updatedStatus } : p))
        );
      } else {
        alert("Error al actualizar la disponibilidad");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (product: Product) => {
    setIsEditing(true);
    setEditId(product.id);
    setName(product.name);
    setPrice(String(product.price));
    setCategoryId(String(product.category_id || ""));
    setDescription(product.description);
    setImageUrl(product.image_url || "");
    setModel3dUrl(product.model_3d_url || "");
    
    // Desplazarse suavemente al formulario en móvil
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setName("");
    setPrice("");
    setCategoryId("");
    setDescription("");
    setImageUrl("");
    setModel3dUrl("");
  };

  const handleDeleteClick = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto permanentemente?")) {
      try {
        const res = await fetch(`/api/products?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
          if (isEditing && editId === id) {
            handleCancelEdit();
          }
        } else {
          alert("Error al eliminar el producto");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      alert("Por favor completa los campos obligatorios (Nombre, Precio, Categoría)");
      return;
    }

    const payload = {
      id: editId,
      name,
      price: Number(price),
      category_id: Number(categoryId),
      description,
      image_url: imageUrl,
      model_3d_url: model3dUrl || null,
    };

    try {
      const url = "/api/products";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchData();
        handleCancelEdit();
      } else {
        const errData = await res.json();
        alert(errData.error || "Error al guardar el producto");
      }
    } catch (err) {
      console.error(err);
      alert("Error de red");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-md">
        <span className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></span>
        <span className="font-body-md text-on-surface-variant">Cargando inventario...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl w-full">
      {/* Inputs de archivos ocultos */}
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

      {/* Lista de Productos (2/3 de pantalla en desktop) */}
      <div className="lg:col-span-2 flex flex-col gap-md">
        <div className="flex justify-between items-end mb-sm">
          <div>
            <h2 className="font-h3 text-h3 text-on-surface">Inventario de Productos</h2>
            <p className="font-body-md text-[13px] text-on-surface-variant">Lista de platos del menú</p>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            {products.length} {products.length === 1 ? "Artículo" : "Artículos"}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="bg-surface/40 border border-white/5 rounded-xl p-lg text-center font-body-md text-on-surface-variant">
            No hay productos registrados en el menú.
          </div>
        ) : (
          <div className="flex flex-col gap-sm">
            {products.map((product) => (
              <div
                key={product.id}
                className={`glass-panel rounded-xl p-sm flex items-center gap-md relative overflow-hidden group transition-all ${
                  product.is_available ? "" : "opacity-50"
                }`}
              >
                {/* Image Preview */}
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-variant relative border border-white/5">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={product.image_url || "/placeholder-food.png"}
                    alt={product.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop";
                    }}
                  />
                  {!product.is_available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="font-label-caps text-[9px] text-white bg-red-600/80 px-2 py-0.5 rounded">
                        Agotado
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-xs">
                    <span className="font-label-caps text-[8px] bg-primary-container/20 text-primary-container px-2 py-0.5 rounded-full">
                      {product.category_name || "Sin Categoría"}
                    </span>
                    {product.model_3d_url && (
                      <span className="font-label-caps text-[8px] bg-secondary-container/20 text-secondary px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[10px]">view_in_ar</span> 3D
                      </span>
                    )}
                  </div>
                  <h3 className="font-h3 text-[16px] text-on-surface truncate font-semibold">
                    {product.name}
                  </h3>
                  <p className="font-body-md text-[14px] text-primary font-bold">
                    {product.price.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-sm shrink-0">
                  {/* Editar */}
                  <button
                    onClick={() => handleEditClick(product)}
                    title="Editar producto"
                    className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface hover:text-primary hover:shadow-[0_0_10px_rgba(255,83,91,0.3)] transition-all border border-white/5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>

                  {/* Visibilidad */}
                  <button
                    onClick={() => handleToggleAvailable(product)}
                    title={product.is_available ? "Marcar como Agotado" : "Marcar como Disponible"}
                    className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface hover:text-primary hover:shadow-[0_0_10px_rgba(255,83,91,0.3)] transition-all border border-white/5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {product.is_available ? "visibility" : "visibility_off"}
                    </span>
                  </button>

                  {/* Eliminar */}
                  <button
                    onClick={() => handleDeleteClick(product.id)}
                    title="Eliminar producto"
                    className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface hover:text-error hover:shadow-[0_0_10px_rgba(255,83,91,0.3)] transition-all border border-white/5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulario de Carga/Edición (1/3 de pantalla) */}
      <div className="lg:col-span-1">
        <section className="glass-panel rounded-xl p-md flex flex-col gap-lg sticky top-20 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary text-[24px]">
                {isEditing ? "edit_square" : "add_box"}
              </span>
              <h2 className="font-h3 text-[18px] text-on-surface font-semibold">
                {isEditing ? "Editar Producto" : "Nuevo Producto"}
              </h2>
            </div>
            {isEditing && (
              <button
                onClick={handleCancelEdit}
                className="font-label-caps text-[10px] text-on-surface-variant hover:text-primary cursor-pointer"
              >
                Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-md">
            {/* Nombre */}
            <div className="flex flex-col gap-xs input-glow rounded-lg">
              <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
                Nombre del plato *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors"
                placeholder="Nombre del producto"
                type="text"
                required
              />
            </div>

            {/* Precio */}
            <div className="flex flex-col gap-xs input-glow rounded-lg">
              <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
                Precio (COP) *
              </label>
              <div className="relative">
                <span className="absolute left-sm top-1/2 -translate-y-1/2 text-primary font-h3 font-semibold">$</span>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm pl-7 text-on-surface font-semibold outline-none focus:border-primary transition-colors"
                  placeholder="0"
                  type="number"
                  required
                />
              </div>
            </div>

            {/* Categoría */}
            <div className="flex flex-col gap-xs input-glow rounded-lg">
              <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
                Categoría *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md outline-none focus:border-primary transition-colors"
                required
              >
                <option value="" disabled>
                  Seleccionar Categoría
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-xs input-glow rounded-lg">
              <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors resize-none"
                placeholder="Ingredientes o detalles..."
                rows={3}
              ></textarea>
            </div>

            {/* Media Upload Grid */}
            <div className="grid grid-cols-2 gap-md mt-xs">
              {/* Image Upload */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant px-1">Imagen</label>
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border border-dashed border-white/20 rounded-lg h-24 flex flex-col items-center justify-center gap-xs bg-surface/30 hover:bg-surface/50 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden"
                >
                  {imageUrl ? (
                    <img src={imageUrl} className="w-full h-full object-cover" alt="Subido" />
                  ) : imageUploading ? (
                    <span className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">
                        image
                      </span>
                      <span className="font-label-caps text-[8px] text-on-surface-variant group-hover:text-primary transition-colors">
                        Subir Foto
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* 3D Upload */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-caps text-label-caps text-primary px-1 flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">view_in_ar</span> 3D Asset
                </label>
                <div
                  onClick={() => modelInputRef.current?.click()}
                  className="border border-dashed border-primary/20 rounded-lg h-24 flex flex-col items-center justify-center gap-xs bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all cursor-pointer group relative overflow-hidden"
                >
                  {model3dUrl ? (
                    <div className="flex flex-col items-center justify-center text-center p-1">
                      <span className="material-symbols-outlined text-[20px] text-primary">deployed_code</span>
                      <span className="font-label-caps text-[7px] text-primary truncate max-w-full">Subido!</span>
                    </div>
                  ) : modelUploading ? (
                    <span className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px] text-primary">deployed_code</span>
                      <span className="font-label-caps text-[8px] text-primary text-center">
                        Modelo GLB
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="mt-sm w-full bg-primary-container text-white font-h3 text-body-md py-md rounded-lg shadow-[0_0_15px_rgba(255,83,91,0.2)] hover:shadow-[0_0_25px_rgba(255,83,91,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-sm cursor-pointer"
            >
              <span className="material-symbols-outlined">save</span>
              {isEditing ? "Guardar Cambios" : "Guardar Producto"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
export const runtime = "nodejs";
