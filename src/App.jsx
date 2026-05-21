import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function App() {
  const pageRef = useRef();

  const [form, setForm] = useState({
    name: "",
    department: "",
    position: "조교수/연구원/학생",
    startDate: "",
    endDate: "",
    destination: "",
  });

  const [mealProvided, setMealProvided] = useState(0);
  const [meetingMeals, setMeetingMeals] = useState(0);

  const [lodging, setLodging] = useState({
    region: "서울",
    amount: 0,
    shared: false,
    people: 2,
  });

  const [transport, setTransport] = useState(0);

  const mealUnit = 25000;
  const dailyAllowance = 20000;

  const isProfessor = form.position === "교수/부교수";

  const lodgingLimit = isProfessor
    ? "실비 지급"
    : lodging.region === "서울"
    ? 100000
    : lodging.region === "광역시"
    ? 80000
    : 70000;

  const mealAmount =
    Math.max(0, 3 - mealProvided - meetingMeals) * mealUnit;

  const total =
    mealAmount +
    dailyAllowance +
    Number(lodging.amount) +
    Number(transport);

  // 교수일 경우 지역 자동 고정
  useEffect(() => {
    if (isProfessor) {
      setLodging((prev) => ({
        ...prev,
        region: "서울",
      }));
    }
  }, [isProfessor]);

  const saveImage = async () => {
    const canvas = await html2canvas(pageRef.current);
    const link = document.createElement("a");
    link.download = "출장비신청서.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const savePDF = async () => {
    const canvas = await html2canvas(pageRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("출장비신청서.pdf");
  };

  return (
    <div style={pageStyle}>
      <div ref={pageRef} style={containerStyle}>

        <h1 style={{ fontSize: 28 }}>출장비 신청서</h1>
        <p style={{ color: "#64748b" }}>자동 계산 시스템</p>

        {/* 기본정보 */}
        <section style={sectionStyle}>
          <h2>기본 정보</h2>

          <div style={grid3}>
            <Input label="이름" value={form.name}
              onChange={(v) => setForm({ ...form, name: v })} />

            <Input label="소속" value={form.department}
              onChange={(v) => setForm({ ...form, department: v })} />

            <div>
              <label>직급</label>
              <select
                style={inputStyle}
                value={form.position}
                onChange={(e) =>
                  setForm({ ...form, position: e.target.value })
                }
              >
                <option>교수/부교수</option>
                <option>조교수/연구원/학생</option>
              </select>
            </div>

            <Input label="출장지" value={form.destination}
              onChange={(v) => setForm({ ...form, destination: v })} />

            <Input label="시작일" type="date"
              value={form.startDate}
              onChange={(v) => setForm({ ...form, startDate: v })} />

            <Input label="종료일" type="date"
              value={form.endDate}
              onChange={(v) => setForm({ ...form, endDate: v })} />
          </div>
        </section>

        {/* 식비 */}
        <section style={sectionStyle}>
          <h2>식비 / 회의비</h2>

          <div style={grid2}>
            <SelectBox label="식대 제공" value={mealProvided} setValue={setMealProvided} />
            <SelectBox label="회의비 사용" value={meetingMeals} setValue={setMeetingMeals} />
          </div>
        </section>

        {/* 숙박 */}
        <section style={sectionStyle}>
          <h2>숙박비</h2>

          <div style={grid3}>
            <select
              style={{
                ...inputStyle,
                background: isProfessor ? "#e5e7eb" : "white",
                cursor: isProfessor ? "not-allowed" : "pointer",
              }}
              value={lodging.region}
              disabled={isProfessor}
              onChange={(e) =>
                setLodging({ ...lodging, region: e.target.value })
              }
            >
              <option>서울</option>
              <option>광역시</option>
              <option>기타(제주 포함)</option>
            </select>

            <div style={infoBox}>
              기준: {typeof lodgingLimit === "number"
                ? lodgingLimit.toLocaleString() + "원"
                : lodgingLimit}
            </div>

            <Input
              label="숙박비"
              type="number"
              value={lodging.amount}
              onChange={(v) =>
                setLodging({ ...lodging, amount: v })
              }
            />
          </div>
        </section>

        {/* 교통 */}
        <section style={sectionStyle}>
          <h2>교통비</h2>

          <Input label="교통비"
            type="number"
            value={transport}
            onChange={setTransport} />
        </section>

        {/* 요약 */}
        <section style={{ marginTop: 30 }}>
          <h2>정산 요약</h2>

          <div style={summaryGrid}>
            <SummaryCard title="식비" value={mealAmount} />
            <SummaryCard title="일비" value={dailyAllowance} />
            <SummaryCard title="숙박비" value={lodging.amount} />
            <SummaryCard title="교통비" value={transport} />
            <SummaryCard title="총액" value={total} blue />
          </div>
        </section>

        {/* 버튼 */}
        <div style={btnWrap}>
          <button style={btn} onClick={saveImage}>이미지 저장</button>
          <button style={btn} onClick={savePDF}>PDF 저장</button>
        </div>

      </div>
    </div>
  );
}

/* ===== 컴포넌트 ===== */

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

function SelectBox({ label, value, setValue }) {
  return (
    <div>
      <label>{label}</label>
      <select
        style={inputStyle}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      >
        <option value={0}>0</option>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
      </select>
    </div>
  );
}

function SummaryCard({ title, value, blue }) {
  return (
    <div style={{
      background: blue ? "#dbeafe" : "#f8fafc",
      padding: 20,
      borderRadius: 14
    }}>
      <div style={{ color: "#64748b" }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: "bold" }}>
        {Number(value).toLocaleString()}원
      </div>
    </div>
  );
}

/* ===== 스타일 ===== */

const pageStyle = {
  background: "#f3f4f6",
  minHeight: "100vh",
  padding: 30,
};

const containerStyle = {
  maxWidth: 900,
  margin: "0 auto",
  background: "white",
  padding: 30,
  borderRadius: 20,
};

const sectionStyle = {
  marginTop: 30,
};

const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 15,
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 15,
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 15,
  marginTop: 20,
};

const inputStyle = {
  width: "100%",
  padding: 10,
  marginTop: 6,
  borderRadius: 10,
  border: "1px solid #d1d5db",
};

const infoBox = {
  padding: 10,
  background: "#f8fafc",
  borderRadius: 10,
};

const btnWrap = {
  marginTop: 30,
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
};

const btn = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
};