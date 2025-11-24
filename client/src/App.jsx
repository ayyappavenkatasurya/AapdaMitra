import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { FaBroadcastTower, FaAmbulance, FaUserShield, FaGoogle, FaMapMarkedAlt, FaSearchLocation } from 'react-icons/fa';
import { MdGpsFixed, MdReportProblem, MdLogout, MdDragIndicator } from 'react-icons/md';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { auth, signInWithGoogle, logOut } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// --- LEAFLET ICON FIX ---
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- COMPONENT: DRAGGABLE MARKER (For Precision) ---
function DraggableMarker({ location, setLocation }) {
  const markerRef = useRef(null);
  
  // Update map center when location changes
  const map = useMap();
  useEffect(() => {
    if (location) map.flyTo(location, 16);
  }, [location, map]);

  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        setLocation({ lat: newPos.lat, lng: newPos.lng }); // Update Form Data on Drag
      }
    },
  }), [setLocation]);

  if (!location) return null;

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={location}
      ref={markerRef}
    >
      <Popup>📍 Drag me to exact location</Popup>
    </Marker>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [view, setView] = useState('map'); 
  // Form Data now includes a 'locationLocked' flag
  const [formData, setFormData] = useState({ type: 'Flood', description: '', lat: null, lng: null });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchReports();
    });
    return () => unsubscribe();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports');
      setReports(res.data);
    } catch (error) { console.error("API Error:", error); }
  };

  // --- HIGH ACCURACY GPS LOGIC ---
  const getGeoLocation = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success
          setFormData({
            ...formData,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGpsLoading(false);
        },
        (error) => {
          // Error
          alert(`⚠️ GPS Error: ${error.message}. Please enable High Accuracy.`);
          setGpsLoading(false);
        },
        // THE CRITICAL PART FOR ACCURACY:
        {
          enableHighAccuracy: true, // Force Satellite GPS
          timeout: 20000,           // Wait up to 20s for a lock
          maximumAge: 0             // Do not use cached positions
        }
      );
    } else {
      alert("Geolocation is not supported.");
      setGpsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lat) return alert("⚠️ Location is missing!");
    
    setSubmitLoading(true);
    try {
      await axios.post('http://localhost:5000/api/reports', {
        ...formData,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
      });
      alert("✅ REPORT SUBMITTED! Help is on the way.");
      setFormData({ type: 'Flood', description: '', lat: null, lng: null });
      setView('map');
      fetchReports();
    } catch (error) {
      console.error(error);
      alert("Failed to submit.");
    }
    setSubmitLoading(false);
  };

  // --- RENDER: LOGIN ---
  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <FaBroadcastTower className="text-7xl text-govt-orange mb-6 animate-pulse z-10" />
        <h1 className="text-5xl font-bold mb-2 z-10">Aapda<span className="text-govt-orange">Mitra</span></h1>
        <p className="text-gray-400 mb-8 z-10 text-center max-w-md">Advanced National Disaster Response Grid with Precision Geolocation</p>
        <button onClick={signInWithGoogle} className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition z-10">
          <FaGoogle className="text-red-500" /> Secure Login via Google
        </button>
      </div>
    );
  }

  // --- RENDER: APP ---
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 p-3 flex justify-between items-center shadow-sm z-[1000] relative">
        <div className="flex items-center gap-2">
          <FaUserShield className="text-govt-orange text-3xl" />
          <div>
            <h1 className="font-bold text-gray-800 leading-none">AapdaMitra</h1>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-gray-500 font-mono">SATELLITE LINK: ACTIVE</span>
            </div>
          </div>
        </div>
        <button onClick={logOut} className="bg-gray-100 p-2 rounded-full hover:bg-red-100 hover:text-red-600 transition"><MdLogout/></button>
      </nav>

      {/* View Toggle */}
      <div className="flex p-2 gap-2 bg-white shadow-sm z-10">
        <button onClick={() => setView('map')} className={`flex-1 py-2 rounded-md font-bold text-sm flex justify-center items-center gap-2 transition ${view === 'map' ? 'bg-govt-blue text-white' : 'bg-gray-100 text-gray-600'}`}>
          <FaMapMarkedAlt /> LIVE GRID
        </button>
        <button onClick={() => setView('report')} className={`flex-1 py-2 rounded-md font-bold text-sm flex justify-center items-center gap-2 transition ${view === 'report' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
          <MdReportProblem /> SEND SOS
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden">
        
        {/* --- VIEW: LIVE MAP --- */}
        {view === 'map' && (
          <MapContainer center={[20.5937, 78.9629]} zoom={5} scrollWheelZoom={true}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {reports.map((report) => (
              <Marker key={report._id} position={[report.lat, report.lng]}>
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex justify-between items-center mb-2 border-b pb-1">
                        <strong className="text-red-600 uppercase text-xs">{report.type}</strong>
                        <span className="text-[10px] text-gray-400">{new Date(report.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">{report.description}</p>
                    <div className="mt-2 text-xs bg-gray-100 p-1 rounded text-center">
                        Lat: {report.lat.toFixed(4)} | Lng: {report.lng.toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {/* --- VIEW: REPORT FORM (With Precision Map) --- */}
        {view === 'report' && (
          <div className="h-full overflow-y-auto p-4 pb-24 bg-gray-100">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                
                <div className="p-4 bg-red-600 text-white">
                    <h2 className="text-lg font-bold flex items-center gap-2"><FaSearchLocation/> Precision Reporting</h2>
                    <p className="text-xs text-red-200 opacity-90">High-Accuracy GPS Mode Enabled</p>
                </div>

                <div className="p-5 space-y-5">
                    {/* 1. Incident Type */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Incident Type</label>
                        <select 
                            className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg font-medium focus:ring-2 focus:ring-red-500 outline-none"
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                        >
                            <option>Flood - Water Rising</option>
                            <option>Building Collapse</option>
                            <option>Fire Emergency</option>
                            <option>Medical - Critical</option>
                            <option>Landslide / Road Block</option>
                        </select>
                    </div>

                    {/* 2. Description */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                        <textarea 
                            className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            rows="2"
                            placeholder="Number of people trapped, landmarks..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    {/* 3. PRECISION LOCATION (The Key Feature) */}
                    <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl p-3">
                        <label className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                            <MdGpsFixed/> Exact Location Required
                        </label>
                        
                        {/* A. GPS Button */}
                        {!formData.lat ? (
                            <button 
                                type="button" 
                                onClick={getGeoLocation}
                                disabled={gpsLoading}
                                className="w-full mt-2 py-4 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
                            >
                                {gpsLoading ? <span className="animate-spin">⏳</span> : <MdGpsFixed className="text-xl"/>}
                                {gpsLoading ? "Acquiring Satellites..." : "ACTIVATE GPS LOCK"}
                            </button>
                        ) : (
                            // B. Precision Map (Appears after GPS lock)
                            <div className="mt-2">
                                <div className="bg-white p-2 rounded-lg shadow-sm mb-2 text-center">
                                    <p className="text-xs text-gray-500 mb-1">Pin Location:</p>
                                    <code className="text-blue-600 font-bold text-sm block">
                                        {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
                                    </code>
                                    <p className="text-[10px] text-red-500 mt-1 font-bold flex justify-center items-center gap-1">
                                        <MdDragIndicator/> DRAG PIN TO ADJUST
                                    </p>
                                </div>
                                
                                <div className="h-48 w-full rounded-lg overflow-hidden border border-blue-200 relative z-0">
                                    <MapContainer 
                                        center={[formData.lat, formData.lng]} 
                                        zoom={16} 
                                        style={{ height: "100%", width: "100%" }}
                                        zoomControl={false}
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <DraggableMarker 
                                            location={{lat: formData.lat, lng: formData.lng}} 
                                            setLocation={(pos) => setFormData({...formData, lat: pos.lat, lng: pos.lng})} 
                                        />
                                    </MapContainer>
                                </div>
                                
                                <button onClick={getGeoLocation} className="text-xs text-blue-600 underline mt-2 w-full text-center">
                                    Re-calibrate GPS
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button 
                        onClick={handleSubmit}
                        disabled={submitLoading || !formData.lat}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitLoading ? "Transmitting..." : "BROADCAST SOS NOW"}
                    </button>
                </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;