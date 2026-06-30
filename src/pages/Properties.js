import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/common/PropertyCard';
import { fetchProperties } from '../utils/api';
import './Properties.css';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get('page') || 1);

  const filters = {
    search: searchParams.get('search') || '',
    listingType: searchParams.get('listingType') || '',
    type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    sort: searchParams.get('sort') || '-createdAt',
  };

  useEffect(() => {
    setLoading(true);
    fetchProperties({ ...filters, page })
      .then(({ data }) => {
        setProperties(data.properties);
        setTotal(data.total);
        setPages(data.pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams]);

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const setPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', p);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="properties-page">
      <div className="page-header">
        <div className="container">
          <h1>All Properties</h1>
          <p>{total} properties found</p>
        </div>
      </div>

      <div className="container props-layout">
        {/* Sidebar Filters */}
        <aside className="filters-panel">
          <h3>Filters</h3>

          <div className="filter-group">
            <label>Search</label>
            <input
              className="form-control" placeholder="Keyword or location..."
              value={filters.search} onChange={(e) => setFilter('search', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Listing Type</label>
            <select className="form-control" value={filters.listingType} onChange={(e) => setFilter('listingType', e.target.value)}>
              <option value="">All</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Property Type</label>
            <select className="form-control" value={filters.type} onChange={(e) => setFilter('type', e.target.value)}>
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div className="filter-group">
            <label>City</label>
            <input className="form-control" placeholder="e.g. Mumbai"
              value={filters.city} onChange={(e) => setFilter('city', e.target.value)} />
          </div>

          <div className="filter-group">
            <label>Min Price (₹)</label>
            <input type="number" className="form-control" placeholder="0"
              value={filters.minPrice} onChange={(e) => setFilter('minPrice', e.target.value)} />
          </div>

          <div className="filter-group">
            <label>Max Price (₹)</label>
            <input type="number" className="form-control" placeholder="Any"
              value={filters.maxPrice} onChange={(e) => setFilter('maxPrice', e.target.value)} />
          </div>

          <div className="filter-group">
            <label>Min Bedrooms</label>
            <select className="form-control" value={filters.bedrooms} onChange={(e) => setFilter('bedrooms', e.target.value)}>
              <option value="">Any</option>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>

          <button className="btn btn-outline btn-full" onClick={() => setSearchParams({})}>
            Clear Filters
          </button>
        </aside>

        {/* Results */}
        <div className="props-main">
          <div className="props-toolbar">
            <span className="result-count">{total} results</span>
            <select className="form-control sort-select" value={filters.sort} onChange={(e) => setFilter('sort', e.target.value)}>
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-views">Most Viewed</option>
            </select>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : properties.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🏚️</div>
              <h3>No properties found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="properties-grid">
                {properties.map((p) => <PropertyCard key={p._id} property={p} />)}
              </div>

              {pages > 1 && (
                <div className="pagination">
                  <button className="btn btn-outline btn-sm" onClick={() => setPage(page - 1)} disabled={page === 1}>← Prev</button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p} onClick={() => setPage(p)}
                      className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-outline'}`}
                    >{p}</button>
                  ))}
                  <button className="btn btn-outline btn-sm" onClick={() => setPage(page + 1)} disabled={page === pages}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
