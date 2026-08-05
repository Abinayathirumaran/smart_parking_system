import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { getUser } from '../services/auth';

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();
  const { lot, selectedSlot } = location.state || {};

  const [hours, setHours] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi'); 
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [error, setError] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [step, setStep] = useState(1); 
  
  const sessionStorageKey = selectedSlot?._id
    ? `confirmed_booking_${selectedSlot._id}`
    : 'confirmed_booking_temp';

  const [bookingData, setBookingData] = useState(() => {
    const saved = sessionStorage.getItem(sessionStorageKey);
    return saved ? JSON.parse(saved) : null;
  });

  // Price calculations
  const PRICE_PER_HOUR = 30;
  const PLATFORM_FEE = 10;
  const subtotal = hours * PRICE_PER_HOUR;
  const totalAmount = subtotal + PLATFORM_FEE;

  // Guard clause for unselected slot
  if (!lot || !selectedSlot) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <p className="text-red-400 mb-4 font-medium text-center">
          No slot selected. Please choose a slot first.
        </p>
        <button
          onClick={() => navigate('/slotarea')}
          className="bg-cyan-400 text-black px-6 py-2.5 rounded-xl font-bold hover:bg-cyan-300 transition cursor-pointer"
        >
          Back to Parking Lots
        </button>
      </div>
    );
  }

  // --- STEP NAV & PAYMENT SWITCHING ---
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setError('');
    setStep(2);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setError('');
  };

  // --- VALIDATION HELPERS ---
  const validateCard = (card) => {
    const cleanNumber = card.number.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cleanNumber)) {
      return 'Please enter a valid 16-digit card number.';
    }
    if (!card.name.trim()) {
      return 'Please enter the cardholder name.';
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) {
      return 'Expiry date must be in MM/YY format (e.g., 08/28).';
    }

    const [expMonth, expYear] = card.expiry.split('/').map(Number);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = Number(now.getFullYear().toString().slice(-2));

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return 'Card has expired. Please enter a valid future expiry date.';
    }
    if (expYear > currentYear + 10) {
      return 'Invalid expiry year. Date is too far in the future.';
    }
    if (!/^\d{3}$/.test(card.cvc)) {
      return 'CVC must be 3 digits.';
    }
    return null;
  };

  const validateUPI = (upi) => {
    const cleanUpi = upi.trim();
    if (!cleanUpi) return 'Please enter a valid UPI ID.';
    if (!/^[\w.-]+@[\w.-]+$/.test(cleanUpi)) {
      return 'Invalid UPI ID format (e.g., username@upi or mobile@okicici).';
    }
    return null;
  };

  // --- INPUT FORMATTERS ---
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(.{4})/g, '$1 ').trim();
    setCardDetails((prev) => ({ ...prev, number: formatted }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setCardDetails((prev) => ({ ...prev, expiry: value }));
  };

  // --- PROCESS PAYMENT ---
  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setError('');

    let validationError = null;
    if (paymentMethod === 'card') {
      validationError = validateCard(cardDetails);
    } else if (paymentMethod === 'upi') {
      validationError = validateUPI(upiId);
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsPaying(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const normalizedPaymentMethod = paymentMethod === 'gpay' ? 'UPI' : paymentMethod.toUpperCase();
      const mockPaymentId = `PAY-${normalizedPaymentMethod}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const payload = {
        parkingId: lot._id,
        slotId: selectedSlot._id,
        hours: Number(hours),
        paymentMethod: normalizedPaymentMethod,
        paymentId: mockPaymentId,
        totalAmount
      };

      const response = await API.post('/api/parking/bookings', payload);

      const now = new Date();
      const end = new Date(now.getTime() + Number(hours) * 60 * 60 * 1000);

      const formatTime = (dateObj) =>
        dateObj.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });

      const confirmedData = {
        ...payload,
        bookingId: response.data?._id || `BK-${Date.now().toString().slice(-6)}`,
        startTime: formatTime(now),
        endTime: formatTime(end),
        date: now.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setBookingData(confirmedData);
      sessionStorage.setItem(sessionStorageKey, JSON.stringify(confirmedData));
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.response?.data?.message || 'Booking creation failed. Slot may already be reserved.');
    } finally {
      setIsPaying(false);
    }
  };

  const handleReturnToSlots = () => {
    sessionStorage.removeItem(sessionStorageKey);
    navigate(lot?._id ? `/slotarea/${lot._id}` : '/slotarea');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative pb-12">
      <Navbar />

      <div className="max-w-xl mx-auto p-4 sm:p-6 mt-4 sm:mt-8 bg-slate-900/40 border border-white/10 rounded-2xl backdrop-blur-md">
        
        {/* RECEIPT VIEW */}
        {bookingData ? (
          <div className="text-center py-2 sm:py-4 space-y-5 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 border border-green-400 text-green-400 rounded-full flex items-center justify-center mx-auto text-3xl sm:text-4xl font-bold animate-bounce">
              ✓
            </div>

            <div>
              <span className="bg-green-500/10 text-green-400 text-xs px-3 py-1 rounded-full font-bold border border-green-500/20">
                BOOKING CONFIRMED
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-3">Slot Reserved Successfully!</h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 break-all">
                Booking ID: <span className="text-cyan-400 font-mono font-semibold">{bookingData.bookingId}</span>
              </p>
            </div>

            {/* RECEIPT CARD */}
            <div className="bg-slate-900/90 text-white rounded-2xl p-4 sm:p-6 text-left space-y-4 border border-white/10 shadow-xl">
              <div className="flex items-start justify-between border-b border-white/10 pb-3 gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">Slotify</h3>
                  <p className="text-[11px] sm:text-xs text-gray-400">Official Parking Receipt</p>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-500/10 text-emerald-400 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-500/20">
                    PAID
                  </span>
                  <p className="text-[11px] text-gray-400 mt-1">{bookingData.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-950 p-3.5 rounded-xl border border-white/5 text-xs">
                <div className="min-w-0">
                  <p className="text-gray-400 font-semibold uppercase text-[10px]">Customer</p>
                  <p className="font-bold text-white text-sm mt-0.5 truncate">{user?.username || 'Valued User'}</p>
                  <p className="text-gray-400 truncate text-[11px]">{user?.email || 'N/A'}</p>
                </div>
                <div className="min-w-0 sm:border-l sm:border-white/10 sm:pl-3.5">
                  <p className="text-gray-400 font-semibold uppercase text-[10px]">Payment</p>
                  <p className="font-mono font-bold text-white mt-0.5 text-xs break-all">{bookingData.paymentId}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Method: <span className="text-gray-200">{bookingData.paymentMethod}</span>
                  </p>
                </div>
              </div>

              {/* DETAILS LIST WITH START & END TIME */}
              <div className="space-y-2.5 text-xs sm:text-sm pt-1">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 gap-2">
                  <span className="text-gray-400 shrink-0">Location</span>
                  <span className="font-semibold text-white text-right truncate">{lot.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 gap-2">
                  <span className="text-gray-400 shrink-0">Slot & Floor</span>
                  <span className="font-bold text-cyan-400 text-right">
                    Slot #{selectedSlot.slotNumber} (Floor {selectedSlot.floor})
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 gap-2">
                  <span className="text-gray-400 shrink-0">Duration</span>
                  <span className="font-medium text-white text-right">
                    {bookingData.hours} {bookingData.hours === 1 ? 'Hour' : 'Hours'}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 gap-2">
                  <span className="text-gray-400 shrink-0">Start Time</span>
                  <span className="font-medium text-white text-right">
                    {bookingData.startTime}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 gap-2">
                  <span className="text-gray-400 shrink-0">End Time</span>
                  <span className="font-bold text-cyan-400 text-right">
                    {bookingData.endTime}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 gap-2">
                  <span className="text-gray-400 shrink-0">Platform Fee</span>
                  <span className="text-white text-right">₹{PLATFORM_FEE}.00</span>
                </div>
                <div className="flex justify-between items-center pt-1 text-sm sm:text-base font-bold text-white">
                  <span>Total Paid</span>
                  <span className="text-emerald-400 text-base sm:text-lg">₹{bookingData.totalAmount}.00</span>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-white/10 text-[11px] text-gray-400">
                Thank you for parking with Slotify!
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReturnToSlots}
                className="w-full bg-cyan-400 hover:bg-cyan-300 text-black py-3.5 rounded-xl font-bold transition cursor-pointer shadow-lg shadow-cyan-400/10 text-sm sm:text-base"
              >
                ← View Updated Slot Map
              </button>
            </div>
          </div>
        ) : (

          /* FORM FLOW */
          <>
            <div className="flex items-center justify-between mb-6 text-[11px] sm:text-xs text-gray-400 border-b border-white/10 pb-4">
              <span className={step >= 1 ? 'text-cyan-400 font-semibold' : ''}>1. Duration</span>
              <span>&gt;</span>
              <span className={step === 2 ? 'text-cyan-400 font-semibold' : ''}>2. Payment Options</span>
              <span>&gt;</span>
              <span>3. Receipt</span>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs sm:text-sm">
                {error}
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 ? (
              <form onSubmit={handleProceedToPayment} className="space-y-5">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5">Configure Reservation</h2>
                <p className="text-xs sm:text-sm text-gray-400 mb-4">Choose your parking duration.</p>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 sm:p-4 space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-gray-400 shrink-0">Location</span>
                    <span className="font-medium text-white text-right truncate">{lot.name}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-gray-400 shrink-0">Slot & Floor</span>
                    <span className="font-medium text-cyan-400 text-right">
                      Slot #{selectedSlot.slotNumber} (Floor {selectedSlot.floor})
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-gray-300 mb-2 font-medium">
                    Parking Duration
                  </label>
                  <select
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value={1}>1 Hour (₹30)</option>
                    <option value={2}>2 Hours (₹60)</option>
                    <option value={3}>3 Hours (₹90)</option>
                    <option value={4}>4 Hours (₹120)</option>
                    <option value={8}>8 Hours (₹240)</option>
                  </select>
                </div>

                <div className="p-3.5 sm:p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Parking Fee ({hours} {hours === 1 ? 'hr' : 'hrs'})</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Platform Fee</span>
                    <span>₹{PLATFORM_FEE}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between items-center text-sm sm:text-base font-bold text-white">
                    <span>Total Payable</span>
                    <span className="text-cyan-400 text-base sm:text-lg">₹{totalAmount}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-400 text-black py-3.5 rounded-xl text-sm sm:text-base font-bold hover:bg-cyan-300 transition duration-300 cursor-pointer"
                >
                  Proceed to Payment Options →
                </button>
              </form>
            ) : (

              /* STEP 2 */
              <form onSubmit={handleProcessPayment} className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Select Payment</h2>
                  
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(''); }}
                    className="text-xs text-cyan-400 hover:underline cursor-pointer"
                  >
                    ← Back to duration
                  </button>
                </div>

                {/* PAYMENT METHOD SELECTOR */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('upi')}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-medium transition text-center cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    ⚡ UPI / VPA
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('gpay')}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-medium transition text-center cursor-pointer ${
                      paymentMethod === 'gpay'
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    🔵 Google Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('card')}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-medium transition text-center cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    💳 Card
                  </button>
                </div>

                {/* DYNAMIC INPUTS */}
                <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-3">
                  {paymentMethod === 'upi' && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Enter VPA / UPI ID</label>
                      <input
                        type="text"
                        autoComplete="off"
                        placeholder="e.g. user@upi or username@okicici"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  )}

                  {paymentMethod === 'gpay' && (
                    <div className="text-center py-2 space-y-1">
                      <p className="text-xs text-gray-300">You will be redirected to complete payment via Google Pay.</p>
                      <p className="text-[11px] text-gray-500">Merchant: Slotify@upi</p>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          autoComplete="off"
                          placeholder="John Doe"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Card Number</label>
                        <input
                          type="text"
                          autoComplete="off"
                          maxLength="19"
                          placeholder="4532 8921 4532 8921"
                          value={cardDetails.number}
                          onChange={handleCardNumberChange}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            autoComplete="off"
                            maxLength="5"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={handleExpiryChange}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">CVC / CVV</label>
                          <input
                            type="password"
                            autoComplete="off"
                            maxLength="3"
                            placeholder="123"
                            value={cardDetails.cvc}
                            onChange={(e) => {
                              const cleanCvc = e.target.value.replace(/\D/g, '').slice(0, 3);
                              setCardDetails({ ...cardDetails, cvc: cleanCvc });
                            }}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPaying}
                  className="w-full bg-emerald-400 text-black py-3.5 rounded-xl text-sm sm:text-base font-bold hover:bg-emerald-300 transition duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPaying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    `Pay ₹${totalAmount}.00 Now`
                  )}
                </button>
              </form>
            )}

            <p className="text-center text-[11px] text-gray-500 mt-4">
              🔒 Secure 256-bit encrypted parking reservation
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Booking;