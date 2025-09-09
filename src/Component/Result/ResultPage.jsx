// ResultsPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiDownload, FiArrowLeft } from "react-icons/fi";
import { VahanAPI } from "../../services/api"; // Import API service
import "./ResultsPage.css";

/* helpers */
const show = (v) =>
  v === null || v === undefined || (typeof v === "string" && v.trim() === "")
    ? "—"
    : String(v);

const parseSplitAddr = (s) => {
  try {
    if (!s) return null;
    const o = JSON.parse(s);
    const state = Array.isArray(o.state)
      ? Array.isArray(o.state[0])
        ? o.state[0][0]
        : o.state[0]
      : o.state;
    const city = Array.isArray(o.city) ? o.city[0] : o.city;
    const dist = Array.isArray(o.district) ? o.district[0] : o.district;
    const country = Array.isArray(o.country) ? o.country[o.country.length - 1] : o.country;
    const parts = [o.addressLine, city, dist, state, o.pincode, country].filter(Boolean);
    return parts.join(", ");
  } catch {
    return null;
  }
};

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { regNo } = useParams();
  
  // Add loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiData, setApiData] = useState(null);

  // Fetch data from API if not passed through navigation state
  useEffect(() => {
    const fetchData = async () => {
      // If we have data from navigation state, don't fetch from API
      if (state?.data) {
        return;
      }

      // If no data and no regNo, redirect to search
      if (!regNo) {
        navigate('/search');
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await VahanAPI.getResultDetails(regNo);
        setApiData(result);
      } catch (err) {
        if (err.message === 'AUTHENTICATION_ERROR') {
          navigate('/');
          return;
        }
        setError(err.message || "Failed to fetch vehicle details");
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [regNo, state?.data, navigate]);

  // Process the data (either from navigation state or API)
  const data = useMemo(() => {
    // Use navigation state data if available
    if (state?.data && Array.isArray(state.data) && state.data.length > 0) {
      const rawData = state.data[0];
      return processVehicleData(rawData);
    }

    // Use API data if available
    if (apiData && Array.isArray(apiData) && apiData.length > 0) {
      const rawData = apiData[0];
      return processVehicleData(rawData);
    }

    // Return empty data structure if no data available
    return getEmptyDataStructure();
  }, [state?.data, apiData]);

  const [open, setOpen] = useState({ owner: true, car: true });
  const toggle = (k) => setOpen((s) => ({ ...s, [k]: !s[k] }));

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.regNo || "vehicle"}-details.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="results-root">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '18px'
        }}>
          Loading vehicle details...
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="results-root">
        <header className="results-logo login-logo" aria-label="Site logo">
          <img className="results-logo-img login-logo-img" src="/images/logo.png" alt="CheckExplore Technologies" />
        </header>
        
        <div className="results-header">
          <button className="btn-header" onClick={() => navigate(-1)} aria-label="Go back">
            <FiArrowLeft aria-hidden="true" />
            <span>Back</span>
          </button>
          <h1 className="results-title">VahanSearch</h1>
        </div>

        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: 'red'
        }}>
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/search')} 
            className="login-btn"
            style={{ marginTop: '1rem' }}
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-root">
      <header className="results-logo login-logo" aria-label="Site logo">
        <img className="results-logo-img login-logo-img" src="/images/logo.png" alt="CheckExplore Technologies" />
      </header>

      <div className="results-header results-header--with-actions">
        <button className="btn-header" onClick={() => navigate(-1)} aria-label="Go back">
          <FiArrowLeft aria-hidden="true" />
          <span>Back</span>
        </button>

        <h1 className="results-title">VahanSearch</h1>

        <div className="results-actions">
          <button type="button" className="btn-header" onClick={handleDownload} aria-label="Download results">
            <FiDownload aria-hidden="true" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Owner details */}
      <CardSection title="Owner details" open={open.owner} onToggle={() => toggle("owner")}>
        <div className="grid-2">
          <div className="field"><div className="field-label">Owner</div><div className="field-value">{show(data.owner)}</div></div>
          <div className="field"><div className="field-label">Owner Count</div><div className="field-value">{show(data.ownerCount)}</div></div>
          <div className="field"><div className="field-label">Father/Guardian</div><div className="field-value">{show(data.ownerFatherName)}</div></div>
          <div className="field"><div className="field-label">Mobile</div><div className="field-value">{show(data.mobileNumber)}</div></div>
          <div className="field wide"><div className="field-label">Present Address</div><div className="field-value">{show(data.presentAddress)}</div></div>
          <div className="field wide"><div className="field-label">Permanent Address</div><div className="field-value">{show(data.permanentAddress)}</div></div>
        </div>
      </CardSection>

      {/* Car details */}
      <CardSection title="Car details" open={open.car} onToggle={() => toggle("car")}>
        <div className="grid-2">
          <div className="field"><div className="field-label">Registration No</div><div className="field-value">{show(data.regNo)}</div></div>
          <div className="field"><div className="field-label">Class</div><div className="field-value">{show(data.class)}</div></div>
          <div className="field"><div className="field-label">Status</div><div className="field-value">{[show(data.status), data.statusAsOn ? `(${data.statusAsOn})` : ""].join(" ").trim()}</div></div>
          <div className="field"><div className="field-label">RTO</div><div className="field-value">{show(data.regAuthority)}</div></div>

          <div className="field"><div className="field-label">Chassis</div><div className="field-value">{show(data.chassis)}</div></div>
          <div className="field"><div className="field-label">Engine</div><div className="field-value">{show(data.engine)}</div></div>
          <div className="field"><div className="field-label">Manufacturer</div><div className="field-value">{show(data.vehicleManufacturerName)}</div></div>
          <div className="field"><div className="field-label">Model</div><div className="field-value">{show(data.model)}</div></div>
          <div className="field"><div className="field-label">Colour</div><div className="field-value">{show(data.vehicleColour)}</div></div>
          <div className="field"><div className="field-label">Fuel/Type</div><div className="field-value">{show(data.type)}</div></div>
          <div className="field"><div className="field-label">Norms</div><div className="field-value">{show(data.normsType)}</div></div>
          <div className="field"><div className="field-label">Body</div><div className="field-value">{show(data.bodyType)}</div></div>

          <div className="field"><div className="field-label">Reg Date</div><div className="field-value">{show(data.regDate)}</div></div>
          <div className="field"><div className="field-label">RC Expiry</div><div className="field-value">{show(data.rcExpiryDate)}</div></div>
          <div className="field"><div className="field-label">Tax Upto</div><div className="field-value">{show(data.vehicleTaxUpto)}</div></div>
          <div className="field"><div className="field-label">Insurance</div><div className="field-value">{[show(data.vehicleInsuranceCompanyName), data.vehicleInsuranceUpto ? `(${data.vehicleInsuranceUpto})` : ""].join(" ").trim()}</div></div>
          <div className="field"><div className="field-label">Insurance No</div><div className="field-value">{show(data.vehicleInsurancePolicyNumber)}</div></div>
          <div className="field"><div className="field-label">PUCC</div><div className="field-value">{[show(data.puccNumber), data.puccUpto ? `(${data.puccUpto})` : ""].join(" ").trim()}</div></div>

          <div className="field"><div className="field-label">CC</div><div className="field-value">{show(data.vehicleCubicCapacity)}</div></div>
          <div className="field"><div className="field-label">GVW</div><div className="field-value">{show(data.grossVehicleWeight)}</div></div>
          <div className="field"><div className="field-label">Unladen</div><div className="field-value">{show(data.unladenWeight)}</div></div>
          <div className="field"><div className="field-label">Category</div><div className="field-value">{show(data.vehicleCategory)}</div></div>
          <div className="field"><div className="field-label">Cylinders</div><div className="field-value">{show(data.vehicleCylindersNo)}</div></div>
          <div className="field"><div className="field-label">Seats</div><div className="field-value">{show(data.vehicleSeatCapacity)}</div></div>
          <div className="field"><div className="field-label">Sleeper</div><div className="field-value">{show(data.vehicleSleeperCapacity)}</div></div>
          <div className="field"><div className="field-label">Standing</div><div className="field-value">{show(data.vehicleStandingCapacity)}</div></div>
          <div className="field"><div className="field-label">Wheelbase</div><div className="field-value">{show(data.wheelbase)}</div></div>

          <div className="field"><div className="field-label">Permit No</div><div className="field-value">{show(data.permitNumber)}</div></div>
          <div className="field"><div className="field-label">Permit Type</div><div className="field-value">{show(data.permitType)}</div></div>
          <div className="field"><div className="field-label">Valid From</div><div className="field-value">{show(data.permitValidFrom)}</div></div>
          <div className="field"><div className="field-label">Valid Upto</div><div className="field-value">{show(data.permitValidUpto)}</div></div>
          <div className="field"><div className="field-label">Blacklist</div><div className="field-value">{show(data.blacklistStatus)}</div></div>
          <div className="field"><div className="field-label">NOC</div><div className="field-value">{show(data.nocDetails)}</div></div>
        </div>
      </CardSection>
    </div>
  );
}

/* Helper functions */
function processVehicleData(rawData) {
  const presentParsed = parseSplitAddr(rawData.splitPresentAddress);
  const permanentParsed = parseSplitAddr(rawData.splitPermanentAddress);

  return {
    regNo: rawData.regNo || rawData.vehicleNumber || "",
    class: rawData.class || "",
    chassis: rawData.chassis || "",
    engine: rawData.engine || "",
    vehicleManufacturerName: rawData.vehicleManufacturerName || "",
    model: rawData.model || "",
    vehicleColour: rawData.vehicleColour || "",
    type: rawData.type || "",
    normsType: rawData.normsType || "",
    bodyType: rawData.bodyType || "",
    ownerCount: rawData.ownerCount != null ? String(rawData.ownerCount) : "",
    owner: rawData.owner || "",
    ownerFatherName: rawData.ownerFatherName || "",
    mobileNumber: rawData.mobileNumber || "",
    status: rawData.status || "",
    statusAsOn: rawData.statusAsOn || "",
    regAuthority: rawData.regAuthority || "",
    regDate: rawData.regDate || "",
    vehicleManufacturingMonthYear: rawData.vehicleManufacturingMonthYear || "",
    rcExpiryDate: rawData.rcExpiryDate || "",
    vehicleTaxUpto: rawData.vehicleTaxUpto || "",
    vehicleInsuranceCompanyName: rawData.vehicleInsuranceCompanyName || "",
    vehicleInsuranceUpto: rawData.vehicleInsuranceUpto || "",
    vehicleInsurancePolicyNumber: rawData.vehicleInsurancePolicyNumber || "",
    rcFinancer: rawData.rcFinancer || "",
    presentAddress: rawData.presentAddress || presentParsed || "",
    permanentAddress: rawData.permanentAddress || permanentParsed || "",
    vehicleCubicCapacity: rawData.vehicleCubicCapacity != null ? String(rawData.vehicleCubicCapacity) : "",
    grossVehicleWeight: rawData.grossVehicleWeight != null ? String(rawData.grossVehicleWeight) : "",
    unladenWeight: rawData.unladenWeight != null ? String(rawData.unladenWeight) : "",
    vehicleCategory: rawData.vehicleCategory || "",
    rcStandardCap: rawData.rcStandardCap != null ? String(rawData.rcStandardCap) : "",
    vehicleCylindersNo: rawData.vehicleCylindersNo != null ? String(rawData.vehicleCylindersNo) : "",
    vehicleSeatCapacity: rawData.vehicleSeatCapacity != null ? String(rawData.vehicleSeatCapacity) : "",
    vehicleSleeperCapacity: rawData.vehicleSleeperCapacity != null ? String(rawData.vehicleSleeperCapacity) : "",
    vehicleStandingCapacity: rawData.vehicleStandingCapacity != null ? String(rawData.vehicleStandingCapacity) : "",
    wheelbase: rawData.wheelbase != null ? String(rawData.wheelbase) : "",
    vehicleNumber: rawData.vehicleNumber || rawData.regNo || "",
    puccNumber: rawData.puccNumber || "",
    puccUpto: rawData.puccUpto || "",
    blacklistStatus: rawData.blacklistStatus || "",
    permitIssueDate: rawData.permitIssueDate || "",
    permitNumber: rawData.permitNumber || "",
    permitType: rawData.permitType || "",
    permitValidFrom: rawData.permitValidFrom || "",
    permitValidUpto: rawData.permitValidUpto || "",
    nonUseStatus: rawData.nonUseStatus || "",
    nonUseFrom: rawData.nonUseFrom || "",
    nonUseTo: rawData.nonUseTo || "",
    nationalPermitNumber: rawData.nationalPermitNumber || "",
    nationalPermitUpto: rawData.nationalPermitUpto || "",
    nationalPermitIssuedBy: rawData.nationalPermitIssuedBy || "",
    isCommercial: Boolean(rawData.isCommercial),
    nocDetails: rawData.nocDetails || "",
    rtoCode: rawData.rtoCode || "",
  };
}

function getEmptyDataStructure() {
  return {
    regNo: "", class: "", chassis: "", engine: "", vehicleManufacturerName: "",
    model: "", vehicleColour: "", type: "", normsType: "", bodyType: "",
    ownerCount: "", owner: "", ownerFatherName: "", mobileNumber: "", status: "",
    statusAsOn: "", regAuthority: "", regDate: "", vehicleManufacturingMonthYear: "",
    rcExpiryDate: "", vehicleTaxUpto: "", vehicleInsuranceCompanyName: "",
    vehicleInsuranceUpto: "", vehicleInsurancePolicyNumber: "", rcFinancer: "",
    presentAddress: "", permanentAddress: "", vehicleCubicCapacity: "",
    grossVehicleWeight: "", unladenWeight: "", vehicleCategory: "", rcStandardCap: "",
    vehicleCylindersNo: "", vehicleSeatCapacity: "", vehicleSleeperCapacity: "",
    vehicleStandingCapacity: "", wheelbase: "", vehicleNumber: "", puccNumber: "",
    puccUpto: "", blacklistStatus: "", permitIssueDate: "", permitNumber: "",
    permitType: "", permitValidFrom: "", permitValidUpto: "", nonUseStatus: "",
    nonUseFrom: "", nonUseTo: "", nationalPermitNumber: "", nationalPermitUpto: "",
    nationalPermitIssuedBy: "", isCommercial: false, nocDetails: "", rtoCode: "",
  };
}

/* Collapsible section helper */
function CardSection({ title, open, onToggle, children }) {
  const id = title.toLowerCase().replace(/\s+/g, "-") + "-body";
  return (
    <section className="panel glass">
      <div className="card">
        <div className="card-head">
          <h2 className="card-title">{title}</h2>
          <button className="card-toggle" type="button" onClick={onToggle} aria-expanded={open} aria-controls={id}>
            <span className={`chev ${open ? "open" : ""}`} />
          </button>
        </div>
        {open && <div id={id}>{children}</div>}
      </div>
    </section>
  );
}
