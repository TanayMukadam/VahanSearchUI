// ResultsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiDownload, FiArrowLeft } from "react-icons/fi"; // react-icons glyphs [web:349][web:347]
import "./ResultsPage.css";
import dummy from "../../data.json";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { reg_no } = useParams();

  // Build mock "row" like backend
  const buildRowFromJson = (j) => {
    const r = j?.result || {};
    return [
      undefined,
      r.regNo, r.class, r.chassis, r.engine,
      r.vehicleManufacturerName, r.model, r.vehicleColour,
      r.type, r.normsType, r.bodyType, r.ownerCount,
      r.owner, r.ownerFatherName, r.mobileNumber,
      r.status, r.statusAsOn, r.regAuthority, r.regDate,
      r.vehicleManufacturingMonthYear, r.rcExpiryDate, r.vehicleTaxUpto,
      r.vehicleInsuranceCompanyName, r.vehicleInsuranceUpto, r.vehicleInsurancePolicyNumber,
      r.rcFinancer, r.presentAddress, r.permanentAddress, r.vehicleCubicCapacity,
      r.grossVehicleWeight, r.unladenWeight, r.vehicleCategory, r.rcStandardCap,
      r.vehicleCylindersNo, r.vehicleSeatCapacity, r.vehicleSleeperCapacity,
      r.vehicleStandingCapacity, r.wheelbase, r.vehicleNumber, r.puccNumber,
      r.puccUpto, r.blacklistStatus, r.permitIssueDate, r.permitNumber,
      r.permitType, r.permitValidFrom, r.permitValidUpto, r.nonUseStatus,
      r.nonUseFrom, r.nonUseTo, r.nationalPermitNumber, r.nationalPermitUpto,
      r.nationalPermitIssuedBy, r.isCommercial ? 1 : 0, r.nocDetails, r.rtoCode,
    ];
  };

  function mapResponseToData(row) {
    return {
      regNo: row[1], class: row[2], chassis: row[3], engine: row[4],
      vehicleManufacturerName: row[5], model: row[6], vehicleColour: row[7],
      type: row[8], normsType: row[9], bodyType: row[10], ownerCount: row[11]?.toString(),
      owner: row[12], ownerFatherName: row[13], mobileNumber: row[14],
      status: row[15], statusAsOn: row[16], regAuthority: row[17], regDate: row[18],
      vehicleManufacturingMonthYear: row[19], rcExpiryDate: row[20], vehicleTaxUpto: row[21],
      vehicleInsuranceCompanyName: row[22], vehicleInsuranceUpto: row[23],
      vehicleInsurancePolicyNumber: row[24], rcFinancer: row[25],
      presentAddress: row[26], permanentAddress: row[27],
      vehicleCubicCapacity: row[28]?.toString(), grossVehicleWeight: row[29]?.toString(),
      unladenWeight: row[30]?.toString(), vehicleCategory: row[31], rcStandardCap: row[32]?.toString(),
      vehicleCylindersNo: row[33]?.toString(), vehicleSeatCapacity: row[34]?.toString(),
      vehicleSleeperCapacity: row[35]?.toString(), vehicleStandingCapacity: row[36]?.toString(),
      wheelbase: row[37]?.toString(), vehicleNumber: row[38], puccNumber: row[39], puccUpto: row[40],
      blacklistStatus: row[41] || "", permitIssueDate: row[42] || "", permitNumber: row[43],
      permitType: row[44], permitValidFrom: row[45], permitValidUpto: row[46],
      nonUseStatus: row[47] || "", nonUseFrom: row[48] || "", nonUseTo: row[49] || "",
      nationalPermitNumber: row[50] || "", nationalPermitUpto: row[51] || "",
      nationalPermitIssuedBy: row[52] || "", isCommercial: Boolean(row[53]),
      nocDetails: row[54] || "", rtoCode: row[55],
    };
  }

  const rawData = state?.data;
  const fallbackRow = useMemo(() => buildRowFromJson(dummy), []);
  const data = useMemo(
    () =>
      rawData && Array.isArray(rawData) && rawData.length > 0
        ? mapResponseToData(rawData[0])
        : mapResponseToData(fallbackRow),
    [rawData, fallbackRow]
  );

  // Two sections, both collapsible
  const [open, setOpen] = useState({ owner: true, car: true });
  const toggle = (k) => setOpen((s) => ({ ...s, [k]: !s[k] }));

  // Download handler (JSON dump)
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

      {/* Header row with identical buttons on the same line as title */}
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
          <div className="field"><div className="field-label">Owner</div><div className="field-value">{data.owner || "—"}</div></div>
          <div className="field"><div className="field-label">Owner Count</div><div className="field-value">{data.ownerCount || "—"}</div></div>
          <div className="field"><div className="field-label">Father/Guardian</div><div className="field-value">{data.ownerFatherName || "—"}</div></div>
          <div className="field"><div className="field-label">Mobile</div><div className="field-value">{data.mobileNumber || "—"}</div></div>
          <div className="field wide"><div className="field-label">Present Address</div><div className="field-value">{data.presentAddress || "—"}</div></div>
          <div className="field wide"><div className="field-label">Permanent Address</div><div className="field-value">{data.permanentAddress || "—"}</div></div>
        </div>
      </CardSection>

      {/* Car details */}
      <CardSection title="Car details" open={open.car} onToggle={() => toggle("car")}>
        <div className="grid-2">
          <div className="field"><div className="field-label">Registration No</div><div className="field-value">{data.regNo}</div></div>
          <div className="field"><div className="field-label">Class</div><div className="field-value">{data.class}</div></div>
          <div className="field"><div className="field-label">Status</div><div className="field-value">{data.status} {data.statusAsOn ? `(${data.statusAsOn})` : ""}</div></div>
          <div className="field"><div className="field-label">RTO</div><div className="field-value">{data.regAuthority}</div></div>

          <div className="field"><div className="field-label">Chassis</div><div className="field-value">{data.chassis}</div></div>
          <div className="field"><div className="field-label">Engine</div><div className="field-value">{data.engine}</div></div>
          <div className="field"><div className="field-label">Manufacturer</div><div className="field-value">{data.vehicleManufacturerName}</div></div>
          <div className="field"><div className="field-label">Model</div><div className="field-value">{data.model}</div></div>
          <div className="field"><div className="field-label">Colour</div><div className="field-value">{data.vehicleColour}</div></div>
          <div className="field"><div className="field-label">Fuel/Type</div><div className="field-value">{data.type}</div></div>
          <div className="field"><div className="field-label">Norms</div><div className="field-value">{data.normsType}</div></div>
          <div className="field"><div className="field-label">Body</div><div className="field-value">{data.bodyType}</div></div>

          <div className="field"><div className="field-label">Reg Date</div><div className="field-value">{data.regDate}</div></div>
          <div className="field"><div className="field-label">RC Expiry</div><div className="field-value">{data.rcExpiryDate}</div></div>
          <div className="field"><div className="field-label">Tax Upto</div><div className="field-value">{data.vehicleTaxUpto}</div></div>
          <div className="field"><div className="field-label">Insurance</div><div className="field-value">{data.vehicleInsuranceCompanyName} {data.vehicleInsuranceUpto ? `(${data.vehicleInsuranceUpto})` : ""}</div></div>
          <div className="field"><div className="field-label">Insurance No</div><div className="field-value">{data.vehicleInsurancePolicyNumber}</div></div>
          <div className="field"><div className="field-label">PUCC</div><div className="field-value">{data.puccNumber} {data.puccUpto ? `(${data.puccUpto})` : ""}</div></div>

          <div className="field"><div className="field-label">CC</div><div className="field-value">{data.vehicleCubicCapacity}</div></div>
          <div className="field"><div className="field-label">GVW</div><div className="field-value">{data.grossVehicleWeight}</div></div>
          <div className="field"><div className="field-label">Unladen</div><div className="field-value">{data.unladenWeight}</div></div>
          <div className="field"><div className="field-label">Category</div><div className="field-value">{data.vehicleCategory}</div></div>
          <div className="field"><div className="field-label">Cylinders</div><div className="field-value">{data.vehicleCylindersNo}</div></div>
          <div className="field"><div className="field-label">Seats</div><div className="field-value">{data.vehicleSeatCapacity}</div></div>
          <div className="field"><div className="field-label">Sleeper</div><div className="field-value">{data.vehicleSleeperCapacity}</div></div>
          <div className="field"><div className="field-label">Standing</div><div className="field-value">{data.vehicleStandingCapacity}</div></div>
          <div className="field"><div className="field-label">Wheelbase</div><div className="field-value">{data.wheelbase}</div></div>

          <div className="field"><div className="field-label">Permit No</div><div className="field-value">{data.permitNumber || "—"}</div></div>
          <div className="field"><div className="field-label">Permit Type</div><div className="field-value">{data.permitType || "—"}</div></div>
          <div className="field"><div className="field-label">Valid From</div><div className="field-value">{data.permitValidFrom || "—"}</div></div>
          <div className="field"><div className="field-label">Valid Upto</div><div className="field-value">{data.permitValidUpto || "—"}</div></div>
          <div className="field"><div className="field-label">Blacklist</div><div className="field-value">{data.blacklistStatus || "—"}</div></div>
          <div className="field"><div className="field-label">NOC</div><div className="field-value">{data.nocDetails || "—"}</div></div>
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
