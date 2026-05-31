import React from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, ShoppingBag, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, ColorOption } from '../types';
import { PRODUCTS } from '../data';
import { formatINR } from '../utils/currency';

interface ProductDetailViewProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: ColorOption) => void;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  products?: Product[];
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onAddToCart,
  onBack,
  onSelectProduct,
  products
}) => {
  const [selectedSize, setSelectedSize] = React.useState<string>('');
  const [selectedColor, setSelectedColor] = React.useState<ColorOption>(
    product.colors && product.colors.length > 0 ? product.colors[0] : { name: "Default", hex: "#121212" }
  );
  
  // Accordion Expanders
  const [expandedSection, setExpandedSection] = React.useState<'details' | 'composition' | 'care' | null>('details');
  const [addedNotify, setAddedNotify] = React.useState(false);

  // Fallback images if listImages not defined
  const displayImages = React.useMemo(() => {
    if (product.listImages && product.listImages.length > 0) return product.listImages;
    if (product.secondaryImage) return [product.image, product.secondaryImage];
    return [product.image];
  }, [product]);

  // Handle setting sizes on init
  React.useEffect(() => {
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    } else {
      setSelectedSize('O/S');
    }
    
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  const handleAddClick = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
    onAddToCart(product, selectedSize, selectedColor);
    setAddedNotify(true);
    setTimeout(() => setAddedNotify(false), 3000);
  };

  const toggleSection = (section: 'details' | 'composition' | 'care') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Find complementary look products (excluding self)
  const complementaryLooks = React.useMemo(() => {
    const productSource = products && products.length > 0 ? products : PRODUCTS;
    return productSource.filter(p => p.id !== product.id).slice(0, 3);
  }, [product, products]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      id="product-detail-view-container"
      className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-16"
    >
      {/* Return Navigation */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-xs font-mono tracking-widest text-[#767676] hover:text-[#121212] transition-colors cursor-pointer"
        id="detail-back-btn"
      >
        <ArrowLeft size={14} />
        <span>BACK TO CAPSULE COLLECTIVE</span>
      </button>

      {/* Hero Dual Container layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left column: High resolution dual images stacked */}
        <div className="lg:col-span-7 space-y-6" id="detail-images-rack">
          {displayImages.map((imgSrc, idx) => (
            <div key={idx} className="aspect-[3/4] bg-[#F6F5F2] border border-[#E5E5E5] overflow-hidden">
              <img
                src={imgSrc}
                alt={`${product.name} focus crop ${idx + 1}`}
                className="w-full h-full object-cover grayscale brightness-95 hover:grayscale-0 transition-all duration-700 hover:scale-101"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>

        {/* Right column: Sticky checkout panel selectors */}
        <div className="lg:col-span-5" id="detail-options-panel">
          <div className="lg:sticky lg:top-24 space-y-8 text-left">
            
            {/* Class definitions and price headings */}
            <div className="space-y-2 border-b border-[#E5E5E5] pb-6">
              <span className="font-mono text-[9px] tracking-widest text-[#767676] uppercase font-semibold">
                STORY STUDIO SELECTION / ID: {product.id.slice(0,8).toUpperCase()}
              </span>
              
              <h1 className="font-display font-medium text-3xl sm:text-4xl text-[#121212] tracking-tight uppercase">
                {product.name}
              </h1>
              
              <p className="font-mono text-lg font-semibold text-[#121212] pt-2">
                {formatINR(product.price)}
              </p>
            </div>

            {/* Description Statement */}
            <p className="font-sans text-xs sm:text-sm text-[#5C5C60] leading-relaxed font-light">
              {product.description || "Thoughtfully designed with clean proportions. Features minimal structural details, making it a highly modular addition to any wardrobe."}
            </p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3" id="detail-colors-selector">
                <span className="font-mono text-[10px] tracking-widest text-[#767676] uppercase block font-semibold">
                  SELECT COLOUR: <span className="text-[#121212] font-semibold">{selectedColor.name}</span>
                </span>
                
                <div className="flex gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 relative border flex items-center justify-center cursor-pointer ${
                        selectedColor.name === c.name ? 'border-[#121212]' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: '#FFF' }}
                      title={c.name}
                    >
                      {/* The actual colored dot */}
                      <span
                        className="w-4.5 h-4.5 block border border-gray-300"
                        style={{ backgroundColor: c.hex }}
                      />
                      {selectedColor.name === c.name && (
                        <span className="absolute -bottom-1 w-1 h-1 bg-[#121212]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3" id="detail-sizes-selector">
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-[10px] tracking-widest text-[#767676] uppercase block font-semibold">
                    MEASURE CAPSULE: <span className="text-[#121212] font-semibold">{selectedSize}</span>
                  </span>
                  
                  <button
                    onClick={() => alert("Size Chart: Standard tailored guidelines. XS (Chest 34-36\"), S (Chest 36-38\"), M (Chest 38-40\"), L (Chest 40-42\"), XL (Chest 42-44\")")}
                    className="font-mono text-[9px] tracking-wider text-[#767676] hover:text-[#121212] underline uppercase cursor-pointer"
                  >
                    SIZE GUIDANCE
                  </button>
                </div>

                {/* Grid of sizes - completely rectangular */}
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-3.5 border font-mono text-xs tracking-widest transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-[#121212] text-white border-[#121212]'
                          : 'bg-white text-[#5C5C60] border-[#E5E5E5] hover:border-[#121212] hover:text-[#121212]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Checkout Action Button - Sharp with loading state animation */}
            <div className="space-y-4 pt-2">
              <button
                onClick={handleAddClick}
                className="w-full bg-[#121212] hover:bg-black text-white text-xs font-mono tracking-widest font-semibold py-4.5 px-6 outline-none transition-colors duration-300 cursor-pointer flex items-center justify-center space-x-3"
                id="add-to-cart-action-btn"
              >
                {addedNotify ? <Check size={14} /> : <ShoppingBag size={14} />}
                <span>{addedNotify ? 'ARTICLE SECURED IN BAG' : 'ADD ASSEMBLY TO BAG'}</span>
              </button>

              {addedNotify && (
                <p className="text-[10px] text-green-700 font-mono text-center tracking-widest uppercase">
                  ADDED TO BAG. REVIEW YOUR SELECTION IN THE DRAWER.
                </p>
              )}
            </div>

            {/* Collapsible Accordions: Details, Composition, Care */}
            <div className="border-t border-[#E5E5E5] divide-y divide-[#E5E5E5]" id="detail-specs-accordions">
              
              {/* DETAILS Accordion */}
              <div className="py-4">
                <button
                  onClick={() => toggleSection('details')}
                  className="w-full flex justify-between items-center text-left cursor-pointer"
                >
                  <span className="font-mono text-[10px] tracking-widest text-[#121212] font-semibold">01 / STRUCTURAL DETAILS</span>
                  {expandedSection === 'details' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {expandedSection === 'details' && (
                  <div className="mt-4 pl-4 text-xs text-[#5C5C60] font-sans leading-relaxed space-y-1.5 font-light">
                    {product.details ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {product.details.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>Features bespoke tailored margins, heavy weight support panels, and minimalist zero-waste outline shapes.</p>
                    )}
                  </div>
                )}
              </div>

              {/* COMPOSITION Accordion */}
              <div className="py-4">
                <button
                  onClick={() => toggleSection('composition')}
                  className="w-full flex justify-between items-center text-left cursor-pointer"
                >
                  <span className="font-mono text-[10px] tracking-widest text-[#121212] font-semibold">02 / TEXTURE & ETHICAL COMPOSITION</span>
                  {expandedSection === 'composition' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {expandedSection === 'composition' && (
                  <div className="mt-4 pl-4 text-xs text-[#5C5C60] font-sans leading-relaxed font-light">
                    <p>{product.composition || "Made with premium materials sourced through Indian textile partners and finished in responsible ateliers across India."}</p>
                  </div>
                )}
              </div>

              {/* CARE Accordion */}
              <div className="py-4">
                <button
                  onClick={() => toggleSection('care')}
                  className="w-full flex justify-between items-center text-left cursor-pointer"
                >
                  <span className="font-mono text-[10px] tracking-widest text-[#121212] font-semibold">03 / FABRIC CONSERVATION CARE</span>
                  {expandedSection === 'care' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {expandedSection === 'care' && (
                  <div className="mt-4 pl-4 text-xs text-[#5C5C60] font-sans leading-relaxed font-light">
                    <p>{product.care || "Dry clean only using mild organic solvants. Avoid hot water washes, aggressive spins, or iron steamer contact. Hang to maintain silhouette drape."}</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* COMPLETE THE LOOK Section */}
      <section className="pt-12 border-t border-[#E5E5E5]" id="detail-complementary-section">
        <div className="mb-6">
          <span className="font-mono text-[9px] tracking-widest text-[#767676] font-semibold">STORY STYLING PROTOCOL</span>
          <h3 className="font-display font-medium text-lg tracking-wider text-[#121212] uppercase mt-1">COMPLETE THE LOOK</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {complementaryLooks.map((item) => (
            <div
              key={`look-${item.id}`}
              onClick={() => {
                onSelectProduct(item);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-4 border border-[#E5E5E5] p-3 hover:border-[#121212] cursor-pointer transition-colors bg-white"
              id={`look-card-${item.id}`}
            >
              {/* Image crop */}
              <div className="w-16 h-20 bg-[#F6F5F2] border border-[#E5E5E5] shrink-0 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover grayscale brightness-95"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Specs */}
              <div className="space-y-0.5 text-left truncate">
                <span className="font-mono text-[8px] text-[#767676] tracking-widest uppercase block">{item.category}</span>
                <h4 className="font-sans font-medium text-xs text-[#121212] truncate uppercase">{item.name}</h4>
                <p className="font-mono text-xs text-[#121212] font-semibold">{formatINR(item.price)}</p>
                <span className="font-mono text-[9px] text-gray-400 block tracking-wider underline group-hover:text-black">CO-STYLED</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </motion.div>
  );
};
