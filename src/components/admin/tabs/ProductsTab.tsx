import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Star, 
  Check, 
  AlertCircle,
  Eye,
  Tag,
  Leaf
} from 'lucide-react';
import { Product, Category, Occasion } from '../../../types/admin';
import { supabaseStore } from '../../../services/supabaseService';
import { ProductEditorModal } from '../ProductEditorModal';

interface ProductsTabProps {
  products: Product[];
  categories: Category[];
  occasions: Occasion[];
  tenantId: string;
  onRefresh: () => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  categories,
  occasions,
  tenantId,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || p.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleToggleStock = (product: Product, newStatus: Product['stock_status']) => {
    supabaseStore.saveProduct({ ...product, stock_status: newStatus });
    onRefresh();
  };

  const handleDelete = () => {
    if (productToDelete) {
      supabaseStore.deleteProduct(productToDelete.id);
      setProductToDelete(null);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E3DD]">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1b1c1a]">
            Catálogo de Arranjos & Plantas
          </h2>
          <p className="text-xs text-[#737875] font-sans mt-0.5">
            Gestão de produtos, fotos em alta resolução, ficha técnica botânica e controle de estoque
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-[#1C2D27] hover:bg-[#283618] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
        >
          <Plus className="w-4 h-4 text-[#DDA15E]" />
          <span>Novo Arranjo Botânico</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#737875] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, espécime ou slug..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8E3DD] rounded-xl text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1C2D27]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#737875]" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1C2D27]"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Products Table */}
      <div className="bg-white rounded-2xl border border-[#E8E3DD] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#737875] uppercase text-[10px] tracking-wider border-b border-[#E8E3DD]">
                <th className="py-3 px-4">Capa</th>
                <th className="py-3 px-4">Arranjo / Título</th>
                <th className="py-3 px-4">Preço Base</th>
                <th className="py-3 px-4">Ficha Botânica</th>
                <th className="py-3 px-4">Status Estoque</th>
                <th className="py-3 px-4">Destaque</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DD]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#737875] italic">
                    Nenhum produto encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    {/* Cover Thumbnail */}
                    <td className="py-3 px-4">
                      <img
                        src={prod.images[0] || 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=150&q=80'}
                        alt={prod.name}
                        className="w-12 h-14 object-cover rounded-lg border border-[#E8E3DD] shadow-sm"
                      />
                    </td>

                    {/* Title & Slug */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-serif font-bold text-sm text-[#1b1c1a] leading-tight">
                        {prod.name}
                      </div>
                      <span className="font-mono text-[10px] text-[#737875] block mt-0.5">
                        /{prod.slug}
                      </span>
                      <p className="text-[11px] text-[#424845] line-clamp-1 mt-1">
                        {prod.description}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-mono font-bold text-sm text-[#BC6C25]">
                      R$ {prod.base_price.toFixed(2)}
                      {prod.promotional_price && (
                        <span className="block text-[10px] text-[#737875] line-through font-normal">
                          R$ {prod.promotional_price.toFixed(2)}
                        </span>
                      )}
                    </td>

                    {/* Botanical Care Specs */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5 text-[10px] text-[#545a56]">
                        <div>Luz: <strong className="text-[#1b1c1a]">{prod.botanical_care.light}</strong></div>
                        <div>Rega: <strong className="text-[#1b1c1a]">{prod.botanical_care.water}</strong></div>
                        <div>
                          {prod.botanical_care.pet_friendly ? (
                            <span className="text-emerald-700 font-semibold">● Pet Friendly</span>
                          ) : (
                            <span className="text-amber-700 font-semibold">● Atenção a Pets</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Stock Status Selector Toggle */}
                    <td className="py-3 px-4">
                      <select
                        value={prod.stock_status}
                        onChange={(e) => handleToggleStock(prod, e.target.value as Product['stock_status'])}
                        className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border transition-colors ${
                          prod.stock_status === 'in_stock'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : prod.stock_status === 'low_stock'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="in_stock">Em Estoque</option>
                        <option value="low_stock">Últimos Lotes</option>
                        <option value="out_of_stock">Esgotado</option>
                      </select>
                    </td>

                    {/* Featured */}
                    <td className="py-3 px-4">
                      {prod.is_featured ? (
                        <span className="inline-flex items-center gap-1 bg-[#F4ECE6] text-[#BC6C25] px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <Star className="w-3 h-3 fill-[#BC6C25]" />
                          Destaque
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#737875]">Padrão</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="p-1.5 rounded-lg border border-[#E8E3DD] bg-white hover:bg-[#FAF8F5] text-[#1b1c1a] transition-colors"
                          title="Editar Arranjo"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#1b1c1a]" />
                        </button>

                        <button
                          onClick={() => setProductToDelete(prod)}
                          className="p-1.5 rounded-lg border border-[#E8E3DD] bg-white hover:bg-rose-50 text-rose-600 transition-colors"
                          title="Excluir Arranjo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {(isCreating || editingProduct) && (
        <ProductEditorModal
          product={editingProduct}
          categories={categories}
          occasions={occasions}
          tenantId={tenantId}
          onClose={() => {
            setIsCreating(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            setIsCreating(false);
            setEditingProduct(null);
            onRefresh();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-[#E8E3DD] shadow-xl">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="font-serif text-lg font-bold text-[#1b1c1a]">Excluir Arranjo</h3>
              <p className="text-xs text-[#737875] mt-1">
                Deseja remover <strong>"{productToDelete.name}"</strong> do catálogo? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="py-2 px-4 rounded-xl border border-[#E8E3DD] text-xs font-semibold text-[#737875] hover:bg-[#FAF8F5]"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
