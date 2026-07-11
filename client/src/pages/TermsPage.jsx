const TermsPage = () => {
  return (
    <div className="bg-paper min-h-screen py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-turmeric/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="max-w-[800px] mx-auto relative z-10">
        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-glass border border-slate-100">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-4">Terms & Conditions</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-12 pb-8 border-b border-slate-100">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-10 text-slate-600 font-medium leading-relaxed">
            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-4">2. Product Descriptions</h2>
              <p>We attempt to be as accurate as possible. However, we do not warrant that product descriptions or other content of this site is accurate, complete, reliable, current, or error-free.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-4">3. Pricing</h2>
              <p>All prices are subject to change without notice. We reserve the right to modify or discontinue the Service without notice at any time.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-4">4. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
