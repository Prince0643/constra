export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#002D5D] mb-8">About Constra</h1>
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              Constra is a government procurement platform designed to streamline the bidding process
              and ensure transparency in public procurement. We connect government agencies with qualified
              contractors and suppliers.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What We Do</h2>
            <p className="text-gray-600">
              We provide a secure, efficient platform for posting procurement opportunities,
              receiving bids, and managing the entire procurement lifecycle in compliance with
              Republic Act 9184 (Government Procurement Reform Act).
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
