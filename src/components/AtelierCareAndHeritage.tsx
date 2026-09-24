import React from 'react';
import { Scissors, Droplets, Sun, Sparkles, Shield, Compass } from 'lucide-react';

interface AtelierCareAndHeritageProps {
  onInquireBespoke: () => void;
}

export const AtelierCareAndHeritage: React.FC<AtelierCareAndHeritageProps> = ({
  onInquireBespoke,
}) => {
  return (
    <section id="care" className="py-20 sm:py-28 bg-[#FFFFFF] border-t border-[#E8E3DD]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-20">
        {/* Section 1: Stem Conditioning Ritual (Editorial Modernism) */}
        <div>
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-sans uppercase tracking-[0.18em] text-[#BC6C25] font-semibold block mb-2">
              L'Art de Vivre Botanique
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C2D27] leading-tight">
              The Ritual of Stem Conditioning & Preservation
            </h2>
            <p className="text-sm text-[#424845] mt-3 leading-relaxed">
              Living cut flowers are kinetic sculptures that respond to their domestic microclimate. 
              Follow our four-step conditioning sequence to extend vase longevity up to 14 days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Scissors,
                step: '01',
                title: 'The 45° Clean Cut',
                desc: 'Slice each stem underwater at an acute 45° angle with sharp carbon shears to prevent vascular embolism.',
              },
              {
                icon: Droplets,
                step: '02',
                title: 'Chilled Spring Water',
                desc: 'Replenish with cold, clean water daily. Remove any submerged lower foliage to inhibit bacterial growth.',
              },
              {
                icon: Sun,
                step: '03',
                title: 'Indirect Gallery Light',
                desc: 'Position away from radiant heating, direct noon sunbeams, and fruit bowls (which release aging ethylene gas).',
              },
              {
                icon: Sparkles,
                step: '04',
                title: 'Twilight Foliage Mist',
                desc: 'Lightly mist petals and leafy crowns at twilight with distilled water to simulate restorative morning dew.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] p-8 rounded-2xl border border-[#E8E3DD] relative flex flex-col justify-between group hover:border-[#1C2D27]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-2xl text-[#BC6C25] font-light">
                      {item.step}
                    </span>
                    <item.icon className="w-5 h-5 text-[#283618] group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-serif text-lg text-[#1C2D27] mb-2">{item.title}</h3>
                  <p className="text-xs text-[#424845] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Sustainable Mechanics & Farm Provenance */}
        <div id="bespoke" className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-14 border border-[#E8E3DD] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-sans uppercase tracking-[0.16em] text-[#BC6C25] font-semibold block">
              Ethical Floristry Manifesto
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#1C2D27] leading-tight">
              100% Foam-Free Mechanics & Direct Farm Relationships
            </h3>
            <p className="text-xs sm:text-sm text-[#424845] leading-relaxed">
              We completely renounce phenolic floral foam (which sheds microplastics and harsh aldehydes).
              Instead, our master florists construct structural armatures using traditional Japanese kenzan (flower frogs),
              hand-twisted copper wire, and organic moss beds that can be safely returned to the soil.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Direct cold-chain transit from independent growers in Grasse, Sanremo & Cornwall',
                'Recyclable unbleached kraft carriers with raw silk ties',
                'Compostable, water-based botanical nourishment packets',
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#1C2D27]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BC6C25] mt-1.5 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={onInquireBespoke}
                className="px-6 py-3 bg-[#1C2D27] hover:bg-[#283618] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#DDA15E]" />
                <span>Inquire Private Commission or Event Lookbook</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-[#E8E3DD]">
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
                  alt="Floral conditioning atelier table"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-[#E8E3DD] mt-6">
                <img
                  src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80"
                  alt="Japanese brass shears and raw botanical stems"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
