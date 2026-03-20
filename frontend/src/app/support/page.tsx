export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#002D5D] mb-8">Support</h1>
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Support</h2>
            <p className="text-gray-600 mb-4">
              Need help with the platform? Our support team is here to assist you.
            </p>
            <div className="space-y-2">
              <p className="text-gray-700"><strong>Email:</strong> support@constra.gov.ph</p>
              <p className="text-gray-700"><strong>Phone:</strong> +63 (2) 8123-4567</p>
              <p className="text-gray-700"><strong>Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">How do I register as a bidder?</h3>
                <p className="text-gray-600">Go to the registration page, fill out your company information, and submit the required documents for verification.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">How do I submit a bid?</h3>
                <p className="text-gray-600">Navigate to the Opportunities section, select a project, and click the Submit Bid button after reviewing the requirements.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">What documents are required for verification?</h3>
                <p className="text-gray-600">Typically DTI Registration, Mayor&apos;s Permit, Company Profile, and Financial Documents are required.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
