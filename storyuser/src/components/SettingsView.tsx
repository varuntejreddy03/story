import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Globe,
  Heart,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Truck
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, Address, Order } from '../types';
import { formatINR } from '../utils/currency';

interface SettingsViewProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void | Promise<void>;
  addresses: Address[];
  setAddresses: (addresses: Address[]) => void;
  orders?: Order[];
  onSignOut?: () => void;
}

type SettingsTab = 'profile' | 'orders' | 'wishlist' | 'settings';

const tabs: Array<{ id: SettingsTab; label: string }> = [
  { id: 'profile', label: 'Profile' },
  { id: 'orders', label: 'Orders' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'settings', label: 'Settings' }
];

const formatDate = (value?: string) => {
  if (!value) return 'Pending';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Pending';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const orderNumber = (id: string) => {
  const clean = id.replace(/[^a-z0-9]/gi, '').toUpperCase();
  return `#ORD-${clean.slice(-6) || 'STORY'}`;
};

const normalizeStatus = (status?: string) => (status || 'Processing').replace(/_/g, ' ');

const addressLines = (address?: Address) => {
  if (!address) {
    return ['Kala Ghoda', 'Mumbai, Maharashtra 400001', 'India'];
  }

  const lineOne = address.street || address.line1 || 'Kala Ghoda';
  const cityLine = [
    address.cityName || address.city,
    address.state,
    address.pincode
  ].filter(Boolean).join(', ');

  return [
    lineOne,
    address.line2,
    cityLine || 'Mumbai, Maharashtra 400001',
    address.country || 'India'
  ].filter(Boolean);
};

export const SettingsView: React.FC<SettingsViewProps> = ({
  userProfile,
  setUserProfile,
  addresses,
  setAddresses,
  orders = [],
  onSignOut
}) => {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>('profile');
  const [isEditing, setIsEditing] = React.useState(false);
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);
  const selectedOrder = React.useMemo(
    () => orders.find((order) => order.id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  const primaryAddress = React.useMemo(
    () => addresses.find((address) => address.isDefault) || addresses[0],
    [addresses]
  );

  const fullName = `${userProfile.firstName} ${userProfile.lastName}`.trim() || 'STORY Client';
  const recentOrders = orders.slice(0, 2);
  const totalSpend = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  const [formFirstName, setFormFirstName] = React.useState(userProfile.firstName);
  const [formLastName, setFormLastName] = React.useState(userProfile.lastName);
  const [formEmail, setFormEmail] = React.useState(userProfile.email);
  const [formPhone, setFormPhone] = React.useState(userProfile.phone);

  React.useEffect(() => {
    setFormFirstName(userProfile.firstName);
    setFormLastName(userProfile.lastName);
    setFormEmail(userProfile.email);
    setFormPhone(userProfile.phone);
  }, [userProfile]);

  const handleEditToggle = async () => {
    if (activeTab !== 'settings' || !isEditing) {
      setActiveTab('settings');
      setIsEditing(true);
      return;
    }

    await setUserProfile({
      ...userProfile,
      firstName: formFirstName,
      lastName: formLastName,
      email: formEmail,
      phone: formPhone
    });
    setIsEditing(false);
  };

  const handleNewsletterToggle = () => {
    setUserProfile({
      ...userProfile,
      newsletter: !userProfile.newsletter
    });
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserProfile({
      ...userProfile,
      language: event.target.value
    });
  };

  const handleAddressEdit = () => {
    const freshStreet = prompt('UPDATE DELIVERY STREET:', primaryAddress?.street || primaryAddress?.line1 || '');
    const freshCity = prompt('UPDATE CITY / STATE / PIN:', primaryAddress?.city || '');

    if (!freshStreet || !freshCity) return;

    setAddresses([
      {
        ...primaryAddress,
        fullName,
        street: freshStreet,
        city: freshCity,
        country: primaryAddress?.country || 'India',
        isDefault: true
      }
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      id="settings-view-container"
      className="bg-[#f8f7f5] px-5 py-12 text-[#111111] sm:px-8 lg:px-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-24">
        <aside className="border-b border-[#111111] pb-5 lg:border-b-0 lg:pb-0" id="account-sidebar">
          <nav className="flex gap-6 overflow-x-auto lg:flex-col lg:gap-7">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedOrderId(null);
                  if (tab.id !== 'settings') setIsEditing(false);
                }}
                aria-pressed={activeTab === tab.id}
                className={`shrink-0 border-b pb-1 text-left font-mono text-[11px] uppercase transition ${
                  activeTab === tab.id
                    ? 'border-[#111111] text-[#111111]'
                    : 'border-transparent text-[#565656] hover:border-[#111111] hover:text-[#111111]'
                }`}
                id={`sidebar-tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="mt-8 inline-flex items-center gap-2 border-b border-[#111111] pb-1 font-mono text-[10px] uppercase text-[#111111] transition hover:text-[#666666]"
              id="sidebar-signout-btn"
            >
              <LogOut size={13} strokeWidth={1.6} />
              Sign out
            </button>
          )}
        </aside>

        <main id="account-panel-contents">
          {activeTab === 'profile' && (
            <section className="space-y-12">
              <div className="flex flex-col gap-5 border-b border-[#111111] pb-10 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-6 font-mono text-[10px] uppercase text-[#555555]">Profile</p>
                  <h1 className="font-display text-5xl font-black uppercase leading-none text-[#050505] sm:text-6xl lg:text-7xl">
                    {fullName}
                  </h1>
                </div>
                <p className="font-mono text-[10px] uppercase text-[#111111]">Member since 2026</p>
              </div>

              <div className="border border-[#111111] bg-[#fbfaf8] p-6 sm:flex sm:items-center sm:justify-between sm:p-8">
                <div>
                  <p className="font-mono text-[10px] uppercase text-[#555555]">Status</p>
                  <p className="mt-3 text-2xl font-semibold uppercase text-[#111111]">Archive Member</p>
                </div>
                <button
                  type="button"
                  className="mt-6 border-b border-[#111111] pb-1 font-mono text-[10px] uppercase text-[#111111] sm:mt-0"
                >
                  View benefits
                </button>
              </div>

              <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
                <ProfileField label="Email address" value={userProfile.email || 'No email added'} />
                <ProfileField label="Phone number" value={userProfile.phone || 'No phone added'} />
                <ProfileField
                  label="Default shipping"
                  value={addressLines(primaryAddress).map((line, index) => (
                    <span key={`${line}-${index}`} className="block">{line}</span>
                  ))}
                />
                <div className="flex min-h-[82px] items-end border-b border-[#111111] pb-3">
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className="inline-flex items-center gap-3 font-mono text-[10px] uppercase text-[#111111] transition hover:text-[#666666]"
                    id="profile-edit-details-btn"
                  >
                    Edit details
                    <ArrowRight size={15} strokeWidth={1.6} />
                  </button>
                </div>
              </div>

              <div className="border-t border-[#111111] pt-10">
                <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="font-mono text-[11px] uppercase text-[#111111]">Recent activity</h2>
                  <p className="font-mono text-[10px] uppercase text-[#555555]">
                    {orders.length} orders / {formatINR(totalSpend)}
                  </p>
                </div>

                <div className="divide-y divide-[#d8d6d0]">
                  {recentOrders.map((order, index) => {
                    const Icon = normalizeStatus(order.status).toLowerCase().includes('delivered')
                      ? CheckCircle2
                      : Truck;

                    return (
                      <button
                        key={order.id}
                        type="button"
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setActiveTab('orders');
                        }}
                        className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-5 py-6 text-left transition hover:bg-white"
                      >
                        <Icon size={20} strokeWidth={1.5} />
                        <span>
                          <span className="block text-base text-[#111111]">{orderNumber(order.id)}</span>
                          <span className="mt-1 block font-mono text-[10px] uppercase text-[#555555]">
                            {normalizeStatus(order.status)} - {formatDate(order.date)}
                          </span>
                        </span>
                        <span className="text-sm font-medium text-[#111111]">{formatINR(order.total)}</span>
                      </button>
                    );
                  })}

                  {recentOrders.length === 0 && (
                    <div className="py-6 font-mono text-[10px] uppercase text-[#555555]">
                      No orders yet.
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="mt-8 border-b border-[#111111] pb-1 font-mono text-[10px] uppercase text-[#111111] transition hover:text-[#666666]"
                >
                  View all orders
                </button>
              </div>
            </section>
          )}

          {activeTab === 'orders' && (
            <section className="space-y-10">
              {!selectedOrderId ? (
                <>
                  <SectionHeader title="Orders" meta={`${orders.length} account orders`} />

                  <div className="divide-y divide-[#d8d6d0] border-y border-[#111111]">
                    {orders.map((order) => (
                      <button
                        key={order.id}
                        type="button"
                        onClick={() => setSelectedOrderId(order.id)}
                        className="grid w-full grid-cols-1 gap-5 py-6 text-left transition hover:bg-white sm:grid-cols-[1.2fr_1fr_auto]"
                        id={`api-past-order-${order.id}`}
                      >
                        <span>
                          <span className="block text-lg font-medium uppercase">{orderNumber(order.id)}</span>
                          <span className="mt-2 block font-mono text-[10px] uppercase text-[#555555]">
                            {formatDate(order.date)}
                          </span>
                        </span>
                        <span className="font-mono text-[10px] uppercase text-[#555555]">
                          {normalizeStatus(order.status)}
                        </span>
                        <span className="text-base font-semibold">{formatINR(order.total)}</span>
                      </button>
                    ))}

                    {orders.length === 0 && (
                      <div className="py-10 font-mono text-[10px] uppercase text-[#555555]">
                        No backend orders found for this account.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <OrderDetail
                  order={selectedOrder}
                  selectedOrderId={selectedOrderId}
                  onBack={() => setSelectedOrderId(null)}
                />
              )}
            </section>
          )}

          {activeTab === 'wishlist' && (
            <section className="space-y-10">
              <SectionHeader title="Wishlist" meta="Saved editorial selections" />

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="group">
                  <div className="aspect-[3/4] overflow-hidden bg-[#ecebe7]">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwez49vlj7_YZtV0AqNHjUuC9EH9NpRnVx7sXuL8EHaA0eq82IX0LjNjImLPKCDwiI3pUdWFfYuBLnEryYgKRzRq7hsdMRIbTT22xIad0JVGqSxgQ9gxpdebhzYEgmL6BiUMZ-TtGD5oMVJuBY3knKUJkYq3ie3HwugefrNnyYI95e5bF-BN2XIFqYv9CGgEcKF3s3plKGAet4pO4U6yo-2MTWNTVsaVK7ybv00O2YtqzfGwQlXQCMEasn1ZnijtoeJ5XW9H5WkHQ"
                      alt="Wishlist pant item"
                      className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium uppercase">Tailored Leather Trousers</h3>
                      <p className="mt-1 font-mono text-[10px] uppercase text-[#555555]">{formatINR(2990)}</p>
                    </div>
                    <Heart size={17} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="space-y-12" id="settings-tab-panel">
              <SectionHeader title="Settings" meta="Profile, address, and preferences" />

              <div className="space-y-8">
                <div className="flex flex-col gap-5 border-b border-[#111111] pb-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold uppercase">Personal information</h2>
                    <p className="mt-2 font-mono text-[10px] uppercase text-[#555555]">Account identity</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className="inline-flex w-fit items-center gap-2 bg-[#111111] px-5 py-3 font-mono text-[10px] uppercase text-white transition hover:bg-black"
                    id="settings-edit-profile-btn"
                  >
                    {isEditing ? 'Save changes' : 'Edit'}
                    <ArrowRight size={14} strokeWidth={1.6} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
                  <EditableField
                    label="First name"
                    value={formFirstName}
                    isEditing={isEditing}
                    onChange={setFormFirstName}
                  />
                  <EditableField
                    label="Last name"
                    value={formLastName}
                    isEditing={isEditing}
                    onChange={setFormLastName}
                  />
                  <EditableField
                    label="Email address"
                    value={formEmail}
                    type="email"
                    isEditing={isEditing}
                    onChange={setFormEmail}
                  />
                  <EditableField
                    label="Phone number"
                    value={formPhone}
                    isEditing={isEditing}
                    onChange={setFormPhone}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="border-t border-[#111111] pt-6">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold uppercase">Default shipping</h2>
                      <p className="mt-2 font-mono text-[10px] uppercase text-[#555555]">India delivery address</p>
                    </div>
                    <MapPin size={19} strokeWidth={1.5} />
                  </div>

                  <div className="border border-[#111111] bg-[#fbfaf8] p-6">
                    <p className="font-medium uppercase">{primaryAddress?.fullName || fullName}</p>
                    <div className="mt-4 space-y-1 text-sm leading-6 text-[#333333]">
                      {addressLines(primaryAddress).map((line, index) => (
                        <p key={`${line}-${index}`}>{line}</p>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddressEdit}
                      className="mt-6 border-b border-[#111111] pb-1 font-mono text-[10px] uppercase"
                    >
                      Update address
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#111111] pt-6">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold uppercase">Security</h2>
                      <p className="mt-2 font-mono text-[10px] uppercase text-[#555555]">Password access</p>
                    </div>
                    <KeyRound size={19} strokeWidth={1.5} />
                  </div>

                  <div className="border border-[#d8d6d0] bg-white p-6">
                    <p className="text-sm font-medium uppercase">Encrypted password key</p>
                    <p className="mt-3 font-mono text-[10px] uppercase leading-5 text-[#555555]">
                      Recovery email will be sent to {userProfile.email || 'your account email'}.
                    </p>
                    <button
                      type="button"
                      onClick={() => alert(`Password recovery mail has been triggered to: ${userProfile.email}`)}
                      className="mt-6 border border-[#111111] px-5 py-3 font-mono text-[10px] uppercase"
                    >
                      Reset passcode
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#111111] pt-6">
                <h2 className="text-xl font-semibold uppercase">Preferences</h2>
                <div className="mt-6 divide-y divide-[#d8d6d0] border-y border-[#d8d6d0] bg-white">
                  <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium uppercase">STORY journal newsletter</p>
                      <p className="mt-2 font-mono text-[10px] uppercase leading-5 text-[#555555]">
                        Seasonal capsules, launch access, and private sale notices.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleNewsletterToggle}
                      aria-pressed={userProfile.newsletter}
                      className={`h-7 w-14 border p-1 transition ${
                        userProfile.newsletter ? 'border-[#111111] bg-[#111111]' : 'border-[#111111] bg-white'
                      }`}
                      id="newsletter-preference-toggle"
                    >
                      <span
                        className={`block h-full w-5 bg-white transition ${
                          userProfile.newsletter ? 'translate-x-7' : 'translate-x-0 bg-[#111111]'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="inline-flex items-center gap-2 text-sm font-medium uppercase">
                        <Globe size={15} strokeWidth={1.5} />
                        Preferred language
                      </p>
                      <p className="mt-2 font-mono text-[10px] uppercase leading-5 text-[#555555]">
                        UI and delivery communication language.
                      </p>
                    </div>
                    <select
                      value={userProfile.language}
                      onChange={handleLanguageChange}
                      className="w-full border border-[#111111] bg-white px-4 py-3 font-mono text-[10px] uppercase text-[#111111] sm:w-52"
                      id="language-preference-dropdown"
                    >
                      <option value="ENGLISH">ENGLISH</option>
                      <option value="HINDI">HINDI</option>
                      <option value="MARATHI">MARATHI</option>
                      <option value="TAMIL">TAMIL</option>
                      <option value="BENGALI">BENGALI</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </motion.div>
  );
};

function SectionHeader({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex flex-col gap-5 border-b border-[#111111] pb-8 sm:flex-row sm:items-end sm:justify-between">
      <h1 className="font-display text-5xl font-black uppercase leading-none text-[#050505] sm:text-6xl">
        {title}
      </h1>
      <p className="font-mono text-[10px] uppercase text-[#555555]">{meta}</p>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-h-[82px] border-b border-[#111111] pb-3">
      <p className="mb-3 font-mono text-[10px] uppercase text-[#555555]">{label}</p>
      <div className="text-base leading-7 text-[#111111]">{value}</div>
    </div>
  );
}

function EditableField({
  label,
  value,
  type = 'text',
  isEditing,
  onChange
}: {
  label: string;
  value: string;
  type?: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block border-b border-[#111111] pb-3">
      <span className="mb-3 block font-mono text-[10px] uppercase text-[#555555]">{label}</span>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-base text-[#111111] outline-none"
        />
      ) : (
        <span className="block min-h-7 text-base text-[#111111]">{value || 'Not added'}</span>
      )}
    </label>
  );
}

function OrderDetail({
  order,
  selectedOrderId,
  onBack
}: {
  order: Order | null;
  selectedOrderId: string;
  onBack: () => void;
}) {
  return (
    <div className="space-y-10" id="order-details-panel">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase text-[#555555] transition hover:text-[#111111]"
      >
        <ArrowLeft size={14} strokeWidth={1.6} />
        Back to orders
      </button>

      <div className="flex flex-col gap-5 border-b border-[#111111] pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase text-[#555555]">Order detail</p>
          <h1 className="font-display text-4xl font-black uppercase leading-none sm:text-5xl">
            {orderNumber(selectedOrderId)}
          </h1>
        </div>
        <span className="border border-[#111111] bg-[#111111] px-5 py-3 font-mono text-[10px] uppercase text-white">
          {normalizeStatus(order?.status)}
        </span>
      </div>

      {order ? (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <ProfileField label="Order date" value={formatDate(order.date)} />
            <ProfileField label="Payment" value={order.paymentMethod || 'Razorpay'} />
            <ProfileField label="Total" value={formatINR(order.total)} />
          </div>

          <div className="divide-y divide-[#d8d6d0] border-y border-[#111111]">
            {order.items.map((item) => (
              <div key={item.id} className="grid grid-cols-[88px_1fr] gap-5 py-6 sm:grid-cols-[112px_1fr_auto]">
                <div className="aspect-[3/4] overflow-hidden bg-[#ecebe7]">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover grayscale"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingBag size={20} strokeWidth={1.4} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium uppercase">{item.product.name}</h3>
                  <p className="mt-3 font-mono text-[10px] uppercase text-[#555555]">
                    {item.selectedColor.name} / {item.selectedSize} / Qty {item.quantity}
                  </p>
                </div>
                <p className="self-start text-sm font-semibold">{formatINR(item.product.price)}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => alert(order.trackingUrl || 'Tracking details will appear after fulfillment update.')}
                className="inline-flex items-center justify-center gap-2 bg-[#111111] px-6 py-4 font-mono text-[10px] uppercase text-white"
              >
                <PackageCheck size={15} strokeWidth={1.6} />
                Track order
              </button>
              <button
                type="button"
                onClick={() => alert(`Invoice for ${orderNumber(order.id)} will be available after payment confirmation.`)}
                className="inline-flex items-center justify-center gap-2 border border-[#111111] px-6 py-4 font-mono text-[10px] uppercase"
              >
                <Mail size={15} strokeWidth={1.6} />
                View invoice
              </button>
            </div>

            <div className="border border-[#111111] bg-[#fbfaf8] p-6">
              <h3 className="mb-5 font-mono text-[10px] uppercase">Summary</h3>
              <SummaryRow label="Subtotal" value={formatINR(order.subtotal)} />
              <SummaryRow label="Shipping" value={formatINR(order.shipping)} />
              <SummaryRow label="GST" value={formatINR(order.tax)} />
              <div className="mt-5 flex justify-between border-t border-[#111111] pt-4 text-sm font-semibold uppercase">
                <span>Total</span>
                <span>{formatINR(order.total)}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="border border-[#111111] bg-white p-8 font-mono text-[10px] uppercase text-[#555555]">
          Backend order record unavailable.
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3 flex justify-between font-mono text-[10px] uppercase text-[#555555]">
      <span>{label}</span>
      <span className="text-[#111111]">{value}</span>
    </div>
  );
}
