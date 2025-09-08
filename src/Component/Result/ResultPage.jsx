import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./ResultsPage.css";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { reg_no } = useParams();

  // Map the raw array response to a structured object
  function mapResponseToData(row) {
    return {
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
    };
  }

  // Extract data from router state and map it
  const rawData = state?.data;
  const data = rawData && Array.isArray(rawData) && rawData.length > 0 ? mapResponseToData(rawData[0]) : null;

  useEffect(() => {
    if (!data) {
      navigate("/", { replace: true });
    }
  }, [data, navigate]);

  if (!data) return null;

  return (
    <div className="results-root">
      {/* Logo */}
      <div className="results-logo" aria-hidden="true">
        <img src="/images/logo.png" alt="Logo" className="results-logo-img" />
      </div>

      {/* Header */}
      <header className="results-header">
        <button className="results-back" onClick={() => navigate(-1)} aria-label="Go back">
          <span className="results-back-ic" aria-hidden="true">←</span>
          <span>Back</span>
        </button>
        <h1 className="results-title">Vahan Check</h1>
      </header>

      {/* Owner Details card */}
      <section className="panel glass card" aria-labelledby="owner-title">
        <h2 id="owner-title" className="card-title">Owner Details</h2>
        <div className="grid-2">
          <Field label="Owner" value={data.owner} />
          <Field label="Owner Father Name" value={data.ownerFatherName} />
          <Field label="Owner Count" value={data.ownerCount} />
          <Field label="Mobile Number" value={data.mobileNumber || "—"} />
          <Field label="Present Address" value={data.presentAddress} wide />
          <Field label="Permanent Address" value={data.permanentAddress} wide />
          <Field label="Status" value={data.status} />
          <Field label="Status As On" value={data.statusAsOn} />
          <Field label="Reg Authority" value={data.regAuthority} />
          <Field label="Reg Date" value={data.regDate} />
          <Field label="RC Expiry Date" value={data.rcExpiryDate} />
          <Field label="RC Financer" value={data.rcFinancer || "—"} />
          <Field label="RTO Code" value={data.rtoCode} />
          <Field label="NOC Details" value={data.nocDetails || "—"} />
          <Field label="Blacklist Status" value={data.blacklistStatus || "—"} />
          <Field label="Non-Use Status" value={data.nonUseStatus || "—"} />
          <Field label="Non-Use From" value={data.nonUseFrom || "—"} />
          <Field label="Non-Use To" value={data.nonUseTo || "—"} />
          <Field label="National Permit Number" value={data.nationalPermitNumber || "—"} />
          <Field label="National Permit Upto" value={data.nationalPermitUpto || "—"} />
          <Field label="National Permit Issued By" value={data.nationalPermitIssuedBy || "—"} />
          <Field label="Permit Number" value={data.permitNumber || "—"} />
          <Field label="Permit Type" value={data.permitType || "—"} wide />
          <Field label="Permit Valid From" value={data.permitValidFrom || "—"} />
          <Field label="Permit Valid Upto" value={data.permitValidUpto || "—"} />
          <Field label="Permit Issue Date" value={data.permitIssueDate || "—"} />
          <Field label="Is Commercial" value={String(data.isCommercial)} />
        </div>
      </section>

      {/* Car Details card */}
      <section className="panel glass card" aria-labelledby="car-title">
        <h2 id="car-title" className="card-title">Car Details</h2>
        <div className="grid-2">
          <Field label="Registration Number" value={data.regNo} />
          <Field label="Vehicle Number" value={data.vehicleNumber} />
          <Field label="Vehicle Class" value={data.class} />
          <Field label="Vehicle Category" value={data.vehicleCategory} />
          <Field label="Manufacturer" value={data.vehicleManufacturerName} />
          <Field label="Model" value={data.model} />
          <Field label="Colour" value={data.vehicleColour} />
          <Field label="Fuel Type" value={data.type} />
          <Field label="Norms Type" value={data.normsType} />
          <Field label="Body Type" value={data.bodyType} />
          <Field label="Manufacturing (MM/YY)" value={data.vehicleManufacturingMonthYear} />
          <Field label="Chassis No." value={data.chassis} />
          <Field label="Engine No." value={data.engine} />
          <Field label="Cubic Capacity (cc)" value={data.vehicleCubicCapacity} />
          <Field label="Cylinders" value={data.vehicleCylindersNo} />
          <Field label="Seat Capacity" value={data.vehicleSeatCapacity} />
          <Field label="Sleeper Capacity" value={data.vehicleSleeperCapacity} />
          <Field label="Standing Capacity" value={data.vehicleStandingCapacity} />
          <Field label="Wheelbase (mm)" value={data.wheelbase} />
          <Field label="Gross Vehicle Weight (kg)" value={data.grossVehicleWeight} />
          <Field label="Unladen Weight (kg)" value={data.unladenWeight} />
          <Field label="RC Standard Cap" value={data.rcStandardCap} />
          <Field label="Tax Upto" value={data.vehicleTaxUpto} />
          <Field label="Insurance Company" value={data.vehicleInsuranceCompanyName} wide />
          <Field label="Insurance Upto" value={data.vehicleInsuranceUpto} />
          <Field label="Insurance Policy No." value={data.vehicleInsurancePolicyNumber} />
          <Field label="PUCC Number" value={data.puccNumber} />
          <Field label="PUCC Upto" value={data.puccUpto} />
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, wide = false }) {
  return (
    <div className={`field ${wide ? "wide" : ""}`}>
      <div className="field-label">{label}</div>
      <div className="field-value">{value ?? "—"}</div>
    </div>
  );
}
