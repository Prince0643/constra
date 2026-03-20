export default function NoticesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#002D5D] mb-8">Legal Notices</h1>
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Copyright Notice</h2>
            <p className="text-gray-600">
              © 2026 Constra. All rights reserved. All content on this website is protected by copyright laws.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Disclaimer</h2>
            <p className="text-gray-600">
              The information provided on this website is for general informational purposes only. 
              We make no representations or warranties about the accuracy or completeness of the information.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Government Procurement</h2>
            <p className="text-gray-600">
              This platform facilitates government procurement processes in accordance with the 
              Republic Act 9184 (Government Procurement Reform Act) and its Implementing Rules and Regulations.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
