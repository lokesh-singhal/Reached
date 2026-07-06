export default function PaymentSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">
          Proceed to payment
        </h2>
        <p className="text-gray-600 mt-1">
          You’ll be directed to Razorpay to complete payment.
        </p>
      </div>

      <hr />

      <p className="text-sm text-gray-600">
        By selecting the button, I agree to the{" "}
        <span className="underline cursor-pointer">
          booking terms
        </span>.
      </p>

      <button className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-900 transition">
        Continue to Razorpay
      </button>
    </div>
  );
}