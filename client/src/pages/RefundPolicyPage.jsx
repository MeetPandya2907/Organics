import React from 'react';
import Meta from '../components/Meta';
import { Undo2, CheckCircle2, ShieldAlert } from 'lucide-react';

const RefundPolicyPage = () => {
  return (
    <div className="bg-fittree-bg min-h-screen pt-32 pb-24 px-6 font-sans">
      <Meta title="Refund & Returns Policy | FitTree Organics" />
      
      <div className="max-w-[800px] mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-fittree-sm border border-fittree-border">
        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-fittree-dark mb-10 text-center">Refund & Returns Policy</h1>

        <div className="bg-fittree-light/30 rounded-2xl p-6 mb-10 border border-fittree-border">
          <p className="text-fittree-dark font-medium leading-relaxed">
            At FitTree Organics, we stand behind the purity and quality of our farm-direct products. If you receive a damaged product or if the product does not match the description, we offer a hassle-free 7-day return policy.
          </p>
        </div>

        <div className="space-y-10">
          <section>
            <h3 className="flex items-center gap-2 text-xl font-bold text-fittree-dark mb-4">
              <Undo2 className="text-fittree-orange" /> Conditions for Return
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-fittree-text-light leading-relaxed">
              <li>Returns must be initiated within 7 days of the delivery date.</li>
              <li>The product must be unused, in its original packaging, with the seal intact (unless the product inside was found to be spoiled upon opening).</li>
              <li>A valid proof of purchase (order number or receipt) is required.</li>
              <li>Please include clear photographs if you are reporting damaged packaging or spoiled contents.</li>
            </ul>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-xl font-bold text-fittree-dark mb-4">
              <CheckCircle2 className="text-fittree-primary" /> Refund Process
            </h3>
            <p className="text-sm md:text-base text-fittree-text-light leading-relaxed mb-4">
              Once your return request is approved, we will arrange a reverse pickup. After the item is received and inspected at our warehouse, your refund will be processed.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-fittree-text-light leading-relaxed">
              <li><strong>Prepaid Orders:</strong> Refunded back to the original source of payment within 5-7 business days.</li>
              <li><strong>COD Orders:</strong> Refunded via a payout link or bank transfer to your provided account details within 5-7 business days.</li>
            </ul>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-xl font-bold text-fittree-dark mb-4">
              <ShieldAlert className="text-fittree-pink" /> Non-Returnable Items
            </h3>
            <p className="text-sm md:text-base text-fittree-text-light leading-relaxed">
              Due to hygiene and food safety standards, partially consumed items or items returned without their original packaging cannot be accepted unless there is a verifiable quality issue.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
