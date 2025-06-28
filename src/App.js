import React, { useEffect, useState } from "react";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";
import { InvoiceDownloadLink } from "./components/InvoicePDF";

function App() {
  const [invoiceData, setInvoiceData] = useState(null);
  const [history, setHistory] = useState([]);

  // Load saved invoices from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("invoices")) || [];
    setHistory(saved);
  }, []);

  // Save new invoice to localStorage
  useEffect(() => {
    if (invoiceData) {
      const updatedHistory = [invoiceData, ...history.slice(0, 4)]; // Keep last 5
      setHistory(updatedHistory);
      localStorage.setItem("invoices", JSON.stringify(updatedHistory));
    }
  }, [invoiceData]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">🧾 Smart Invoicer</h1>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
        <InvoiceForm onGenerated={setInvoiceData} />
        {invoiceData && <InvoicePreview data={invoiceData} />}
        {invoiceData && <InvoiceDownloadLink data={invoiceData} />}

        {/* Past Invoices */}
        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">📁 Past Invoices</h2>
            <ul className="space-y-2">
              {history.map((inv, idx) => (
                <li key={idx} className="bg-gray-100 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{inv.client} - {inv.service}</p>
                      <p className="text-sm text-gray-600">${inv.total.toFixed(2)} total</p>
                    </div>
                    <InvoiceDownloadLink data={inv} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <footer className="text-center text-gray-500 mt-10">
        <p className="text-sm">Designed & Developed by <a href="https://github.com/haris648" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Syed Haris</a></p>
      </footer>

    </div>
    
  );
}

export default App;
