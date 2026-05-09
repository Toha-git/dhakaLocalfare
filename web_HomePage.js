import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, Card, Input, Picker } from '../components/UI';
import { useAuthStore } from '../store/authStore';
import { DHAKA_AREAS, TRANSPORT_TYPES, calculateDistance, calculateFare, estimateTime } from '../config/constants';
import * as FareService from '../services/FareService';
import { Colors } from '../config/theme';

const HomePage = () => {
  const user = useAuthStore((state) => state.user);
  const [fromArea, setFromArea] = useState(null);
  const [toArea, setToArea] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState('bus');
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [fareData, setFareData] = useState(null);
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    loadRecentReports();
  }, []);

  const loadRecentReports = async () => {
    const result = await FareService.getRecentReports(6);
    if (result.success) {
      setRecentReports(result.reports);
    }
  };

  const handleSearch = async () => {
    if (!fromArea || !toArea) {
      toast.error('Please select both areas');
      return;
    }

    if (fromArea === toArea) {
      toast.error('From and To areas must be different');
      return;
    }

    setLoading(true);

    const fromData = DHAKA_AREAS.find((a) => a.id === fromArea);
    const toData = DHAKA_AREAS.find((a) => a.id === toArea);

    const distance = calculateDistance(fromData.lat, fromData.lng, toData.lat, toData.lng);
    const fareResult = await FareService.getAverageFare(fromArea, toArea, selectedTransport);
    const estimatedTime = estimateTime(distance, selectedTransport);

    setFareData({
      distance,
      estimatedTime,
      fromAreaName: fromData.name,
      toAreaName: toData.name,
      averageFare: fareResult.success ? fareResult.average : calculateFare(distance, selectedTransport),
      reportCount: fareResult.success ? fareResult.count : 0,
    });

    setSearchPerformed(true);
    setLoading(false);
  };

  const areaItems = DHAKA_AREAS.map((area) => ({
    label: area.name,
    value: area.id,
  }));

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: '600', marginBottom: 4 }}>
            আস্সালামু আলাইকুম, {user?.displayName?.split(' ')[0]} 👋
          </h2>
          <p style={{ fontSize: 13, color: Colors.text.secondary }}>
            Where are you heading today?
          </p>
        </div>

        {/* Search Card */}
        <Card style={{ marginBottom: 30 }}>
          <h3 style={{ fontSize: 16, fontWeight: '600', marginBottom: 20, color: Colors.text.primary }}>
            Find Local Fare
          </h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: '600', color: Colors.text.secondary, display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
              From Area
            </label>
            <Picker
              items={areaItems}
              selectedValue={fromArea}
              onValueChange={setFromArea}
              placeholder="Select starting area..."
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: '600', color: Colors.text.secondary, display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
              To Area
            </label>
            <Picker
              items={areaItems}
              selectedValue={toArea}
              onValueChange={setToArea}
              placeholder="Select destination area..."
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: '600', color: Colors.text.secondary, display: 'block', marginBottom: 12, textTransform: 'uppercase' }}>
              Transport Type
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TRANSPORT_TYPES.map((transport) => (
                <button
                  key={transport.id}
                  onClick={() => setSelectedTransport(transport.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: selectedTransport === transport.id ? `2px solid ${Colors.primary}` : `1px solid ${Colors.border}`,
                    backgroundColor: selectedTransport === transport.id ? Colors.primaryLight : Colors.card,
                    color: selectedTransport === transport.id ? Colors.primary : Colors.text.secondary,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: '600',
                    transition: 'all 0.2s',
                  }}
                >
                  {transport.emoji} {transport.name}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleSearch} loading={loading} disabled={loading} style={{ width: '100%' }}>
            🔍 Search Local Fare
          </Button>
        </Card>

        {/* Results */}
        {searchPerformed && fareData && (
          <>
            {/* Fare Result Card */}
            <Card
              style={{
                background: `linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.primaryDark} 100%)`,
                color: Colors.text.white,
                marginBottom: 30,
              }}
            >
              <label style={{ fontSize: 12, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Recommended Local Fare
              </label>
              <h1 style={{ fontSize: 48, fontWeight: '700', margin: '10px 0 5px', lineHeight: 1 }}>
                ৳{fareData.averageFare}
              </h1>
              <p style={{ fontSize: 13, opacity: 0.8 }}>
                {fareData.fromAreaName} → {fareData.toAreaName}
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: 20, fontSize: 12 }}>
                  📍 {fareData.distance.toFixed(1)} km
                </div>
                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: 20, fontSize: 12 }}>
                  ⏱️ ~{fareData.estimatedTime} min
                </div>
                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: 20, fontSize: 12 }}>
                  👥 {fareData.reportCount} reports
                </div>
              </div>
            </Card>

            {/* Transport Options */}
            <h3 style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, color: Colors.text.primary }}>
              All transport options
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 12,
                marginBottom: 30,
              }}
            >
              {TRANSPORT_TYPES.map((transport) => {
                const fare = calculateFare(fareData.distance, transport.id);
                const time = estimateTime(fareData.distance, transport.id);
                return (
                  <Card
                    key={transport.id}
                    onClick={() => setSelectedTransport(transport.id)}
                    pressable
                    style={{
                      borderColor: selectedTransport === transport.id ? Colors.primary : Colors.border,
                      borderWidth: selectedTransport === transport.id ? 2 : 0.5,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>{transport.emoji}</div>
                        <div style={{ fontWeight: '600', marginBottom: 4, color: Colors.text.primary }}>
                          {transport.name}
                        </div>
                        <div style={{ fontSize: 12, color: Colors.text.secondary }}>
                          ~{time} min
                        </div>
                      </div>
                      <div style={{ fontSize: 20, fontWeight: '700', color: Colors.primary }}>
                        ৳{fare}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* Recent Reports */}
        {!searchPerformed && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: '600', color: Colors.text.primary }}>
                Recent community reports
              </h3>
              <Link to="/community" style={{ color: Colors.primary, fontWeight: '600', fontSize: 12 }}>
                See all →
              </Link>
            </div>

            {recentReports.length > 0 ? (
              <div style={{ display: 'grid', gap: 12 }}>
                {recentReports.map((report) => (
                  <Card
                    key={report.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', marginBottom: 4 }}>
                        {report.fromAreaName} → {report.toAreaName}
                      </div>
                      <div style={{ fontSize: 12, color: Colors.text.secondary }}>
                        {report.transportType} • {new Date(report.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: '700', color: Colors.primary }}>
                      ৳{report.fare}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                <h3 style={{ marginBottom: 8 }}>No reports yet</h3>
                <p style={{ color: Colors.text.secondary }}>Community fares will appear here</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
