import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProperty, toggleFavorite, createBookingOrder, verifyPayment } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './PropertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchProperty(id)
      .then(({ data }) => {
        setProperty(data);
        if (user) setIsFav(user.favorites?.includes(id));
      })
      .catch(() => navigate('/properties'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFav = async () => {
    if (!user) { toast.info('Please login to save favorites'); return; }
    try {
      await toggleFavorite(id);
      setIsFav(!isFav);
      toast.success(isFav ? 'Removed from favorites' : 'Added to favorites');
    } catch { toast.error('Failed to update favorites'); }
  };

  const handleBookNow = async () => {
    if (!user) { toast.info('Please login to book this property'); navigate('/login'); return; }
    if (user._id === property.owner?._id) {
      toast.error('You cannot book your own property');
      return;
    }
    if (!window.Razorpay) {
      toast.error('Payment system failed to load. Please refresh and try again.');
      return;
    }

    setBooking(true);
    try {
      const amount = property.listingType === 'rent' ? property.price : property.price;
      const { data } = await createBookingOrder({ propertyId: property._id, amount });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Property Booking',
        description: property.title,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Booking successful! Payment confirmed.');
            navigate('/dashboard');
          } catch {
            toast.error('Payment succeeded but verification failed. Contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '',
        },
        theme: { color: '#0f172a' },
        modal: {
          ondismiss: () => setBooking(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setBooking(false);
      });
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not start booking');
      setBooking(false);
    }
  };

  const formatPrice = (p) =>
    p >= 10000000 ? `₹${(p / 10000000).toFixed(2)} Cr`
    : p >= 100000 ? `₹${(p / 100000).toFixed(1)} L`
    : `₹${p.toLocaleString()}`;

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!property) return null;

  const { title, description, type, listingType, price, area, bedrooms, bathrooms, images, address, amenities, owner, views } = property;
  const fallback = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800';

  return (
    <div className="detail-page">
      <div className="container">
        <div className="detail-breadcrumb">
          <Link to="/">Home</Link> › <Link to="/properties">Properties</Link> › {title}
        </div>

        <div className="detail-header">
          <div>
            <span className={`badge badge-${listingType}`}>For {listingType === 'sale' ? 'Sale' : 'Rent'}</span>
            <h1 className="detail-title">{title}</h1>
            <p className="detail-location">📍 {address?.street && `${address.street}, `}{address?.city}, {address?.state} {address?.zipCode}</p>
          </div>
          <div className="detail-price-wrap">
            <div className="detail-price">{formatPrice(price)}{listingType === 'rent' && '/mo'}</div>
            <button className={`btn ${isFav ? 'btn-gold' : 'btn-outline'}`} onClick={handleFav}>
              {isFav ? '❤️ Saved' : '🤍 Save'}
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="gallery">
          <img src={images[activeImg] || fallback} alt={title} className="gallery-main" onError={e => e.target.src = fallback} />
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((img, i) => (
                <img key={i} src={img} alt="" onClick={() => setActiveImg(i)}
                  className={`gallery-thumb ${i === activeImg ? 'active' : ''}`} />
              ))}
            </div>
          )}
        </div>

        <div className="detail-layout">
          <div className="detail-main">
            {/* Stats */}
            <div className="detail-stats">
              <div className="stat-box"><div className="stat-num">{bedrooms}</div><div className="stat-lbl">Bedrooms</div></div>
              <div className="stat-box"><div className="stat-num">{bathrooms}</div><div className="stat-lbl">Bathrooms</div></div>
              <div className="stat-box"><div className="stat-num">{area}</div><div className="stat-lbl">Sq. Ft.</div></div>
              <div className="stat-box"><div className="stat-num">{views}</div><div className="stat-lbl">Views</div></div>
            </div>

            <div className="detail-section">
              <h2>Description</h2>
              <p>{description}</p>
            </div>

            <div className="detail-section">
              <h2>Property Details</h2>
              <div className="detail-info-grid">
                <div className="info-row"><span>Type</span><span className="capitalize">{type}</span></div>
                <div className="info-row"><span>Listing</span><span>For {listingType === 'sale' ? 'Sale' : 'Rent'}</span></div>
                <div className="info-row"><span>Area</span><span>{area} sq. ft.</span></div>
                <div className="info-row"><span>Bedrooms</span><span>{bedrooms}</span></div>
                <div className="info-row"><span>Bathrooms</span><span>{bathrooms}</span></div>
                <div className="info-row"><span>City</span><span>{address?.city}</span></div>
                <div className="info-row"><span>State</span><span>{address?.state}</span></div>
              </div>
            </div>

            {amenities?.length > 0 && (
              <div className="detail-section">
                <h2>Amenities</h2>
                <div className="amenities-list">
                  {amenities.map((a, i) => <span key={i} className="amenity-tag">✓ {a}</span>)}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="detail-sidebar">
            <div className="agent-card">
              <h3>Book This Property</h3>
              <button
                className="btn btn-primary btn-full"
                onClick={handleBookNow}
                disabled={booking}
              >
                {booking ? 'Processing...' : `Book Now — ${formatPrice(price)}`}
              </button>
              <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
                Secure payment via Razorpay. 95% goes to the owner, 5% platform fee applies.
              </p>
            </div>

            <div className="agent-card" style={{ marginTop: '1rem' }}>
              <h3>Contact Owner</h3>
              <div className="agent-info">
                <img src={owner?.avatar || `https://ui-avatars.com/api/?name=${owner?.name}`} alt="" className="agent-avatar" />
                <div>
                  <div className="agent-name">{owner?.name}</div>
                  <div className="agent-email">{owner?.email}</div>
                </div>
              </div>
              {owner?.phone && <p className="agent-phone">📞 {owner.phone}</p>}
              <a href={`mailto:${owner?.email}?subject=Inquiry about: ${title}`} className="btn btn-outline btn-full">
                📧 Send Inquiry
              </a>
              {owner?.phone && (
                <a href={`tel:${owner.phone}`} className="btn btn-outline btn-full mt-1">
                  📞 Call Now
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
