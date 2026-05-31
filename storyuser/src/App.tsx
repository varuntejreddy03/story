import React from 'react';
import { ActiveScreen, Product, CartItem, UserProfile, Address, Order, ColorOption, StorefrontContent } from './types';
import { PRODUCTS, INITIAL_USER_PROFILE } from './data';
import { storyApi } from './api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ShopView } from './components/ShopView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { DiscoverView } from './components/DiscoverView';
import { ProductDetailView } from './components/ProductDetailView';
import { SettingsView } from './components/SettingsView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { CartDrawer } from './components/CartDrawer';
import { LoginView } from './components/LoginView';
import { BagView } from './components/BagView';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isApiProduct = (product: Product) => uuidPattern.test(product.id);

const upsertLocalCartItem = (items: CartItem[], product: Product, size: string, color: ColorOption) => {
  const combinedId = `${product.id}-${size}-${color.name.toLowerCase()}`;
  const existingIdx = items.findIndex(item => item.id === combinedId);

  if (existingIdx > -1) {
    const updated = [...items];
    updated[existingIdx] = { ...updated[existingIdx], quantity: updated[existingIdx].quantity + 1 };
    return updated;
  }

  return [...items, {
    id: combinedId,
    product,
    selectedSize: size,
    selectedColor: color,
    quantity: 1
  }];
};

const loadRazorpay = () => new Promise<boolean>((resolve) => {
  if (window.Razorpay) {
    resolve(true);
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

const DEFAULT_STOREFRONT_CONTENT: StorefrontContent = {
  heroEyebrow: 'New editorial capsule',
  heroTitle: 'Our Latest Story',
  heroBody: 'Discover timeless fashion pieces crafted in India for everyday elegance.',
  heroPrimaryCta: 'Shop Edit',
  heroSecondaryCta: 'View Lookbook',
  heroImagePrimary: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1100&q=85',
  heroImageSecondary: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85',
  heroImageDetail: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85',
  heroBadgeEyebrow: 'Story India 2026',
  heroBadgeText: 'Tailored quiet luxury',
  productsEyebrow: 'Seasonal selection',
  productsTitle: 'Our Products',
  collectionEyebrow: 'Curated combinations',
  collectionTitle: 'Perfect Match',
  collectionBody: 'Explore curated collections designed to complement your style with comfort and confidence.',
  collectionImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
  jewelryEyebrow: 'Accessories edit',
  jewelryTitle: 'Story Jewelry',
  jewelryBody: 'Adorn yourself with timeless accessories that complete every look.',
  recommendationEyebrow: 'Selected next',
  recommendationTitle: 'Recommendation'
};

export default function App() {
  const [activeScreen, setActiveScreen] = React.useState<ActiveScreen>('shop');
  const [activeProduct, setActiveProduct] = React.useState<Product | null>(null);
  const [products, setProducts] = React.useState<Product[]>(PRODUCTS);
  const [storefrontContent, setStorefrontContent] = React.useState<StorefrontContent>(DEFAULT_STOREFRONT_CONTENT);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [apiNotice, setApiNotice] = React.useState('');
  const [googleClientId, setGoogleClientId] = React.useState('');

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [checkoutBusy, setCheckoutBusy] = React.useState(false);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [userProfile, setUserProfile] = React.useState<UserProfile>(INITIAL_USER_PROFILE);
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [compiledOrder, setCompiledOrder] = React.useState<Order | null>(null);

  const [cartOpen, setCartOpen] = React.useState(false);
  const [authIntent, setAuthIntent] = React.useState<'account' | 'checkout'>('account');

  const loadAccountData = React.useCallback(async () => {
    const [cartResult, addressesResult, ordersResult] = await Promise.allSettled([
      storyApi.getCart(),
      storyApi.getAddresses(),
      storyApi.getOrders()
    ]);

    if (cartResult.status === 'fulfilled') setCartItems(cartResult.value);
    if (addressesResult.status === 'fulfilled') setAddresses(addressesResult.value);
    if (ordersResult.status === 'fulfilled') setOrders(ordersResult.value);
  }, []);

  React.useEffect(() => {
    let mounted = true;

    storyApi.googleConfig()
      .then((config) => {
        if (mounted) setGoogleClientId(config.clientId || '');
      })
      .catch(() => undefined);

    storyApi.fetchProducts()
      .then((apiProducts) => {
        if (mounted && apiProducts.length > 0) setProducts(apiProducts);
      })
      .catch(() => {
        if (mounted) setApiNotice('Backend catalog unavailable. Showing local STORY India collection.');
      });

    storyApi.settings()
      .then((settings) => {
        if (mounted) setStorefrontContent(settings);
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    let mounted = true;

    const hydrateSession = async () => {
      try {
        const user = await storyApi.me();
        if (!mounted) return;
        setUserProfile(prev => ({ ...prev, ...user }));
        setIsLoggedIn(true);
        await loadAccountData();
      } catch {
        if (!mounted) return;
        setIsLoggedIn(false);
      }
    };

    hydrateSession();
    return () => {
      mounted = false;
    };
  }, [loadAccountData]);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeScreen, activeProduct]);

  const cartBadgeCount = React.useMemo(
    () => cartItems.reduce((acc, curr) => acc + curr.quantity, 0),
    [cartItems]
  );

  const syncPendingCart = async (items: CartItem[]) => {
    const syncableItems = items.filter(item => isApiProduct(item.product));
    if (syncableItems.length === 0) return;

    for (const item of syncableItems) {
      await storyApi.addCartItem(item.product.id, item.quantity, item.selectedSize, item.selectedColor);
    }
  };

  const handleAuthenticated = async (
    profilePatch: Partial<UserProfile>,
    token: string | undefined,
    nextScreen: ActiveScreen
  ) => {
    const previousCart = [...cartItems];

    setUserProfile(prev => ({ ...prev, ...profilePatch }));
    setIsLoggedIn(true);

    try {
      await syncPendingCart(previousCart);
      await loadAccountData();
    } catch (error) {
      setApiNotice(error instanceof Error ? error.message : 'Could not sync account data.');
    }

    setActiveScreen(nextScreen);
  };

  const handleAddToCart = (product: Product, size: string, color: ColorOption) => {
    setCartItems(prev => upsertLocalCartItem(prev, product, size, color));

    if (isLoggedIn && isApiProduct(product)) {
      storyApi.addCartItem(product.id, 1, size, color)
        .then(setCartItems)
        .catch((error) => setApiNotice(error instanceof Error ? error.message : 'Could not update cart.'));
    }

    window.setTimeout(() => setCartOpen(true), 400);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const target = cartItems.find(item => item.id === id);
    const nextQuantity = Math.max(1, (target?.quantity || 1) + delta);

    setCartItems(prev => prev.map(item => (
      item.id === id ? { ...item, quantity: nextQuantity } : item
    )));

    if (target && isLoggedIn && isApiProduct(target.product)) {
      storyApi.updateCartItem(target.product.id, nextQuantity, target.selectedSize, target.selectedColor.name)
        .then(setCartItems)
        .catch((error) => setApiNotice(error instanceof Error ? error.message : 'Could not update quantity.'));
    }
  };

  const handleRemoveItem = (id: string) => {
    const target = cartItems.find(item => item.id === id);
    setCartItems(prev => prev.filter(item => item.id !== id));

    if (target && isLoggedIn && isApiProduct(target.product)) {
      storyApi.removeCartItem(target.product.id, target.selectedSize, target.selectedColor.name)
        .then(setCartItems)
        .catch((error) => setApiNotice(error instanceof Error ? error.message : 'Could not remove item.'));
    }
  };

  const handleSelectProduct = (product: Product) => {
    setActiveProduct(product);
    setActiveScreen('detail');
  };

  const ensureCheckoutAddress = async () => {
    const existingAddress = addresses.find(address => address.id) || addresses[0];
    if (existingAddress?.id) return existingAddress.id;

    const createdAddress = await storyApi.createAddress(existingAddress || {
      fullName: `${userProfile.firstName} ${userProfile.lastName}`.trim() || 'STORY Client',
      street: '12 Kala Ghoda Lane',
      city: 'Mumbai, Maharashtra 400001',
      country: 'India'
    }, userProfile);

    setAddresses([createdAddress, ...addresses.filter(address => address.street !== createdAddress.street)]);
    return createdAddress.id as string;
  };

  const compileAndSubmitOrder = async () => {
    if (cartItems.length === 0 || checkoutBusy) return;

    if (!isLoggedIn) {
      setAuthIntent('checkout');
      setActiveScreen('login');
      return;
    }

    setCheckoutBusy(true);
    setApiNotice('');

    try {
      const addressId = await ensureCheckoutAddress();
      const checkout = await storyApi.createOrder(addressId);
      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded || !window.Razorpay) {
        throw new Error('Razorpay checkout could not be loaded.');
      }

      const razorpay = new window.Razorpay({
        key: checkout.keyId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: 'STORY India',
        description: checkout.publicId,
        order_id: checkout.razorpayOrderId,
        prefill: {
          name: `${userProfile.firstName} ${userProfile.lastName}`.trim(),
          email: userProfile.email,
          contact: userProfile.phone
        },
        theme: { color: '#111111' },
        handler: async (response: RazorpayPaymentResponse) => {
          const verifiedOrder = await storyApi.verifyPayment({
            orderId: checkout.publicId || checkout.orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });

          setCompiledOrder(verifiedOrder);
          setCartItems([]);
          setCartOpen(false);
          setCheckoutBusy(false);
          setActiveScreen('confirmation');
          storyApi.getOrders().then(setOrders).catch(() => undefined);
        },
        modal: {
          ondismiss: () => setCheckoutBusy(false)
        }
      });

      razorpay.open();
    } catch (error) {
      setApiNotice(error instanceof Error ? error.message : 'Checkout could not be started.');
      setCheckoutBusy(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setCartOpen(false);
    setActiveScreen('bag');
  };

  const handleFinalCheckout = () => {
    if (cartItems.length === 0) return;
    compileAndSubmitOrder();
  };

  const handleProfileSave = async (nextProfile: UserProfile) => {
    setUserProfile(nextProfile);
    if (!isLoggedIn) return;

    try {
      const saved = await storyApi.updateProfile(nextProfile);
      setUserProfile(prev => ({ ...prev, ...saved }));
    } catch (error) {
      setApiNotice(error instanceof Error ? error.message : 'Could not update profile.');
    }
  };

  const handleSignOut = async () => {
    await storyApi.logout();
    setIsLoggedIn(false);
    setUserProfile(INITIAL_USER_PROFILE);
    setOrders([]);
    setCartItems([]);
    setActiveScreen('shop');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]" id="story-app-root">
      <Navbar
        activeScreen={activeScreen}
        setActiveScreen={(scr) => {
          setActiveScreen(scr);
          setActiveProduct(null);
        }}
        cartCount={cartBadgeCount}
        onCartToggle={() => setCartOpen(prev => !prev)}
      />

      {apiNotice && (
        <div className="border-b border-[#deded9] bg-white px-4 py-2 text-center font-mono text-[9px] uppercase tracking-widest text-[#555555]">
          {apiNotice}
        </div>
      )}

      <main className="flex-grow">
        {activeScreen === 'shop' && (
          <ShopView
            products={products}
            content={storefrontContent}
            onSelectProduct={handleSelectProduct}
            setActiveScreen={(screen) => setActiveScreen(screen as ActiveScreen)}
          />
        )}

        {activeScreen === 'about' && (
          <AboutView setActiveScreen={(screen) => setActiveScreen(screen)} />
        )}

        {activeScreen === 'contact' && (
          <ContactView setActiveScreen={(screen) => setActiveScreen(screen)} />
        )}

        {activeScreen === 'discover' && (
          <DiscoverView
            products={products}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeScreen === 'detail' && activeProduct && (
          <ProductDetailView
            product={activeProduct}
            products={products}
            onAddToCart={handleAddToCart}
            onBack={() => setActiveScreen('shop')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeScreen === 'settings' && (
          isLoggedIn ? (
            <SettingsView
              userProfile={userProfile}
              setUserProfile={handleProfileSave}
              addresses={addresses}
              setAddresses={setAddresses}
              orders={orders}
              onSignOut={handleSignOut}
            />
          ) : (
            <LoginView
              intent="account"
              onBack={() => setActiveScreen('shop')}
              onSignIn={(email, password) => storyApi.login(email, password)}
              onGoogleSignIn={(idToken) => storyApi.googleLogin(idToken)}
              onSignUp={(payload) => storyApi.register(payload)}
              onForgotPassword={(email) => storyApi.forgotPassword(email)}
              googleClientId={googleClientId}
              onLoginSuccess={(newProfile, token) => handleAuthenticated(newProfile, token, 'settings')}
            />
          )
        )}

        {activeScreen === 'login' && (
          <LoginView
            intent={authIntent}
            onBack={() => setActiveScreen(authIntent === 'checkout' ? 'bag' : 'shop')}
            onSignIn={(email, password) => storyApi.login(email, password)}
            onGoogleSignIn={(idToken) => storyApi.googleLogin(idToken)}
            onSignUp={(payload) => storyApi.register(payload)}
            onForgotPassword={(email) => storyApi.forgotPassword(email)}
            googleClientId={googleClientId}
            onLoginSuccess={(newProfile, token) => handleAuthenticated(newProfile, token, authIntent === 'checkout' ? 'bag' : 'settings')}
          />
        )}

        {activeScreen === 'confirmation' && (
          <OrderConfirmationView
            order={compiledOrder}
            onBackToShopping={() => {
              setCompiledOrder(null);
              setActiveScreen('shop');
            }}
            onViewOrders={() => setActiveScreen('settings')}
          />
        )}

        {activeScreen === 'bag' && (
          <BagView
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleFinalCheckout}
            addresses={addresses}
            isLoggedIn={isLoggedIn}
            isCheckingOut={checkoutBusy}
            onLoginRedirect={() => {
              setAuthIntent('checkout');
              setActiveScreen('login');
            }}
          />
        )}
      </main>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <Footer
        setActiveScreen={(scr) => {
          setActiveScreen(scr);
          setActiveProduct(null);
        }}
      />
    </div>
  );
}
