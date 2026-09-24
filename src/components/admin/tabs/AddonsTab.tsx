import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Check, X, Image as ImageIcon } from 'lucide-react';
import { Addon, AddonCategory, AddonSchema } from '../../../types/admin';
import { supabaseStore } from '../../../services/supabaseService';

interface AddonsTabProps {
  addons: Addon[];
  tenantId: string;
  onRefresh: () => void;
}

const CATEGORY_LABELS: Record<AddonCategory, string> = {
  chocolate: 'Chocolates & Doces',
  pelucia: 'Pelúcias',
  vinho: 'Vinhos & Espumantes',
  cartao: 'Cartões Decorados',
  balao: 'Balões Personalizados',
  vaso: 'Vasos Cerâmicos & Grés',
  ferramenta: 'Ferramentas de Florista',
};

export const AddonsTab: React.FC<AddonsTabProps> = ({
  addons,
  tenantId,
  onRefresh,
}) => {
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('45.00');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<AddonCategory>('chocolate');
  const [isActive, setIsActive] = useState(true);

  const openCreate = () => {
    setName('');
    setDescription('');
    setPrice('45.00');
    setImageUrl('https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=400&q=80');
    setCategory('chocolate');
    setIsActive(true);
    setIsCreating(true);
  };

  const openEdit = (item: Addon) => {
    setName(item.name);
    setDescription(item.description || '');
    setPrice(String(item.price));
    setImageUrl(item.image_url);
    setCategory(item.category);
    setIsActive(item.is_active);
    setEditingAddon(item);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      id: editingAddon?.id || (crypto.randomUUID ? crypto.randomUUID() : `addon-${Date.now()}`),
      tenant_id: tenantId,
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price) || 0,
      image_url: imageUrl.trim(),
      category,
      is_active: isActive,
    };

    const validation = AddonSchema.safeParse(data);
    if (!validation.success) {
      alert(validation.error.issues[0]?.message || 'Dados inválidos');
      return;
    }

    supabaseStore.saveAddon(validation.data);
    setIsCreating(false);
    setEditingAddon(null);
    onRefresh();
  };

  const handleToggleActive = (addon: Addon) => {
    supabaseStore.saveAddon({ ...addon, is_active: !addon.is_active });
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este item adicional?')) {
      supabaseStore.deleteAddon(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E3DD]">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1b1c1a]">
            Adicionais & Upsell (Mini-Checkout)
          </h2>
          <p className="text-xs text-[#737875] font-sans mt-0.5">
            Itens complementares sugeridos ao cliente durante o agendamento (Vinhos, chocolates, cerâmicas, balões)
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#1C2D27] hover:bg-[#283618] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
        >
          <Plus className="w-4 h-4 text-[#DDA15E]" />
          <span>Novo Adicional</span>
        </button>
      </div>

      {/* Grid of Addon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {addons.map((addon) => (
          <div
            key={addon.id}
            className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col justify-between transition-all ${
              addon.is_active ? 'border-[#E8E3DD]' : 'border-gray-200 opacity-60 bg-gray-50'
            }`}
          >
            <div>
              {/* Image & Category Pill */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-3 border border-[#E8E3DD]">
                <img src={addon.image_url} alt={addon.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                  {CATEGORY_LABELS[addon.category]}
                </div>
              </div>

              <h4 className="font-serif font-bold text-sm text-[#1b1c1a] leading-tight">
                {addon.name}
              </h4>
              <p className="text-[11px] text-[#737875] mt-1 line-clamp-2">
                {addon.description || 'Sem descrição cadastrada'}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-[#E8E3DD] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-sans text-[#737875] block">Preço</span>
                <span className="font-mono font-bold text-sm text-[#BC6C25]">
                  R$ {addon.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleActive(addon)}
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    addon.is_active
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {addon.is_active ? 'Ativo' : 'Pausado'}
                </button>

                <button
                  onClick={() => openEdit(addon)}
                  className="p-1.5 rounded-lg border border-[#E8E3DD] hover:bg-[#FAF8F5] text-[#1b1c1a]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(addon.id)}
                  className="p-1.5 rounded-lg border border-[#E8E3DD] hover:bg-rose-50 text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {(isCreating || editingAddon) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E8E3DD] shadow-2xl overflow-hidden">
            <div className="bg-[#FAF8F5] px-6 py-4 border-b border-[#E8E3DD] flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#1b1c1a]">
                {editingAddon ? 'Editar Adicional' : 'Cadastrar Novo Adicional'}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingAddon(null);
                }}
                className="p-1 rounded-full hover:bg-[#F4ECE6] text-[#737875]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  Nome do Item *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Caixa de Bombons Finos"
                  required
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-[#1b1c1a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AddonCategory)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1b1c1a]"
                  >
                    <option value="chocolate">Chocolates & Doces</option>
                    <option value="vinho">Vinhos & Bebidas</option>
                    <option value="pelucia">Pelúcias</option>
                    <option value="vaso">Vasos & Cerâmicas</option>
                    <option value="ferramenta">Ferramentas de Poda</option>
                    <option value="cartao">Cartões Decorados</option>
                    <option value="balao">Balões</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  URL da Foto do Produto *
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  placeholder="https://..."
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  Breve Descrição Comercial
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhes sobre a procedência, tamanho ou sabor..."
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl p-3 text-xs text-[#1b1c1a]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-[#1C2D27] focus:ring-0"
                />
                <label htmlFor="activeCheck" className="text-xs font-semibold text-[#1b1c1a]">
                  Disponível para seleção imediata no checkout
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8E3DD] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingAddon(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#737875] hover:bg-[#FAF8F5]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1C2D27] hover:bg-[#283618] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Salvar Adicional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
