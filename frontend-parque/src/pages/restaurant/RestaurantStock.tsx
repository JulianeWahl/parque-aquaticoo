import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  restockProduct,
  updateProduct,
  deleteProduct,
  createProduct,
  getBrands,
  getCategories,
  createBrand,
} from "../../api/products";
import type { Product, Brand, Category } from "../../types/product";
import { shouldShowStockAlert } from "../../types/product";
import { formatCurrency } from "../../utils/role";
import { useToast } from "../../components/ui/Toast";
import { Modal } from "../../components/ui/Modal";
import { StatCard } from "../../components/ui/StatCard";
import {
  ArrowLeft,
  Package,
  Search,
  RotateCcw,
  Plus,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  Trash2,
  RefreshCw,
  ChefHat,
} from "lucide-react";
import { cn } from "../../utils/cn";
interface ProductFormProps {
  formName: string;
  setFormName: (v: string) => void;
  formPrice: string;
  setFormPrice: (v: string) => void;
  formStock: string;
  setFormStock: (v: string) => void;
  formMinStock: string;
  setFormMinStock: (v: string) => void;
  formNeedsKitchen: boolean;
  setFormNeedsKitchen: (v: boolean) => void;
  formCategoryId: string;
  setFormCategoryId: (v: string) => void;
  formBrandId: string;
  setFormBrandId: (v: string) => void;
  formBrandSearch: string;
  setFormBrandSearch: (v: string) => void;
  categories: Category[];
  brands: Brand[];
  products: Product[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  formName,
  setFormName,
  formPrice,
  setFormPrice,
  formStock,
  setFormStock,
  formMinStock,
  setFormMinStock,
  formNeedsKitchen,
  setFormNeedsKitchen,
  formCategoryId,
  setFormCategoryId,
  formBrandId,
  setFormBrandId,
  formBrandSearch,
  setFormBrandSearch,
  categories,
  brands,
  products,
}) => {
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const nameRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const nameSuggestions =
    formName.length >= 2
      ? products
          .filter((p) => p.name.toLowerCase().includes(formName.toLowerCase()))
          .slice(0, 5)
      : [];
  const brandSuggestions =
    formBrandSearch.length >= 1
      ? brands
          .filter((b) =>
            b.name.toLowerCase().includes(formBrandSearch.toLowerCase()),
          )
          .slice(0, 6)
      : [];

  const applyProductSuggestion = (p: Product) => {
    setFormName(p.name);
    setFormPrice(String(p.price));
    setFormStock(String(p.stock));
    setFormMinStock(String(p.minStock));
    setFormNeedsKitchen(p.needsKitchen ?? false);
    if (p.categoryId) setFormCategoryId(p.categoryId);
    if (p.brandId) {
      setFormBrandId(p.brandId);
      setFormBrandSearch(p.brand?.name ?? "");
    }
    setShowNameSuggestions(false);
  };

  const applyBrandSuggestion = (b: Brand) => {
    setFormBrandId(b.id);
    setFormBrandSearch(b.name);
    setShowBrandSuggestions(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (nameRef.current && !nameRef.current.contains(e.target as Node))
        setShowNameSuggestions(false);
      if (brandRef.current && !brandRef.current.contains(e.target as Node))
        setShowBrandSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const inputCls =
    "w-full bg-surf-50 border border-surf-200 rounded-xl px-4 py-2.5 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 transition-all";

  return (
    <div className="space-y-4">
      <div ref={nameRef} className="relative">
        <label className="text-xs text-ink-400 uppercase tracking-wide mb-1.5 block">
          Nome do Produto *
        </label>
        <input
          value={formName}
          onChange={(e) => {
            setFormName(e.target.value);
            setShowNameSuggestions(true);
          }}
          onFocus={() => setShowNameSuggestions(true)}
          placeholder="Ex: Coca-Cola 350ml"
          autoComplete="off"
          className={inputCls}
        />
        {showNameSuggestions && nameSuggestions.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-surf-200 rounded-xl shadow-xl z-30 overflow-hidden animate-fade-in">
            <p className="text-[10px] text-ink-400 uppercase tracking-widest px-3 py-1.5 border-b border-surf-200">
              Produtos existentes
            </p>
            {nameSuggestions.map((p) => (
              <button
                key={p.id}
                type="button"
                onMouseDown={() => applyProductSuggestion(p)}
                className="w-full text-left px-3 py-2.5 hover:bg-surf-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ink-900 font-medium">{p.name}</p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      {p.brand?.name && `${p.brand.name} · `}
                      {p.category?.name}
                    </p>
                  </div>
                  <span className="text-orange-400 text-sm font-semibold">
                    {formatCurrency(p.price)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-ink-400 uppercase tracking-wide mb-1.5 block">
            Preço (R$) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formPrice}
            onChange={(e) => setFormPrice(e.target.value)}
            placeholder="0,00"
            className="w-full bg-surf-50 border border-surf-200 rounded-xl px-3 py-2.5 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          />
        </div>
        <div>
          <label className="text-xs text-ink-400 uppercase tracking-wide mb-1.5 block">
            Estoque
          </label>
          <input
            type="number"
            min="0"
            value={formStock}
            onChange={(e) => setFormStock(e.target.value)}
            placeholder="0"
            className="w-full bg-surf-50 border border-surf-200 rounded-xl px-3 py-2.5 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          />
        </div>
        <div>
          <label className="text-xs text-ink-400 uppercase tracking-wide mb-1.5 block">
            Mínimo
          </label>
          <input
            type="number"
            min="0"
            value={formMinStock}
            onChange={(e) => setFormMinStock(e.target.value)}
            placeholder="10"
            className="w-full bg-surf-50 border border-surf-200 rounded-xl px-3 py-2.5 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-ink-400 uppercase tracking-wide mb-1.5 block">
            Categoria *
          </label>
          <select
            value={formCategoryId}
            onChange={(e) => setFormCategoryId(e.target.value)}
            className="w-full bg-surf-50 border border-surf-200 rounded-xl px-3 py-2.5 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          >
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div ref={brandRef} className="relative">
          <label className="text-xs text-ink-400 uppercase tracking-wide mb-1.5 block">
            Marca
          </label>
          <input
            value={formBrandSearch}
            onChange={(e) => {
              setFormBrandSearch(e.target.value);
              if (!e.target.value) setFormBrandId("");
              setShowBrandSuggestions(true);
            }}
            onFocus={() => setShowBrandSuggestions(true)}
            placeholder="Pesquisar marca..."
            autoComplete="off"
            className={inputCls}
          />
          {showBrandSuggestions &&
            (brandSuggestions.length > 0 || formBrandSearch.length >= 2) && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-surf-200 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto animate-fade-in">
                {brandSuggestions.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onMouseDown={() => applyBrandSuggestion(b)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm transition-colors",
                      formBrandId === b.id
                        ? "bg-orange-500/10 text-orange-400"
                        : "text-ink-600 hover:bg-surf-50 hover:text-ink-900",
                    )}
                  >
                    {b.name}
                  </button>
                ))}
                {formBrandSearch.length >= 2 &&
                  !brandSuggestions.find(
                    (b) =>
                      b.name.toLowerCase() === formBrandSearch.toLowerCase(),
                  ) && (
                    <button
                      type="button"
                      onMouseDown={async () => {
                        try {
                          const newBrand = await createBrand(
                            formBrandSearch.trim(),
                          );
                          applyBrandSuggestion(newBrand);
                          setShowBrandSuggestions(false);
                        } catch {}
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm text-orange-400 hover:bg-orange-500/10 border-t border-surf-200 flex items-center gap-2"
                    >
                      <span className="text-base font-bold leading-none">
                        +
                      </span>
                      Criar marca "{formBrandSearch}"
                    </button>
                  )}
              </div>
            )}
          {formBrandId && (
            <p className="text-[10px] text-emerald-400 mt-0.5">✓ Selecionado</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setFormNeedsKitchen(!formNeedsKitchen)}
        className={cn(
          "w-full flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all text-left",
          formNeedsKitchen
            ? "border-amber-500/40 bg-amber-500/10"
            : "border-surf-200 bg-surf-50 hover:border-surf-300",
        )}
      >
        <div
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
            formNeedsKitchen
              ? "border-amber-500 bg-amber-500"
              : "border-surf-300",
          )}
        >
          {formNeedsKitchen && (
            <CheckCircle2 className="w-3 h-3 text-ink-900" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-ink-900 flex items-center gap-1.5">
            <ChefHat className="w-3.5 h-3.5 text-amber-400" />
            Precisa de preparo (cozinha)
          </p>
          <p className="text-xs text-ink-400 mt-0.5">
            Combos, lanches, porções. Sem alerta de estoque baixo.
          </p>
        </div>
      </button>
    </div>
  );
};
type ModalType = "restock" | "edit" | "delete" | "add" | null;

export const RestaurantStock: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [filterCat, setFilterCat] = useState("Todos");
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState(10);
  const [restockReason, setRestockReason] = useState("");
  const [restockLoading, setRestockLoading] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formMinStock, setFormMinStock] = useState("10");
  const [formNeedsKitchen, setFormNeedsKitchen] = useState(false);
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formBrandId, setFormBrandId] = useState("");
  const [formBrandSearch, setFormBrandSearch] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      getProducts(),
      getBrands().catch(() => [] as Brand[]),
      getCategories().catch(() => [] as Category[]),
    ])
      .then(([prods, brnds, cats]) => {
        setProducts(prods);
        setBrands(brnds);
        setCategories(cats);
      })
      .catch(() => toast("error", "Erro ao carregar dados"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const catTabs = [
    "Todos",
    ...Array.from(
      new Set(
        products.map((p) => p.category?.name).filter(Boolean) as string[],
      ),
    ),
  ];

  const filtered = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchBrand =
      !searchBrand ||
      (p.brand?.name ?? "").toLowerCase().includes(searchBrand.toLowerCase());
    const matchCat = filterCat === "Todos" || p.category?.name === filterCat;
    return matchName && matchBrand && matchCat;
  });

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.stock > p.minStock).length,
    low: products.filter(
      (p) => shouldShowStockAlert(p) && p.stock > 0 && p.stock <= p.minStock,
    ).length,
    out: products.filter((p) => p.stock === 0).length,
  };

  const resetForm = () => {
    setFormName("");
    setFormPrice("");
    setFormStock("");
    setFormMinStock("10");
    setFormNeedsKitchen(false);
    setFormCategoryId("");
    setFormBrandId("");
    setFormBrandSearch("");
  };

  const openRestock = (p: Product) => {
    setSelected(p);
    setRestockQty(10);
    setRestockReason("");
    setModal("restock");
  };
  const openEdit = (p: Product) => {
    setSelected(p);
    setFormName(p.name);
    setFormPrice(String(p.price));
    setFormStock(String(p.stock));
    setFormMinStock(String(p.minStock));
    setFormNeedsKitchen(p.needsKitchen ?? false);
    setFormCategoryId(p.categoryId ?? "");
    setFormBrandId(p.brandId ?? "");
    setFormBrandSearch(p.brand?.name ?? "");
    setModal("edit");
  };
  const openDelete = (p: Product) => {
    setSelected(p);
    setModal("delete");
  };
  const openAdd = () => {
    setSelected(null);
    resetForm();
    setModal("add");
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const handleRestock = async () => {
    if (!selected) return;
    if (restockQty <= 0) {
      toast("warning", "Quantidade deve ser maior que zero.");
      return;
    }
    setRestockLoading(true);
    try {
      await restockProduct(selected.id, restockQty, restockReason || undefined);
      toast("success", `${selected.name}: +${restockQty} unidades`);
      closeModal();
      load();
    } catch (err: any) {
      toast("error", err?.response?.data?.error ?? "Erro ao repor estoque.");
    } finally {
      setRestockLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      toast("warning", "Nome é obrigatório.");
      return;
    }
    if (!formPrice || Number(formPrice) < 0) {
      toast("warning", "Preço inválido.");
      return;
    }
    if (!formCategoryId) {
      toast("warning", "Selecione uma categoria.");
      return;
    }
    setFormLoading(true);
    const payload: Partial<Product> = {
      name: formName.trim(),
      price: Number(formPrice),
      stock: Number(formStock) || 0,
      minStock: Number(formMinStock) || 0,
      needsKitchen: formNeedsKitchen,
      categoryId: formCategoryId,
      brandId: formBrandId || undefined,
    };
    try {
      if (modal === "edit" && selected) {
        await updateProduct(selected.id, payload);
        toast("success", "Produto atualizado!");
      } else {
        await createProduct(payload);
        toast("success", "Produto criado com sucesso!");
      }
      closeModal();
      load();
    } catch (err: any) {
      toast(
        "error",
        err?.response?.data?.error ??
          err?.response?.data?.message ??
          "Erro ao salvar.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setDeleteLoading(true);
    const removedId = selected.id;
    const removedName = selected.name;
    try {
      await deleteProduct(removedId);
      setProducts((prev) => prev.filter((p) => p.id !== removedId));
      toast("success", `"${removedName}" removido com sucesso.`);
      closeModal();
      load();
    } catch (err: any) {
      toast(
        "error",
        err?.response?.data?.error ??
          err?.response?.data?.message ??
          "Erro ao remover produto.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const stockStatus = (p: Product) => {
    if (p.stock === 0)
      return {
        label: "Sem Estoque",
        badge: "text-red-400 bg-red-500/10 border-red-500/20",
        bar: "bg-red-500",
      };
    if (shouldShowStockAlert(p) && p.stock <= p.minStock)
      return {
        label: "Baixo",
        badge: "text-orange-400 bg-orange-500/10 border-orange-500/20",
        bar: "bg-orange-400",
      };
    return {
      label: "Normal",
      badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      bar: "bg-emerald-400",
    };
  };

  return (
    <div className="h-full overflow-y-auto bg-surf-50 p-5 lg:p-7">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/lanchonete")}
            className="flex items-center gap-1.5 text-ink-500 hover:text-ink-900 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <div className="w-px h-4 bg-surf-200" />
          <Package className="w-5 h-5 text-orange-400" />
          <h1 className="font-display text-xl font-bold text-ink-900">
            Estoque da Lanchonete
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="p-2 rounded-xl text-ink-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-ink-900 text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" /> Novo Produto
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total"
          value={stats.total}
          accent="amber"
          icon={<Package className="w-4 h-4" />}
        />
        <StatCard
          label="Em Estoque"
          value={stats.inStock}
          accent="green"
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
        <StatCard
          label="Estoque Baixo"
          value={stats.low}
          accent={stats.low > 0 ? "amber" : "slate"}
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        <StatCard
          label="Sem Estoque"
          value={stats.out}
          accent={stats.out > 0 ? "red" : "slate"}
        />
      </div>
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto..."
              className="w-52 bg-surf-50 border border-surf-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
              placeholder="Buscar por marca..."
              className="w-48 bg-surf-50 border border-surf-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {catTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                filterCat === cat
                  ? "bg-orange-500 text-ink-900 shadow-md shadow-orange-500/30"
                  : "bg-surf-50 border border-surf-200 text-ink-500 hover:border-orange-500/40 hover:text-orange-400",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {stats.low > 0 && (
        <div className="mb-4 flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />
          <p className="text-orange-300 text-sm">
            <span className="font-bold">{stats.low}</span> produto
            {stats.low > 1 ? "s" : ""} com estoque abaixo do mínimo
          </p>
        </div>
      )}
      {stats.out > 0 && (
        <div className="mb-4 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">
            <span className="font-bold">{stats.out}</span> produto
            {stats.out > 1 ? "s" : ""} sem estoque
          </p>
        </div>
      )}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-52 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="w-12 h-12 text-ink-300 mb-3" />
          <p className="text-ink-400 font-medium">
            {products.length === 0
              ? "Nenhum produto cadastrado ainda"
              : "Nenhum produto encontrado"}
          </p>
          <p className="text-ink-300 text-sm mt-1">
            {products.length === 0
              ? "Clique em 'Novo Produto' para cadastrar"
              : "Tente outro termo de busca ou categoria"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filtered.map((product) => {
            const status = stockStatus(product);
            const showAlert =
              shouldShowStockAlert(product) &&
              product.stock > 0 &&
              product.stock <= product.minStock;
            return (
              <div
                key={product.id}
                className={cn(
                  "bg-white border rounded-2xl p-4 transition-all hover:shadow-lg",
                  product.stock === 0
                    ? "border-red-500/25"
                    : showAlert
                      ? "border-orange-500/25"
                      : "border-surf-200 hover:border-orange-500/20",
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-ink-900 font-semibold text-sm truncate">
                      {product.name}
                    </p>
                    {product.brand && (
                      <p className="text-orange-400/70 text-[11px] mt-0.5 font-medium">
                        {product.brand.name}
                      </p>
                    )}
                    {product.category && !product.brand && (
                      <p className="text-ink-400 text-[11px] mt-0.5">
                        {product.category.name}
                      </p>
                    )}
                    {product.brand && product.category && (
                      <p className="text-ink-300 text-[11px]">
                        {product.category.name}
                      </p>
                    )}
                    {product.needsKitchen && (
                      <p className="text-amber-600 text-[10px] italic">
                        ↳ cozinha
                      </p>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full border ml-2 flex-shrink-0",
                      status.badge,
                    )}
                  >
                    {status.label}
                  </span>
                </div>

                <p className="text-orange-400 font-display font-bold text-lg">
                  {formatCurrency(product.price)}
                </p>

                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-ink-400">
                    <span>Estoque:</span>
                    <span
                      className={cn(
                        "font-semibold",
                        product.stock === 0
                          ? "text-red-400"
                          : showAlert
                            ? "text-orange-400"
                            : "text-ink-600",
                      )}
                    >
                      {product.stock} un
                    </span>
                  </div>
                  <div className="flex justify-between text-ink-400">
                    <span>Mínimo:</span>
                    <span className="text-ink-400">{product.minStock} un</span>
                  </div>
                </div>

                <div className="mt-2.5 h-1.5 bg-surf-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      status.bar,
                    )}
                    style={{
                      width: `${Math.min(100, product.minStock > 0 ? (product.stock / (product.minStock * 3)) * 100 : 100)}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-1.5 mt-3">
                  <button
                    onClick={() => openRestock(product)}
                    className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-semibold hover:bg-orange-500/20 transition-all"
                  >
                    <RotateCcw className="w-3 h-3" /> Repor
                  </button>
                  <button
                    onClick={() => openEdit(product)}
                    className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold hover:bg-blue-500/20 transition-all"
                  >
                    <Pencil className="w-3 h-3" /> Editar
                  </button>
                  <button
                    onClick={() => openDelete(product)}
                    className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-semibold hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-3 h-3" /> Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Modal
        open={modal === "restock"}
        onClose={closeModal}
        title="Repor Estoque"
        size="md"
      >
        {selected && (
          <div className="space-y-5">
            <div className="bg-surf-50 border border-surf-200 rounded-xl p-4">
              <p className="text-xs text-ink-400">Produto</p>
              <p className="text-ink-900 font-semibold mt-0.5">
                {selected.name}
              </p>
              {selected.brand && (
                <p className="text-orange-400/70 text-xs mt-0.5">
                  {selected.brand.name}
                </p>
              )}
              {selected.category && (
                <p className="text-ink-400 text-xs">
                  Categoria: {selected.category.name}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-ink-400 mb-1.5 uppercase tracking-wide">
                  Estoque Atual
                </p>
                <p className="text-3xl font-display font-bold text-emerald-400">
                  {selected.stock}{" "}
                  <span className="text-sm text-ink-400 font-normal">un</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-400 mb-1.5 uppercase tracking-wide">
                  Adicionar
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={restockQty}
                    onChange={(e) =>
                      setRestockQty(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-24 bg-surf-50 border border-orange-500/40 rounded-xl px-3 py-2 text-orange-400 font-display font-bold text-xl focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                  />
                  <button
                    onClick={() => setRestockQty((q) => q + 5)}
                    className="w-9 h-9 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 flex items-center justify-center hover:bg-orange-500/20 font-bold text-sm"
                  >
                    +5
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600">
                  Novo estoque após reposição
                </p>
                <p className="text-3xl font-display font-bold text-emerald-400 mt-0.5">
                  {selected.stock + restockQty}
                </p>
              </div>
              <ChevronUp className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-ink-400 mb-1.5 uppercase tracking-wide">
                Motivo (Opcional)
              </p>
              <input
                value={restockReason}
                onChange={(e) => setRestockReason(e.target.value)}
                placeholder="Ex: Entrada de novo lote"
                className="w-full bg-surf-50 border border-surf-200 rounded-xl px-4 py-2.5 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl bg-surf-200 hover:bg-surf-300 text-ink-600 text-sm font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleRestock}
                disabled={restockLoading}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:bg-surf-200 text-ink-900 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                {restockLoading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Confirmar Reposição
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={modal === "add" || modal === "edit"}
        onClose={closeModal}
        title={modal === "add" ? "Novo Produto" : "Editar Produto"}
        size="md"
      >
        <div className="space-y-5">
          <ProductForm
            formName={formName}
            setFormName={setFormName}
            formPrice={formPrice}
            setFormPrice={setFormPrice}
            formStock={formStock}
            setFormStock={setFormStock}
            formMinStock={formMinStock}
            setFormMinStock={setFormMinStock}
            formNeedsKitchen={formNeedsKitchen}
            setFormNeedsKitchen={setFormNeedsKitchen}
            formCategoryId={formCategoryId}
            setFormCategoryId={setFormCategoryId}
            formBrandId={formBrandId}
            setFormBrandId={setFormBrandId}
            formBrandSearch={formBrandSearch}
            setFormBrandSearch={setFormBrandSearch}
            categories={categories}
            brands={brands}
            products={products}
          />
          <div className="flex gap-3 pt-1">
            <button
              onClick={closeModal}
              className="flex-1 py-2.5 rounded-xl bg-surf-200 hover:bg-surf-300 text-ink-600 text-sm font-medium transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={formLoading}
              className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:bg-surf-200 text-ink-900 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              {formLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {modal === "add" ? "Adicionar Produto" : "Salvar Alterações"}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        open={modal === "delete"}
        onClose={closeModal}
        title="Remover Produto"
        size="sm"
      >
        {selected && (
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
              <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-ink-900 font-semibold text-sm">
                Deseja realmente remover
              </p>
              <p className="text-red-400 font-bold mt-0.5">
                "{selected.name}"?
              </p>
              <p className="text-ink-400 text-xs mt-2">
                Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl bg-surf-200 hover:bg-surf-300 text-ink-600 text-sm font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 disabled:bg-surf-200 text-ink-900 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                {deleteLoading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Confirmar Remoção
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
