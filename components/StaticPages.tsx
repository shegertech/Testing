import React from 'react';

export const AboutView: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">About Ponsectors</h1>
      <div className="h-1 w-20 bg-blue-600 mx-auto rounded"></div>
    </div>
    
    <div className="prose max-w-none text-gray-700 space-y-6">
      <p className="text-lg leading-relaxed">
        <span className="font-bold text-blue-600">Ponsectors</span> is a pioneering digital ecosystem designed to bridge the gap between isolated sectors. We believe that the world's most pressing challenges—from climate change to economic inequality—cannot be solved in silos.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 my-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-2">Connect</h3>
            <p className="text-sm">Bringing together individuals, organizations, and groups from diverse backgrounds.</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
            <h3 className="font-bold text-green-800 mb-2">Collaborate</h3>
            <p className="text-sm">Providing tools to manage multi-sector projects and share critical insights.</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
            <h3 className="font-bold text-purple-800 mb-2">Catalyze</h3>
            <p className="text-sm">Unlocking funding and resources to accelerate social impact initiatives.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
      <p>
        To democratize access to cross-sector collaboration tools, enabling stakeholders to co-create sustainable solutions that drive tangible social impact across Africa and the globe.
      </p>

      <h2 className="text-2xl font-bold text-gray-900">Who We Are</h2>
      <p>
        Founded in 2025, Ponsectors is a community-driven platform. Whether you are a student with a big idea, an NGO with resources, or a government agency with policy influence, there is a place for you here.
      </p>
    </div>
  </div>
);

export const PrivacyView: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-sm border border-gray-200">
    <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Privacy Policy</h1>
    
    <div className="space-y-6 text-gray-700">
      <p className="text-sm text-gray-500 italic">Effective Date: January 1, 2025</p>
      
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-2">1. Information Collection</h2>
        <p>
          We collect information you provide directly to us, including:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Account Information:</strong> Name, email, organization details, and password.</li>
            <li><strong>Content:</strong> Projects, insights, comments, and file attachments you upload.</li>
            <li><strong>Usage Data:</strong> How you interact with our services and other users.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-2">2. Use of Information</h2>
        <p>
            We use your data to:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Facilitate connections and collaboration between stakeholders.</li>
            <li>Process funding applications (for Premium users).</li>
            <li>Send technical notices, updates, and support messages.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-2">3. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-2">4. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal information at any time via your Settings page.
        </p>
      </section>
    </div>
  </div>
);

export const TermsView: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-sm border border-gray-200">
    <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Terms of Use</h1>
    
    <div className="space-y-6 text-gray-700">
      <p className="text-sm text-gray-500 italic">Last Updated: January 1, 2025</p>
      
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Ponsectors platform, you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, you may not access or use the platform.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-2">2. User Account Responsibilities</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-2">3. User Content</h2>
        <p>
            You retain ownership of the content you post. However, by posting content, you grant Ponsectors a non-exclusive, worldwide license to display, distribute, and reproduce your content within the platform.
        </p>
        <p className="mt-2 text-red-600 text-sm">
            Strictly prohibited content includes: Hate speech, harassment, illegal activities, and malicious software.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-2">4. Limitation of Liability</h2>
        <p>
          Ponsectors is provided "as is". We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.
        </p>
      </section>
      
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-2">5. Contact</h2>
        <p>
          Questions about these Terms? Contact us at <span className="text-blue-600">legal@ponsectors.com</span>.
        </p>
      </section>
    </div>
  </div>
);
