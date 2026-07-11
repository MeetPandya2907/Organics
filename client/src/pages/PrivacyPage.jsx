const PrivacyPage = () => {
  return (
    <div className="bg-paper min-h-screen py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forest/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="max-w-[800px] mx-auto relative z-10">
        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-glass border border-slate-100">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-4">Privacy Policy</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-12 pb-8 border-b border-slate-100">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-10 text-slate-600 font-medium leading-relaxed">
            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-4">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-4">2. Use of Information</h2>
              <p>We use the information we collect about you to provide, maintain, and improve our services, including to process transactions, send related information, and provide customer support.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-4">3. Sharing of Information</h2>
              <p>We do not share personal information with companies, organizations, or individuals outside of Organics except in the following cases: with your consent, for legal reasons, or with our trusted service providers.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-4">4. Security</h2>
              <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
