export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#002D5D] mb-8">Rules & Regulations</h1>
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Procurement Rules</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>All bidders must be registered and verified on the platform</li>
              <li>Bids must be submitted before the stated deadline</li>
              <li>Late submissions will not be accepted</li>
              <li>All required documents must be complete and valid</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bidder Conduct</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Bidders must provide accurate and truthful information</li>
              <li>Collusion between bidders is strictly prohibited</li>
              <li>Conflict of interest must be disclosed</li>
              <li>Fraudulent activities will result in disqualification and legal action</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Terms of Use</h2>
            <p className="text-gray-600">
              By using this platform, users agree to comply with all applicable laws and regulations 
              governing government procurement in the Philippines, including RA 9184 and its IRR.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
