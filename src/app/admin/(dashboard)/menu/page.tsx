"use client";

import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Product {
  id: number;
  category_id: number | null;
}

export default function CategoriasAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchData = async () => {
    try {
      const [resCat, resProd] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/products"),
      ]);

      if (resCat.ok) {
        const catData = await resCat.json();
        setCategories(catData);
      }
      if (resProd.ok) {
        const prodData = await resProd.json();
        setProducts(prodData);
      }
    } catch (err) {
      console.error("Error fetching categories data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProductCount = (catId: number) => {
    return products.filter((p) => p.category_id === catId).length;
  };

  const handleEditClick = (cat: Category) => {
    setIsEditing(true);
    setEditId(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setName("");
    setDescription("");
  };

  const handleDeleteClick = async (id: number) => {
    const prodCount = getProductCount(id);
    const msg = prodCount > 0 
      ? `Esta categoría tiene ${prodCount} producto(s) asociado(s). Si la eliminas, estos productos se quedarán sin categoría. ¿Deseas continuar?`
      : "¿Estás seguro de que deseas eliminar esta categoría?";

    if (confirm(msg)) {
      try {
        const res = await fetch(`/api/categories?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setCategories((prev) => prev.filter((c) => c.id !== id));
          if (isEditing && editId === id) {
            handleCancelEdit();
          }
        } else {
          alert("Error al eliminar la categoría");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert("El nombre de la categoría es requerido");
      return;
    }

    const payload = {
      id: editId,
      name,
      description,
    };

    try {
      const url = "/api/categories";
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
        alert(errData.error || "Error al guardar la categoría");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-md">
        <span className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></span>
        <span className="font-body-md text-on-surface-variant">Cargando categorías...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl w-full">
      {/* Listado (2/3) */}
      <div className="lg:col-span-2 flex flex-col gap-md">
        <div className="flex justify-between items-end mb-sm">
          <div>
            <h2 className="font-h3 text-h3 text-on-surface font-semibold">Categorías de Menú</h2>
            <p className="font-body-md text-[13px] text-on-surface-variant">Organiza y agrupa tus platos</p>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            {categories.length} {categories.length === 1 ? "Categoría" : "Categorías"}
          </span>
        </div>

        {categories.length === 0 ? (
          <div className="bg-surface/40 border border-white/5 rounded-xl p-lg text-center font-body-md text-on-surface-variant">
            No hay categorías creadas aún.
          </div>
        ) : (
          <div className="flex flex-col gap-sm">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="glass-panel rounded-xl p-md flex items-center justify-between border border-white/5 hover:border-white/10 transition-colors"
              >
                <div>
                  <h3 className="font-h3 text-[16px] text-on-surface font-semibold flex items-center gap-sm">
                    {cat.name}
                    <span className="font-label-caps text-[8px] bg-primary/20 text-primary px-2.5 py-0.5 rounded-full">
                      {getProductCount(cat.id)} {getProductCount(cat.id) === 1 ? "plato" : "platos"}
                    </span>
                  </h3>
                  {cat.description && (
                    <p className="font-body-md text-[13px] text-on-surface-variant mt-1 max-w-lg">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-sm">
                  <button
                    onClick={() => handleEditClick(cat)}
                    title="Editar categoría"
                    className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface hover:text-primary border border-white/5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(cat.id)}
                    title="Eliminar categoría"
                    className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface hover:text-error border border-white/5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulario (1/3) */}
      <div className="lg:col-span-1">
        <section className="glass-panel rounded-xl p-md flex flex-col gap-lg sticky top-20 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary text-[24px]">
                {isEditing ? "edit_square" : "add_box"}
              </span>
              <h2 className="font-h3 text-[18px] text-on-surface font-semibold">
                {isEditing ? "Editar Categoría" : "Nueva Categoría"}
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
                Nombre de la categoría *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors"
                placeholder="Ej. Hamburguesas, Bebidas"
                type="text"
                required
              />
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
                placeholder="Breve descripción del grupo de platos..."
                rows={4}
              ></textarea>
            </div>

            {/* Guardar */}
            <button
              type="submit"
              className="mt-sm w-full bg-primary-container text-white font-h3 text-body-md py-md rounded-lg shadow-[0_0_15px_rgba(255,83,91,0.2)] hover:shadow-[0_0_25px_rgba(255,83,91,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-sm cursor-pointer"
            >
              <span className="material-symbols-outlined">save</span>
              {isEditing ? "Guardar Cambios" : "Crear Categoría"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
export const runtime = "nodejs";
