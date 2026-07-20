import React from 'react';
import Meta from '../components/Meta';
import { Truck, MapPin, Clock, CreditCard } from 'lucide-react';

const ShippingPolicyPage = () => {
  return (
    <div className="bg-fittree-bg min-h-screen pt-32 pb-24 px-6 font-sans">
      <Meta title="Shipping Policy | FitTree Organics" />
      
      <div className="max-w-[800px] mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-fittree-sm border border-fittree-border">
        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-fittree-dark mb-10 text-center">Shipping Policy</h1>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-fittree-light/50 p-6 rounded-2xl flex items-start gap-4">
            <Truck className="text-fittree-orange shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-fittree-dark mb-1">Pan-India Delivery</h3>
              <p className="text-sm text-fittree-text-light">We ship to all 28 states and 8 union territories across India.</p>
            </div>
          </div>
          <div className="bg-fittree-light/50 p-6 rounded-2xl flex items-start gap-4">
            <Clock className="text-fittree-orange shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-fittree-dark mb-1">Fast Processing</h3>
              <p className="text-sm text-fittree-text-light">Orders are packed fresh and dispatched within 24-48 hours.</p>
            </div>
          </div>
          <div className="bg-fittree-light/50 p-6 rounded-2xl flex items-start gap-4">
            <CreditCard className="text-fittree-orange shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-fittree-dark mb-1">COD Available</h3>
              <p className="text-sm text-fittree-text-light">Cash on Delivery is supported for over 25,000+ pin codes.</p>
            </div>
          </div>
          <div className="bg-fittree-light/50 p-6 rounded-2xl flex items-start gap-4">
            <MapPin className="text-fittree-orange shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-fittree-dark mb-1">Live Tracking</h3>
              <p className="text-sm text-fittree-text-light">Receive real-time WhatsApp updates for your shipment.</p>
            </div>
          </div>
        </div>

        <div className="prose prose-fittree max-w-none text-fittree-text-light text-sm md:text-base leading-relaxed">
          <h3 className="text-fittree-dark font-bold text-xl mb-3">1. Delivery Timelines</h3>
          <p className="mb-6">
            Depending upon your location, delivery takes between <strong>3 to 7 working days</strong> post-dispatch. Metro cities generally receive orders within 3 days, while remote locations may take up to 7 days.
          </p>

          <h3 className="text-fittree-dark font-bold text-xl mb-3">2. Shipping Charges</h3>
          <p className="mb-6">
            We offer <strong>free shipping on all prepaid orders above ₹799</strong>. For orders below ₹799, a flat shipping fee of ₹50 is applied. For Cash on Delivery (COD) orders, an additional handling charge of ₹40 applies regardless of the order value.
          </p>

          <h3 className="text-fittree-dark font-bold text-xl mb-3">3. International Shipping</h3>
          <p className="mb-6">
            Currently, FitTree Organics only ships within India to ensure our spices and pulses reach you at peak freshness. We do not accept international orders through the website at this time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
