import React, { useState } from 'react';
import { X, Upload, Trash2, Star, Check, Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Product, Category, Occasion, ProductSchema } from '../../types/admin';
import { supabaseStore } from '../../services/supabaseService';

interface ProductEditorModalProps {
  product?: Product | null;
  categories: Category[];
  occasions: Occasion[];
  tenantId: string;
  onClose: () => void;
  onSave: (savedProduct: Product) => void;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  categories,
  occasions,
  tenantId,
  onClose,
  onSave,
}) => {
  const isEditing = !!product;

  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [description, setDescription] = useState(product?.description || '');
  const [categoryId, setCategoryId] = useState(product?.category_id || (categories[0]?.id || ''));
  const [basePrice, setBasePrice] = useState(product?.base_price ? String(product.base_price) : '290');
  const [promotionalPrice, setPromotionalPrice] = useState(
    product?.promotional_price ? String(product.promotional_price) : ''
  );
  const [stockStatus, setStockStatus] = useState<Product['stock_status']>(product?.stock_status || 'in_stock');
  const [images, setImages] = useState<string[]>(
    product?.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80']
  );
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(product?.occasions || ['interior']);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? true);

  // Ficha Botânica
  const [light, setLight] = useState<Product['botanical_care']['light']>(
    product?.botanical_care?.light || 'indireta'
  );
  const [water, setWater] = useState<Product['botanical_care']['water']>(
    product?.botanical_care?.water || 'a_cada_2_dias'
  );
  const [petFriendly, setPetFriendly] = useState<boolean>(
    product?.botanical_care?.pet_friendly ?? true
  );
  const [temperature, setTemperature] = useState(
    product?.botanical_care?.temperature_celsius || '18°C - 24°C'
  );
  const [vaseLife, setVaseLife] = useState(
    product?.botanical_care?.vase_life_days || '12 - 14 dias'
  );

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-slug generator
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing || slug === '') {
      const generated = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const uploadedDataUrl = await supabaseStore.sanitizeAndUploadImage(file);
      setImages([uploadedDataUrl, ...images]);
    } catch (err: unknown) {
      alert((err as Error).message || 'Falha ao carregar imagem.');
    } finally {
      setUploadLoading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    const cover = images[index];
    const rest = images.filter((_, i) => i !== index);
    setImages([cover, ...rest]);
  };

  const toggleOccasion = (occSlug: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occSlug) ? prev.filter((s) => s !== occSlug) : [...prev, occSlug]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const rawData = {
      id: product?.id || (crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`),
      tenant_id: tenantId,
      category_id: categoryId || null,
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      base_price: parseFloat(basePrice) || 0,
      promotional_price: promotionalPrice ? parseFloat(promotionalPrice) : null,
      stock_status: stockStatus,
      images,
      botanical_care: {
        light,
        water,
        pet_friendly: petFriendly,
        temperature_celsius: temperature,
        vase_life_days: vaseLife,
      },
      occasions: selectedOccasions,
      is_featured: isFeatured,
      display_order: product?.display_order || 0,
    };

    const validation = ProductSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        fieldErrors[issue.path.join('.')] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const saved = supabaseStore.saveProduct(validation.data);
    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E8E3DD] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-[#FAF8F5] px-6 py-4 border-b border-[#E8E3DD] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#BC6C25]">
              {isEditing ? 'Edição de Peça Floral' : 'Cadastro de Nova Escultura'}
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#1b1c1a] font-normal">
              {name || 'Novo Arranjo Botânico'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F4ECE6] text-[#737875] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body with Scroll */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {Object.keys(errors).length > 0 && (
            <div className="bg-[#ffdad6] text-[#93000a] p-4 rounded-xl text-xs space-y-1 border border-[#ba1a1a]/20">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Por favor, corrija os seguintes campos:</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5">
                {Object.entries(errors).map(([field, msg]) => (
                  <li key={field}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Dados Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                Nome do Arranjo / Título Comercial *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: TERRA & PÉTALA ESCULTÓRICO"
                className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1C2D27]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                Slug (URL Amigável) *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="terra-petala-escultorico"
                className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#1b1c1a] focus:outline-none focus:border-[#1C2D27]"
              />
            </div>
          </div>

          {/* Descrição Comercial */}
          <div>
            <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
              Descrição Detalhada e Conceito *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a composição, inspiração, tipos de hastes, vaso incluso e dimensões..."
              className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl p-3 text-xs text-[#1b1c1a] leading-relaxed focus:outline-none focus:border-[#1C2D27]"
            />
          </div>

          {/* Preços e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                Preço Base (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="460.00"
                className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1b1c1a] focus:outline-none focus:border-[#1C2D27]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                Preço Promocional (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={promotionalPrice}
                onChange={(e) => setPromotionalPrice(e.target.value)}
                placeholder="Opcional"
                className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#BC6C25] focus:outline-none focus:border-[#1C2D27]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                Categoria
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1C2D27]"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status de Estoque e Destaque */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E8E3DD]">
            <div>
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                Disponibilidade de Estoque
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'in_stock', label: 'Em Estoque', color: 'border-emerald-600 bg-emerald-50 text-emerald-800' },
                  { id: 'low_stock', label: 'Últimos Lotes', color: 'border-amber-600 bg-amber-50 text-amber-800' },
                  { id: 'out_of_stock', label: 'Esgotado', color: 'border-rose-600 bg-rose-50 text-rose-800' },
                ].map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setStockStatus(s.id as any)}
                    className={`p-2 rounded-lg border text-center text-[11px] font-semibold transition-all ${
                      stockStatus === s.id
                        ? `${s.color} ring-1 ring-black/20`
                        : 'border-[#E8E3DD] bg-[#FAF8F5] text-[#737875]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1C2D27]"></div>
              </label>
              <div>
                <span className="text-xs font-bold text-[#1b1c1a]">Destacar na Vitrine Principal</span>
                <p className="text-[10px] text-[#737875]">Exibe como obra monumental de destaque no topo</p>
              </div>
            </div>
          </div>

          {/* Vínculo de Ocasiões */}
          <div>
            <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-2">
              Ocasiões Relacionadas (Filtros do Catálogo)
            </label>
            <div className="flex flex-wrap gap-2">
              {occasions.map((occ) => {
                const isSelected = selectedOccasions.includes(occ.slug);
                return (
                  <button
                    type="button"
                    key={occ.id}
                    onClick={() => toggleOccasion(occ.slug)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1C2D27] text-white shadow-sm'
                        : 'bg-[#FAF8F5] text-[#424845] border border-[#E8E3DD] hover:bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-[#25D366]" />}
                    <span>{occ.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gestão de Imagens (Upload Múltiplo, Capa, Exclusão) */}
          <div className="pt-2 border-t border-[#E8E3DD] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875]">
                  Galeria de Imagens (Arraste ou clique para definir capa) *
                </span>
                <p className="text-[10px] text-[#737875]">A primeira imagem será a capa do catálogo</p>
              </div>

              {/* Botão de Upload Local */}
              <label className="inline-flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E8E3DD] hover:bg-[#F4ECE6] px-3 py-1.5 rounded-full text-xs font-semibold text-[#1b1c1a] cursor-pointer transition-all">
                <Upload className="w-3.5 h-3.5 text-[#BC6C25]" />
                <span>{uploadLoading ? 'Enviando...' : 'Fazer Upload (Máx 2MB)'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  disabled={uploadLoading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Inserir URL direta */}
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Ou cole a URL pública de uma foto da flor..."
                className="flex-1 bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1C2D27]"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="bg-[#1C2D27] text-white px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#283618] transition-colors"
              >
                Adicionar
              </button>
            </div>

            {/* Grid de Fotos Carregadas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className={`relative aspect-[4/5] rounded-xl overflow-hidden border-2 bg-gray-100 group shadow-sm ${
                    idx === 0 ? 'border-[#BC6C25] ring-2 ring-[#BC6C25]/20' : 'border-[#E8E3DD]'
                  }`}
                >
                  <img src={imgUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />

                  {/* Tag de Imagem de Capa */}
                  {idx === 0 && (
                    <div className="absolute top-2 left-2 bg-[#BC6C25] text-white px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shadow">
                      Capa Principal
                    </div>
                  )}

                  {/* Ações sobrepostas */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetCoverImage(idx)}
                        className="bg-white text-[#1b1c1a] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow hover:bg-gray-100 flex items-center gap-1"
                      >
                        <Star className="w-3 h-3 text-[#BC6C25]" />
                        <span>Tornar Capa</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="bg-rose-600 text-white p-1.5 rounded-full shadow hover:bg-rose-700 transition-colors"
                      title="Excluir imagem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ficha Técnica Botânica */}
          <div className="pt-2 border-t border-[#E8E3DD] space-y-3">
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] block">
              Ficha Técnica Botânica
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-sans uppercase tracking-wider text-[#737875] mb-1">
                  Exposição à Luz
                </label>
                <select
                  value={light}
                  onChange={(e) => setLight(e.target.value as any)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1b1c1a]"
                >
                  <option value="indireta">Luz Indireta Filtrada</option>
                  <option value="meia_sombra">Meia Sombra</option>
                  <option value="sol_pleno">Sol Pleno</option>
                  <option value="sombra">Sombra Total</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-sans uppercase tracking-wider text-[#737875] mb-1">
                  Frequência de Rega / Água
                </label>
                <select
                  value={water}
                  onChange={(e) => setWater(e.target.value as any)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1b1c1a]"
                >
                  <option value="diaria">Troca Diária com Gelo</option>
                  <option value="a_cada_2_dias">A cada 2 Dias com Corte 45°</option>
                  <option value="semanal">Semanal</option>
                  <option value="quinzenal">Quinzenal</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-sans uppercase tracking-wider text-[#737875] mb-1">
                  Segurança para Animais
                </label>
                <button
                  type="button"
                  onClick={() => setPetFriendly(!petFriendly)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors ${
                    petFriendly
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-rose-50 border-rose-300 text-rose-800'
                  }`}
                >
                  <span>{petFriendly ? 'Pet Friendly (Seguro)' : 'Atenção (Tóxico para Pets)'}</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-sans uppercase tracking-wider text-[#737875] mb-1">
                  Temperatura Ideal
                </label>
                <input
                  type="text"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="18°C - 24°C"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1b1c1a]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans uppercase tracking-wider text-[#737875] mb-1">
                  Durabilidade em Vaso
                </label>
                <input
                  type="text"
                  value={vaseLife}
                  onChange={(e) => setVaseLife(e.target.value)}
                  placeholder="12 - 14 dias garantidos"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1b1c1a]"
                />
              </div>
            </div>
          </div>

          {/* Botões do Rodapé do Formulário */}
          <div className="pt-4 border-t border-[#E8E3DD] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#737875] hover:bg-[#FAF8F5] transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1C2D27] hover:bg-[#283618] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              Salvar Arranjo no Catálogo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
