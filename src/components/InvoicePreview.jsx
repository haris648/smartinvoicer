import React from "react";

const InvoicePreview = ({ data }) => {
  const {
    client,
    service,
    rate,
    hours,
    tax: taxPercent,
  } = data;

  const subtotal = rate * hours;
  const tax = (subtotal * (taxPercent || 0)) / 100;
  const total = subtotal + tax;

  return (
    <div className="bg-gray-50 border rounded-lg p-4 mt-4">
      <h2 className="text-xl font-bold mb-2">📄 Invoice Preview</h2>
      <p><strong>Client:</strong> {client}</p>
      <p><strong>Service:</strong> {service}</p>
      <p><strong>Rate:</strong> ${rate}/hr</p>
      <p><strong>Hours:</strong> {hours}</p>
      <p><strong>Tax:</strong> {taxPercent || 0}%</p>
      <hr className="my-2" />
      <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
      <p><strong>Tax:</strong> ${tax.toFixed(2)}</p>
      <p className="text-lg font-bold text-indigo-600"><strong>Total:</strong> ${total.toFixed(2)}</p>
    </div>
  );
};

export default InvoicePreview;
