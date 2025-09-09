// ResultsPage.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiDownload, FiArrowLeft } from "react-icons/fi";
import "./ResultsPage.css";
import dummyArray from "../../data.json";

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
  const { reg_no } = useParams();

  // legacy row-array support (kept for compatibility)
  const mapResponseRow = (row) => ({
    regNo: row[1],
    class: row[2],
    chassis: row[3],
    engine: row[4],
    vehicleManufacturerName: row[5],
    model: row[6],
    vehicleColour: row[7],
    type: row[8],
    normsType: row[9],
    bodyType: row[10],
    ownerCount: row[11]?.toString(),
    owner: row[12],
    ownerFatherName: row[13],
    mobileNumber: row[14],
    status: row[15],
    statusAsOn: row[16],
    regAuthority: row[17],
    regDate: row[18],
    vehicleManufacturingMonthYear: row[19],
    rcExpiryDate: row[20],
    vehicleTaxUpto: row[21],
    vehicleInsuranceCompanyName: row[22],
    vehicleInsuranceUpto: row[23],
    vehicleInsurancePolicyNumber: row[24],
    rcFinancer: row[25],
    presentAddress: row[26],
    permanentAddress: row[27],
    vehicleCubicCapacity: row[28]?.toString(),
    grossVehicleWeight: row[29]?.toString(),
    unladenWeight: row[30]?.toString(),
    vehicleCategory: row[31],
    rcStandardCap: row[32]?.toString(),
    vehicleCylindersNo: row[33]?.toString(),
    vehicleSeatCapacity: row[34]?.toString(),
    vehicleSleeperCapacity: row[35]?.toString(),
    vehicleStandingCapacity: row[36]?.toString(),
    wheelbase: row[37]?.toString(),
    vehicleNumber: row[38],
    puccNumber: row[39],
    puccUpto: row[40],
    blacklistStatus: row[41] || "",
    permitIssueDate: row[42] || "",
    permitNumber: row[43],
    permitType: row[44],
    permitValidFrom: row[45],
    permitValidUpto: row[46],
    nonUseStatus: row[47] || "",
    nonUseFrom: row[48] || "",
    nonUseTo: row[49] || "",
    nationalPermitNumber: row[50] || "",
    nationalPermitUpto: row[51] || "",
    nationalPermitIssuedBy: row[52] || "",
    isCommercial: Boolean(row[53]),
    nocDetails: row[54] || "",
    rtoCode: row[55],
  });

  // prefer router-state legacy; otherwise use first object from data.json
  const data = useMemo(() => {
    const raw = state?.data;
    if (raw && Array.isArray(raw) && raw.length > 0 && Array.isArray(raw[0])) {
      return mapResponseRow(raw[0]);
    }
    const d = Array.isArray(dummyArray) ? dummyArray[0] : dummyArray;

    const presentParsed = parseSplitAddr(d.splitPresentAddress);
    const permanentParsed = parseSplitAddr(d.splitPermanentAddress);

    return {
      regNo: d.regNo || d.vehicleNumber || "",
      class: d.class || "",
      chassis: d.chassis || "",
      engine: d.engine || "",
      vehicleManufacturerName: d.vehicleManufacturerName || "",
      model: d.model || "",
      vehicleColour: d.vehicleColour || "",
      type: d.type || "",
      normsType: d.normsType || "",
      bodyType: d.bodyType || "",
      ownerCount: d.ownerCount != null ? String(d.ownerCount) : "",
      owner: d.owner || "",
      ownerFatherName: d.ownerFatherName || "",
      mobileNumber: d.mobileNumber || "",
      status: d.status || "",
      statusAsOn: d.statusAsOn || "",
      regAuthority: d.regAuthority || "",
      regDate: d.regDate || "",
      vehicleManufacturingMonthYear: d.vehicleManufacturingMonthYear || "",
      rcExpiryDate: d.rcExpiryDate || "",
      vehicleTaxUpto: d.vehicleTaxUpto || "",
      vehicleInsuranceCompanyName: d.vehicleInsuranceCompanyName || "",
      vehicleInsuranceUpto: d.vehicleInsuranceUpto || "",
      vehicleInsurancePolicyNumber: d.vehicleInsurancePolicyNumber || "",
      rcFinancer: d.rcFinancer || "",
      presentAddress: d.presentAddress || presentParsed || "",
      permanentAddress: d.permanentAddress || permanentParsed || "",
      vehicleCubicCapacity: d.vehicleCubicCapacity != null ? String(d.vehicleCubicCapacity) : "",
      grossVehicleWeight: d.grossVehicleWeight != null ? String(d.grossVehicleWeight) : "",
      unladenWeight: d.unladenWeight != null ? String(d.unladenWeight) : "",
      vehicleCategory: d.vehicleCategory || "",
      rcStandardCap: d.rcStandardCap != null ? String(d.rcStandardCap) : "",
      vehicleCylindersNo: d.vehicleCylindersNo != null ? String(d.vehicleCylindersNo) : "",
      vehicleSeatCapacity: d.vehicleSeatCapacity != null ? String(d.vehicleSeatCapacity) : "",
      vehicleSleeperCapacity: d.vehicleSleeperCapacity != null ? String(d.vehicleSleeperCapacity) : "",
      vehicleStandingCapacity: d.vehicleStandingCapacity != null ? String(d.vehicleStandingCapacity) : "",
      wheelbase: d.wheelbase != null ? String(d.wheelbase) : "",
      vehicleNumber: d.vehicleNumber || d.regNo || "",
      puccNumber: d.puccNumber || "",
      puccUpto: d.puccUpto || "",
      blacklistStatus: d.blacklistStatus || "",
      permitIssueDate: d.permitIssueDate || "",
      permitNumber: d.permitNumber || "",
      permitType: d.permitType || "",
      permitValidFrom: d.permitValidFrom || "",
      permitValidUpto: d.permitValidUpto || "",
      nonUseStatus: d.nonUseStatus || "",
      nonUseFrom: d.nonUseFrom || "",
      nonUseTo: d.nonUseTo || "",
      nationalPermitNumber: d.nationalPermitNumber || "",
      nationalPermitUpto: d.nationalPermitUpto || "",
      nationalPermitIssuedBy: d.nationalPermitIssuedBy || "",
      isCommercial: Boolean(d.isCommercial),
      nocDetails: d.nocDetails || "",
      rtoCode: d.rtoCode || "",
    };
  }, [state?.data]);

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
