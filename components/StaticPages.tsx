import React from 'react';
import { HelpCircle, Mail, MessageCircle, FileQuestion, MapPin, Phone, FileText, CheckCircle, Shield } from 'lucide-react';

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

export const ContactView: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-sm border border-gray-200">
    <div className="grid md:grid-cols-2 gap-10">
      <div>
         <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
         <p className="text-gray-600 mb-8">
           We'd love to hear from you. Whether you have a question about features, trials, pricing, or need a demo, our team is ready to answer all your questions.
         </p>
         
         <div className="space-y-6">
            <div className="flex items-start space-x-4">
               <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                 <MapPin className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="font-bold text-gray-900">Our Office</h3>
                 <p className="text-gray-600 text-sm">Addis Ababa, Ethiopia</p>
                 <p className="text-gray-600 text-sm">Bole Sub-city, Woreda 03</p>
               </div>
            </div>
            
            <div className="flex items-start space-x-4">
               <div className="bg-green-100 p-3 rounded-lg text-green-600">
                 <Mail className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="font-bold text-gray-900">Email Us</h3>
                 <p className="text-gray-600 text-sm">support@ponsectors.com</p>
                 <p className="text-gray-600 text-sm">partners@ponsectors.com</p>
               </div>
            </div>

            <div className="flex items-start space-x-4">
               <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                 <Phone className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="font-bold text-gray-900">Call Us</h3>
                 <p className="text-gray-600 text-sm">+251 911 234 567</p>
                 <p className="text-gray-500 text-xs">Mon-Fri from 8am to 5pm EAT</p>
               </div>
            </div>
         </div>
      </div>
      
      <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
             <input type="text" className="w-full border border-gray-300 rounded-md p-2" placeholder="John Doe" />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
             <input type="email" className="w-full border border-gray-300 rounded-md p-2" placeholder="john@example.com" />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
             <textarea rows={4} className="w-full border border-gray-300 rounded-md p-2" placeholder="How can we help?" />
           </div>
           <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition">
             Send Message
           </button>
        </form>
      </div>
    </div>
  </div>
);

export const GuidelinesView: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-sm border border-gray-200">
     <div className="text-center mb-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Ponsectors is a professional community dedicated to social impact. To maintain a safe and productive environment, we ask all members to adhere to these guidelines.
      </p>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
       <div className="p-6 border border-green-200 bg-green-50 rounded-lg">
          <h3 className="font-bold text-green-800 mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" /> Do's
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
             <li>• Be respectful and constructive in your feedback.</li>
             <li>• Share accurate and verifiable information.</li>
             <li>• Respect intellectual property and credit sources.</li>
             <li>• Report suspicious activity or harassment.</li>
             <li>• Use your real identity and professional affiliation.</li>
          </ul>
       </div>
       
       <div className="p-6 border border-red-200 bg-red-50 rounded-lg">
          <h3 className="font-bold text-red-800 mb-3 flex items-center">
            <Shield className="w-5 h-5 mr-2" /> Dont's
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
             <li>• Do not post hate speech, violence, or discrimination.</li>
             <li>• Do not spam or post unrelated commercial content.</li>
             <li>• Do not share private information of others without consent.</li>
             <li>• Do not impersonate other individuals or organizations.</li>
             <li>• Do not misuse the funding application process.</li>
          </ul>
       </div>
    </div>

    <div className="mt-10 pt-8 border-t border-gray-100">
       <h3 className="font-bold text-gray-900 mb-4">Content Moderation</h3>
       <p className="text-gray-700 mb-4">
         Our admin team reviews all reported content. Violations of these guidelines may result in content removal, temporary suspension, or permanent account termination.
       </p>
       <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
         If you see something that violates these rules, please use the "Report" feature or contact support immediately.
       </div>
    </div>
  </div>
);

interface HelpViewProps {
  onNavigate?: (view: any) => void;
}

export const HelpView: React.FC<HelpViewProps> = ({ onNavigate }) => {
  const faqs = [
    {
      question: "How do I join a project?",
      answer: "Navigate to the Project Portfolio or find a project on your Home Feed. Click on the project card to view details, then click the 'Request to Join' button. The project owner will review your request."
    },
    {
      question: "What is the difference between Standard and Premium accounts?",
      answer: "Standard accounts can create projects, insights, and join collaborations. Premium accounts (typically for organizations) get additional features like posting Funding Opportunities and advanced analytics."
    },
    {
      question: "How can I reset my password?",
      answer: "If you are logged out, click 'Forgot password?' on the login screen. If you are logged in, go to Settings -> Security to change your password."
    },
    {
      question: "Can I collaborate with people outside my country?",
      answer: "Yes! Ponsectors is a global platform. You can search for projects by region or thematic area to find international collaboration opportunities."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center py-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-md text-white">
        <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-80" />
        <h1 className="text-3xl font-bold mb-2">How can we help you?</h1>
        <p className="text-blue-100">Find answers to common questions or get in touch with our support team.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileQuestion className="w-6 h-6 mr-2 text-blue-600" /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-green-600" /> Support
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Can't find what you're looking for? Our support team is here to assist you.
            </p>
            <button 
              onClick={() => onNavigate && onNavigate('contact')}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <Mail className="w-4 h-4 mr-2" /> Contact Support
            </button>
            <p className="text-xs text-gray-400 mt-3 text-center">Response time: usually within 24 hours.</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
             <h3 className="font-bold text-gray-800 mb-2">Community Guidelines</h3>
             <p className="text-xs text-gray-600 mb-3">
               Learn about the rules and best practices for collaborating on Ponsectors.
             </p>
             <button 
               onClick={() => onNavigate && onNavigate('guidelines')} 
               className="text-sm text-blue-600 font-medium hover:underline flex items-center"
             >
               Read Guidelines <FileText className="w-3 h-3 ml-1"/>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};