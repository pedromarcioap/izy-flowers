import { ArrangementSize, AtelierSettings, CartItem, DeliveryDetails } from '../types';

export const SIZE_LABELS: Record<ArrangementSize, { name: string; multiplier: number; stemFactor: number; desc: string }> = {
  classic: {
    name: 'Silhueta Clássica',
    multiplier: 1.0,
    stemFactor: 1.0,
    desc: 'Proporções intimistas para aparador, mesa lateral ou escrivaninha.',
  },
  grand: {
    name: 'Grand Atelier',
    multiplier: 1.45,
    stemFactor: 1.45,
    desc: 'Densidade floral expandida e altura escultural para mesa de jantar ou hall de entrada.',
  },
  opulent: {
    name: 'Opulente Alta Costura',
    multiplier: 2.1,
    stemFactor: 1.85,
    desc: 'Instalação monumental sob medida com espécimes botânicos raros e vaso mineral.',
  },
};

export function formatPrice(amount: number, currency: AtelierSettings['currency'] = 'BRL'): string {
  switch (currency) {
    case 'USD':
      return `$ ${Math.round(amount)}`;
    case 'EUR':
      return `€ ${Math.round(amount)}`;
    case 'GBP':
      return `£ ${Math.round(amount)}`;
    case 'BRL':
    default:
      return `R$ ${Math.round(amount).toLocaleString('pt-BR')},00`;
  }
}

export function calculateItemTotal(item: CartItem, currency: AtelierSettings['currency'] = 'BRL'): number {
  const sizeMultiplier = SIZE_LABELS[item.size]?.multiplier || 1.0;
  const base = item.arrangement.price * sizeMultiplier;
  const addOnsTotal = item.addOns.reduce((acc, curr) => acc + curr.price, 0);
  const total = (base + addOnsTotal) * item.quantity;
  return total;
}

export function buildWhatsAppOrderMessage(
  settings: AtelierSettings,
  items: CartItem[],
  delivery: DeliveryDetails
): string {
  const total = items.reduce((acc, it) => acc + calculateItemTotal(it, settings.currency), 0);
  const formattedTotal = formatPrice(total, settings.currency);

  const lines: string[] = [
    `*ÉLAN ATELIER BOTÂNICO - PEDIDO DE ESCULTURA FLORAL*`,
    `Ateliê: ${settings.atelierName}`,
    `----------------------------------------`,
    `*RESUMO DA ENCOMENDA:*`,
  ];

  items.forEach((item, idx) => {
    const sizeInfo = SIZE_LABELS[item.size] || SIZE_LABELS.classic;
    const itemTotal = formatPrice(calculateItemTotal(item, settings.currency), settings.currency);
    lines.push(
      `\n[#${idx + 1}] *${item.arrangement.title}*`,
      `- Proporção: ${sizeInfo.name}`,
      `- Volume aproximado: ~${Math.round(item.arrangement.stemCount * sizeInfo.stemFactor)} hastes`,
      `- Quantidade: ${item.quantity}`,
    );

    if (item.addOns.length > 0) {
      lines.push(`- Acessórios do Ateliê: ${item.addOns.map(a => a.title).join(', ')}`);
    }

    if (item.dedicationCard.message.trim()) {
      lines.push(
        `- Cartão Caligrafado (${item.dedicationCard.occasion || 'Geral'}):`,
        `  "_${item.dedicationCard.message.trim()}_"`,
        `  Para: ${item.dedicationCard.recipient || 'Não informado'} | De: ${item.dedicationCard.sender || 'Não informado'}`
      );
    }
    lines.push(`- Subtotal: ${itemTotal}`);
  });

  lines.push(
    `----------------------------------------`,
    `*VALOR TOTAL:* ${formattedTotal}`,
    `----------------------------------------`,
    `*DADOS PARA DESPACHO CLIMATIZADO (14°C):*`,
    `- Destinatário: ${delivery.recipientName || 'Não especificado'}`,
    `- Telefone/WhatsApp: ${delivery.recipientPhone || 'Não especificado'}`,
    `- Endereço: ${delivery.addressLine1}${delivery.suiteOrApt ? ` (${delivery.suiteOrApt})` : ''}`,
    `- CEP / Cidade: ${delivery.postalCode} - ${delivery.city}`,
    `- Data Agendada: ${delivery.deliveryDate || 'Próximo horário de colheita'}`,
    `- Janela de Entrega: ${
      delivery.deliveryWindow === 'morning'
        ? 'Manhã (09:00 - 13:00)'
        : delivery.deliveryWindow === 'afternoon'
        ? 'Tarde (13:00 - 17:00)'
        : 'Crepúsculo (17:00 - 20:00)'
    }`,
  );

  if (delivery.specialCourierNotes) {
    lines.push(`- Instruções Especiais para a Portaria/Mensageiro: ${delivery.specialCourierNotes}`);
  }

  lines.push(
    `----------------------------------------`,
    `Enviado via Catálogo Digital do ${settings.atelierName}.`
  );

  return lines.join('\n');
}
